import os
import cv2
import glob
import numpy as np
from flask import Flask, request, send_file
from skimage.metrics import structural_similarity as ssim
from werkzeug.utils import secure_filename
from PIL import Image

app = Flask(__name__)

UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "output"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)


def extract_filled_frames(video_path, output_dir, threshold=0.7):
    """Extracts key frames from a video where content changes significantly."""
    cap = cv2.VideoCapture(video_path)
    os.makedirs(output_dir, exist_ok=True)

    prev_frame = None
    saved_count = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        if prev_frame is not None:
            similarity = ssim(prev_frame, gray_frame)

            # Save frame if it's significantly different
            if similarity < threshold:
                frame_path = os.path.join(output_dir, f"frame_{saved_count}.jpg")
                cv2.imwrite(frame_path, frame)
                saved_count += 1

        prev_frame = gray_frame.copy()

    cap.release()
    return output_dir


def create_pdf(image_dir, output_pdf):
    """Converts extracted frames to a PDF."""
    image_files = sorted(glob.glob(f"{image_dir}/*.jpg"))
    images = [Image.open(img).convert("RGB") for img in image_files]

    if images:
        images[0].save(output_pdf, save_all=True, append_images=images[1:])
        return output_pdf
    return None


@app.route("/generate_notes", methods=["POST"])
def generate_notes():
    """API to extract key frames from video and return a PDF of screenshots."""
    if "video" not in request.files:
        return {"error": "No video file provided"}, 400

    video_file = request.files["video"]
    if video_file.filename == "":
        return {"error": "No selected file"}, 400

    filename = secure_filename(video_file.filename)
    video_path = os.path.join(UPLOAD_FOLDER, filename)
    video_file.save(video_path)

    print("Received video file:", video_path)

    # Extract key frames
    frame_output_dir = os.path.join(OUTPUT_FOLDER, os.path.splitext(filename)[0])
    os.makedirs(frame_output_dir, exist_ok=True)
    extract_filled_frames(video_path, frame_output_dir)

    print("Extracted frames saved to:", frame_output_dir)

    # Convert frames to PDF
    pdf_path = os.path.join(OUTPUT_FOLDER, f"{os.path.splitext(filename)[0]}.pdf")
    pdf_result = create_pdf(frame_output_dir, pdf_path)

    if pdf_result:
        return send_file(pdf_result, as_attachment=True)
    else:
        return {"error": "No valid frames detected"}, 500


if __name__ == "__main__":
    app.run(debug=True, port=5001)

