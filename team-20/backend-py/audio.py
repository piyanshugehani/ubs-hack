import os
from flask import Flask, request, jsonify
from google.generativeai import models
from werkzeug.utils import secure_filename
from groq import Groq
from pymongo import MongoClient
from datetime import datetime
import google.generativeai as genai

app = Flask(__name__)

# ----------------------------
# 1. Configure Upload Folder
# ----------------------------
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# ----------------------------
# 2. API keys configuration
# ----------------------------
GROQ_API_KEY = "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"
GEMINI_API_KEY = "AIzaSyADzLM7nBo0LCGqTs7qjqOVop4wtSMwOT8"  # Replace with your actual Gemini API key

# Initialize clients
groq_client = Groq(api_key=GROQ_API_KEY)
genai.configure(api_key=GEMINI_API_KEY)
# # List available models
# models = genai.list_models()

# # Print model names
# for model in models:
#     print(model.name)
gemini_model = genai.GenerativeModel('gemini-2.0-flash')

# ----------------------------
# 3. MongoDB Connection
# ----------------------------
MONGODB_URI = "mongodb+srv://piyanshugehani22:MTxyII7ZYJhvlyfm@ondcdb.jqfg4.mongodb.net/?retryWrites=true&w=majority&appName=ondcDB"
mongo_client = MongoClient(MONGODB_URI)
db = mongo_client["test"]
transcripts_collection = db["transcripts"]

# ----------------------------
# 4. Helper function for Gemini notes generation
# ----------------------------
def generate_student_notes(transcript):
    prompt = f"""
Tum ek expert teacher ho jo rural area ke students ke liye asaan aur structured study notes bana rahe ho.  
Agar lecture **Hindi me hai, toh notes Hinglish me likho** (English alphabets me Hindi).  

## **Instructions:**
- **Jo language lecture me di gayi hai, wahi language use karo.**  
- **Hinglish format use karo** agar lecture Hindi me hai (example: "Nadi mitti lekar chalti hai aur samundar tak aate aate usse gira deti hai.").  
- Notes ko ache tareeke se likho taaki easily PDF me convert ho sake.  

---

## **Required Sections and Formatting Rules:**  

### **1. Key Concepts Explained**  
✅ **Short paragraphs** me likho which is easy to understand.  
✅ Complex concepts ko **simple terms me break** karo.  

### **2. Important Definitions**  
✅ Key terms ko **bold me highlight** karo (Example: **Delta:** Nadi ke samundar se milne par bani nayi zameen).  

### **3. Step-by-Step Explanations**  
✅ **Numbered list (1, 2, 3...)** use karo process samjhane ke liye.  

### **4. Real-world Examples**  
✅ **Kam se kam 2 examples do** jo rural students relate kar sake.  
✅ **Roz ke jeevan se comparison do** (e.g., kheti, nadia, mitti).  

### **5. Common Mistakes to Avoid**  
✅ **Mistakes bullet points me likho**, aur **correction uske neeche** do.  

### **6. Summary in Simple Language**  
✅ **Short aur friendly summary likho**, jaise kisi chhote bachhe ko samjha rahe ho.  

---

## **Lecture Transcript:**  
{transcript}
"""

    
    try:
        response = gemini_model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Error generating notes with Gemini: {str(e)}")
        return None

# ----------------------------
# 5. Flask Route
# ----------------------------
@app.route("/transcripts", methods=["POST"])
def generate_transcript():
    print("Request received", request)
    print("Files received:", list(request.files.keys()))

    if "File" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["File"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(file_path)

    try:
        # Process audio with Groq
        with open(file_path, "rb") as audio_file:
            transcription = groq_client.audio.transcriptions.create(
                file=(filename, audio_file.read()),
                model="distil-whisper-large-v3-en",
                response_format="verbose_json",
                timestamp_granularities=["word"],
            )

        transcript_text = transcription.text
        word_timestamps = transcription.words

        # Generate student notes using Gemini
        student_notes = generate_student_notes(transcript_text)
        
        # Store in MongoDB
        doc = {
            "filename": filename,
            "transcript": transcript_text,
            "words": word_timestamps,
            "student_notes": student_notes,
            "createdAt": datetime.utcnow()
        }

        result = transcripts_collection.insert_one(doc)
        inserted_id = str(result.inserted_id)

        # Clean up
        os.remove(file_path)

        # Return response
        return jsonify({
            "transcript": transcript_text,
            "words": word_timestamps,
            "student_notes": student_notes,
            "mongo_id": inserted_id
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ----------------------------
# 6. Run Flask
# ----------------------------
if __name__ == "__main__":
    app.run(debug=True)