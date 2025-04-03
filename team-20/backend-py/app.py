from flask import Flask, request, jsonify
from flask_cors import CORS
from utils.recommendation import recommend_slots, recommend_volunteers_to_school
from pymongo import MongoClient
from bson import json_util
import json

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
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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

if __name__ == "__main__":
    app.run(debug=True)