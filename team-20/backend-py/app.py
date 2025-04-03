from flask import Flask, request, jsonify
from flask_cors import CORS
from utils.recommendation import recommend_slots, recommend_volunteers_to_school
from pymongo import MongoClient
from bson import json_util
import json
import os
from utils.extraction import get_structured_syllabus_from_pdf,extract_text_from_pdf,upload_to_cloudinary
import tempfile
app = Flask(__name__)
CORS(app)

client = MongoClient("mongodb://localhost:27017")
db = client["volunteer_matching_db"]

def validate_syllabus(syllabus):
    """Validate syllabus structure"""
    if not isinstance(syllabus.get('subjects', []), list):
        return False
    for subject in syllabus.get('subjects', []):
        if not isinstance(subject, dict) or 'title' not in subject:
            return False
        if not isinstance(subject.get('chapters', []), list):
            return False
    return True

@app.route("/volunteers", methods=["GET"])
def get_volunteers():
    try:
        volunteers = list(db.volunteers.find())
        return jsonify(json.loads(json_util.dumps(volunteers)))
    except Exception as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500

@app.route("/schools", methods=["GET"])
def get_schools():
    try:
        schools = list(db.schools.find())
        return jsonify(json.loads(json_util.dumps(schools)))
    except Exception as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500

@app.route("/syllabus", methods=["GET"])
def get_syllabus():
    try:
        syllabi = list(db.syllabus.find())
        validated_syllabi = []
        for syllabus in syllabi:
            if validate_syllabus(syllabus):
                validated_syllabi.append(syllabus)
            else:
                app.logger.warning(f"Invalid syllabus structure found: {syllabus.get('syllabus_id')}")
        return jsonify(json.loads(json_util.dumps(validated_syllabi)))
    except Exception as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500

