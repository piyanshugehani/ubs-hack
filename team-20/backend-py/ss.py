import os
import cv2
import numpy as np
from flask import Flask, request, send_file, jsonify, render_template_string
from skimage.metrics import structural_similarity as ssim
from PIL import Image
import matplotlib.pyplot as plt
from io import BytesIO
from flask_cors import CORS
import base64
import tempfile
from scipy.signal import find_peaks, savgol_filter
from scipy.ndimage import gaussian_filter1d

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

def calculate_frame_importance(frame):
    """Calculate importance score of a frame based on text content and visual distinctiveness."""
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    
    # Edge detection to identify text and visual elements
    edges = cv2.Canny(gray, 100, 200)
    text_score = np.sum(edges > 0) / edges.size
    
    # Calculate brightness variance (high variance often indicates important content)
    brightness_variance = np.var(gray) / 10000
    
    return text_score + brightness_variance

def is_filled(frame, brightness_threshold=220):
    """Check if frame contains meaningful content (not blank)."""
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    return np.mean(gray) < brightness_threshold

def extract_key_frames_dp(video_path, min_frames=3, max_frames=5):
    """Extract key frames from video using a dynamic programming approach."""
    if not os.path.exists(video_path):
        raise Exception(f"Video file not found: {video_path}")

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise Exception("Error opening video file")

    try:
        fps = cap.get(cv2.CAP_PROP_FPS)
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        duration = total_frames / fps
        
        # For videos under 1 minute, sample every 3 seconds
        sample_interval = max(1, int(fps * 3))
            
        print(f"Processing {duration:.1f}s video, sampling every {sample_interval/fps:.1f} seconds")
        
        frame_metrics = []
        frame_indices = []
        
        for frame_idx in range(0, total_frames, sample_interval):
            cap.set(cv2.CAP_PROP_POS_FRAMES, frame_idx)
            ret, frame = cap.read()
            if not ret:
                break
                
            if is_filled(frame):
                importance = calculate_frame_importance(frame)
                frame_metrics.append(importance)
                frame_indices.append(frame_idx)
        
        if not frame_metrics:
            raise Exception("No valid frames found in video")
            
        # For videos under 1 minute, target 3 frames
        target_frames = 3 if duration < 60 else min(max(min_frames, int(duration / 60 * 3)), max_frames)
        
        selected_indices = []
        
        if len(frame_metrics) <= target_frames:
            selected_indices = list(range(len(frame_metrics)))
        else:
            # Find peaks in importance score
            peaks = []
            for i in range(1, len(frame_metrics) - 1):
                if frame_metrics[i] > frame_metrics[i-1] and frame_metrics[i] > frame_metrics[i+1]:
                    peaks.append((frame_metrics[i], i))
            
            peaks.sort(reverse=True)
            
            # Take top N peaks with minimum distance constraint
            min_distance = len(frame_metrics) // (target_frames * 2)
            selected = []
            
            for _, idx in peaks:
                if all(abs(idx - s) >= min_distance for s in selected):
                    selected.append(idx)
                    if len(selected) >= target_frames:
                        break
            
            selected_indices = sorted(selected)
        
        frames = []
        for idx in selected_indices:
            orig_frame_idx = frame_indices[idx]
            cap.set(cv2.CAP_PROP_POS_FRAMES, orig_frame_idx)
            ret, frame = cap.read()
            if ret:
                rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                frames.append(Image.fromarray(rgb_frame))
        
        vis_data = {
            'frame_indices': frame_indices,
            'metrics': frame_metrics,
            'selected': [frame_indices[i] for i in selected_indices],
            'selected_values': [frame_metrics[i] for i in selected_indices]
        }
        
        return frames, vis_data

    finally:
        cap.release()

def create_visualization(vis_data):
    """Create visualization of frame importance and selected frames."""
    plt.figure(figsize=(10, 6))
    plt.plot(vis_data['frame_indices'], vis_data['metrics'], color='blue', alpha=0.6)
    plt.scatter(vis_data['selected'], vis_data['selected_values'], color='red', s=50)
    
    for i, (x, y) in enumerate(zip(vis_data['selected'], vis_data['selected_values'])):
        plt.annotate(f"{x}", (x, y), xytext=(0, 10), 
                    textcoords='offset points', color='red', fontsize=10)
    
    plt.title('Frame Importance Over Time')
    plt.xlabel('Frame Number')
    plt.ylabel('Importance Score')
    plt.grid(True, alpha=0.3)
    
    buf = BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    plt.close()
    return buf

def create_pdf(frames):
    """Create a PDF from extracted key frames."""
    if not frames:
        return None

    try:
        pdf_buffer = BytesIO()
        frames[0].save(pdf_buffer, format='PDF', save_all=True, append_images=frames[1:])
        pdf_buffer.seek(0)
        return pdf_buffer
    except Exception as e:
        print(f"Error creating PDF: {str(e)}")
        return None

@app.route("/generate_notes", methods=["POST"])
def generate_notes():
    """Handles video file upload and generates lecture notes as a PDF."""
    if 'video' not in request.files:
        return jsonify({"error": "No video file provided"}), 400

    video_file = request.files['video']
    if video_file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        temp_path = os.path.join('temp', video_file.filename)
        os.makedirs('temp', exist_ok=True)
        video_file.save(temp_path)

        frames, vis_data = extract_key_frames_dp(temp_path)
        pdf_buffer = create_pdf(frames)

        os.remove(temp_path)

        if pdf_buffer:
            return send_file(
                pdf_buffer,
                mimetype="application/pdf",
                as_attachment=True,
                download_name="lecture_notes.pdf"
            )
        return jsonify({"error": "Failed to generate PDF"}), 500
    except Exception as e:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        return jsonify({"error": str(e)}), 500

@app.route("/visualization", methods=["POST"])
def get_visualization():
    """Generate and return visualization of frame selection process."""
    if 'video' not in request.files:
        return jsonify({"error": "No video file provided"}), 400

    video_file = request.files['video']
    try:
        temp_path = os.path.join('temp', video_file.filename)
        os.makedirs('temp', exist_ok=True)
        video_file.save(temp_path)
        
        _, vis_data = extract_key_frames_dp(temp_path)
        vis_buffer = create_visualization(vis_data)
        
        os.remove(temp_path)
        
        return send_file(
            vis_buffer,
            mimetype="image/png",
            as_attachment=False
        )
    except Exception as e:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        return jsonify({"error": str(e)}), 500

@app.route("/visualize_only", methods=["POST"])
def visualize_only():
    """Generate and display just the visualization."""
    if 'video' not in request.files:
        return jsonify({"error": "No video file provided"}), 400

    video_file = request.files['video']
    if video_file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        temp_fd, temp_path = tempfile.mkstemp(suffix=os.path.splitext(video_file.filename)[1])
        os.close(temp_fd)
        video_file.save(temp_path)

        try:
            _, vis_data = extract_key_frames_dp(temp_path)
        except NameError:
            # Fallback to extract_key_frames_dp if optimized version not available
            _, vis_data = extract_key_frames_dp(temp_path)
            
        vis_buffer = create_visualization(vis_data)
        
        if os.path.exists(temp_path):
            os.remove(temp_path)
            
        vis_buffer.seek(0)
        return send_file(
            vis_buffer,
            mimetype="image/png",
            as_attachment=False
        )
            
    except Exception as e:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        return jsonify({"error": str(e)}), 500
@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=False) 
