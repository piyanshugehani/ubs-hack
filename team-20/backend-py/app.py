from flask import Flask, request, jsonify
from utils.recommendation import recommend_slots,recommend_volunteers_to_school
import json
from bson import json_util
from pymongo import MongoClient
from datetime import datetime
from flask_cors import CORS

db_client = MongoClient("mongodb://localhost:27017/")
db = db_client["volunteer_matching_db"]

app = Flask(__name__)

CORS(app)
@app.route("/recommend_slots", methods=["GET"])
def recommend_slots_endpoint():
    volunteer_id = request.args.get("volunteer_id")
    if not volunteer_id:
        return jsonify({"error": "Missing volunteer_id"}), 400

    recommendations = recommend_slots(int(volunteer_id))
    return jsonify(recommendations)

@app.route("/recommend_volunteers", methods=["GET"])
def recommend_volunteers_endpoint():
    school_id = request.args.get("school_id")
    if not school_id:
        return jsonify({"error": "Missing school_id"}), 400

    recommendations = recommend_volunteers_to_school(int(school_id))
    return jsonify(recommendations)

@app.route("/volunteers", methods=["GET"])
def get_volunteers():
    volunteers = list(db.volunteers.find())
    return jsonify(json.loads(json_util.dumps(volunteers)))

@app.route("/schools", methods=["GET"])
def get_schools():
    schools = list(db.schools.find())
    return jsonify(json.loads(json_util.dumps(schools)))

@app.route("/chapters", methods=["GET"])
def get_chapters():
    chapters = list(db.chapters.find())
    return jsonify(json.loads(json_util.dumps(chapters)))

@app.route("/slots", methods=["GET"])
def get_slots():
    slots = list(db.slots.find())
    return jsonify(json.loads(json_util.dumps(slots)))

@app.route("/volunteer/<int:volunteer_id>", methods=["GET"])
def get_volunteer(volunteer_id):
    volunteer = db.volunteers.find_one({"volunteer_id": volunteer_id})
    if not volunteer:
        return jsonify({"error": "Volunteer not found"}), 404
    return jsonify(json.loads(json_util.dumps(volunteer)))

@app.route("/school/<int:school_id>", methods=["GET"])
def get_school(school_id):
    school = db.schools.find_one({"school_id": school_id})
    if not school:
        return jsonify({"error": "School not found"}), 404
    return jsonify(json.loads(json_util.dumps(school)))





if __name__ == "__main__":
    app.run(debug=True)