@app.route("/recommend_slots", methods=["GET"])
def recommend_slots_endpoint():
    volunteer_id = request.args.get("volunteer_id")
    if not volunteer_id:
        return jsonify({"error": "Missing volunteer_id parameter"}), 400
    
    try:
        recommendations = recommend_slots(int(volunteer_id))
        if "error" in recommendations:
            return jsonify(recommendations), 404
        return jsonify(recommendations)
    except ValueError:
        return jsonify({"error": "Invalid volunteer_id format"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/recommend_volunteers", methods=["GET"])
def recommend_volunteers_endpoint():
    school_id = request.args.get("school_id")
    if not school_id:
        return jsonify({"error": "Missing school_id parameter"}), 400
    
    try:
        recommendations = recommend_volunteers_to_school(int(school_id))
        if "error" in recommendations:
            return jsonify(recommendations), 404
        return jsonify(recommendations)
    except ValueError:
        return jsonify({"error": "Invalid school_id format"}), 400
    # except Exception as e:
    #     return jsonify({"error": str(e)}), 500

@app.route("/volunteer/<int:volunteer_id>", methods=["GET"])
def get_volunteer(volunteer_id):
    try:
        volunteer = db.volunteers.find_one({"volunteer_id": volunteer_id})
        if not volunteer:
            return jsonify({"error": "Volunteer not found"}), 404
        return jsonify(json.loads(json_util.dumps(volunteer)))
    except Exception as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500

@app.route("/school/<int:school_id>", methods=["GET"])
def get_school(school_id):
    try:
        school = db.schools.find_one({"school_id": school_id})
        if not school:
            return jsonify({"error": "School not found"}), 404
        return jsonify(json.loads(json_util.dumps(school)))
    except Exception as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500

@app.route("/syllabus/<int:school_id>", methods=["GET"])
def get_school_syllabus(school_id):
    try:
        syllabi = list(db.syllabus.find({"school_id": school_id}))
        if not syllabi:
            return jsonify({"error": "No syllabi found for this school"}), 404
        
        validated_syllabi = []
        for syllabus in syllabi:
            if validate_syllabus(syllabus):
                validated_syllabi.append(syllabus)
            else:
                app.logger.warning(f"Invalid syllabus structure found for school {school_id}")
        
        if not validated_syllabi:
            return jsonify({"error": "No valid syllabi found for this school"}), 404
            
        return jsonify(json.loads(json_util.dumps(validated_syllabi)))
    except Exception as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500


@app.route('/extract_syllabus', methods=['POST'])
def extract_syllabus():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Save the file temporarily
    temp_pdf_path = tempfile.mktemp(suffix=".pdf")
    file.save(temp_pdf_path)

    try:
        # Upload to Cloudinary
        cloudinary_url = upload_to_cloudinary(temp_pdf_path)
        
        # Extract text from PDF using combined approach with OCR
        extracted_text = extract_text_from_pdf(temp_pdf_path)

        if not extracted_text:
            return jsonify({"error": "Failed to extract text from PDF"}), 500

        # Use Gemini to parse syllabus details
        syllabus_details = get_structured_syllabus_from_pdf(temp_pdf_path, extracted_text)
        
        # Add the Cloudinary URL to the response
        if cloudinary_url:
            syllabus_details["file_url"] = cloudinary_url

        return jsonify(syllabus_details), 200

    except Exception as e:
        return jsonify({"error": f"An error occurred during extraction: {str(e)}"}), 500

    finally:
        # Cleanup temporary file
        try:
            os.remove(temp_pdf_path)
        except:
            pass




@app.route('/syllabus/upload', methods=['POST'])
def upload_syllabus():
    try:
        # Get syllabus data from request body
        syllabus_data = request.json
        
        if not syllabus_data:
            return jsonify({"error": "No syllabus data provided"}), 400
            
        # Validate the data
        if 'subjects' not in syllabus_data or not isinstance(syllabus_data['subjects'], list):
            return jsonify({"error": "Invalid syllabus format: subjects array is required"}), 400
        
        school_id = syllabus_data.get('id')  # Get school ID
        
        # Create main syllabus document
        syllabus = {
            "school_id": int(school_id) if school_id else None,
            "title": syllabus_data.get('title', ''),
            "description": syllabus_data.get('description', ''),
            "grade": syllabus_data.get('grade', 'Not Specified'),
            "file_url": syllabus_data.get('file_url', ''),
            "subjects": [],
            "syllabus_id": db.syllabus.count_documents({}) + 1  # Generate a new syllabus_id
        }
        
        # Process subjects and their chapters
        for subject_data in syllabus_data.get('subjects', []):
            subject = {
                "title": subject_data.get('title', ''),
                "description": subject_data.get('description', ''),
                "chapters": []
            }
            
            # Process chapters
            for chapter_data in subject_data.get('chapters', []):
                chapter = {
                    "title": chapter_data.get('title', ''),
                    "description": chapter_data.get('description', ''),
                    "year": chapter_data.get('year', ''),
                    "required_skills": {
                        "skills": chapter_data.get('required_skills', {}).get('skills', []) 
                                  if isinstance(chapter_data.get('required_skills', {}), dict) else []
                    },
                    "weightage": chapter_data.get('weightage', 0),
                    "assignedOrNot": chapter_data.get('assignedOrNot', False),
                    "session_daterange": chapter_data.get('session_daterange', ''),
                    "numberOfHours": chapter_data.get('numberOfHours', 0)
                }
                subject['chapters'].append(chapter)
                
            syllabus['subjects'].append(subject)
                
        # Insert syllabus document
        result = db.syllabus.insert_one(syllabus)
        
        # Get the inserted syllabus with its ID
        inserted_syllabus = db.syllabus.find_one({"_id": result.inserted_id})
        
        return jsonify({
            "success": True,
            "message": "Syllabus uploaded successfully",
            "data": json.loads(json_util.dumps(inserted_syllabus))
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Error uploading syllabus",
            "error": str(e)
        }), 500





if __name__ == "__main__":
    app.run(debug=True)