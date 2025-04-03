from pymongo import MongoClient
from datetime import datetime
import json

client = MongoClient("mongodb://localhost:27017")
db = client["volunteer_matching_db"]

def get_skill_match(volunteer_skills, required_skills):
    if not required_skills:
        return 1.0
    matches = []
    for skill, required_level in required_skills.items():
        volunteer_level = volunteer_skills.get(skill, 0)
        matches.append(min(volunteer_level / required_level, 1.0))
    return sum(matches) / len(required_skills)

def check_availability(volunteer_availability, day_of_week):
    return any(slot["day"] == day_of_week for slot in volunteer_availability)

def calculate_performance_score(metrics):
    rating = metrics.get("rating", 3.0)
    retention = metrics.get("student_retention", 50.0)
    return (rating / 5 * 0.6) + (retention / 100 * 0.4)

def recommend_slots(volunteer_id):
    volunteer = db.volunteers.find_one({"volunteer_id": int(volunteer_id)})
    if not volunteer:
        return {"error": "Volunteer not found"}
    
    all_slots = list(db.slots.find({"assignedOrNot": "unassigned"}))
    recommendations = []
    current_date = datetime.now().date()
    
    for slot in all_slots:
        chapter = slot["chapter_data"]
        start_date = datetime.strptime(chapter["schedule"]["start_date"], "%Y-%m-%d").date()
        
        skill_score = get_skill_match(volunteer["skills"], chapter["required_skills"])
        day_of_week = start_date.strftime("%A")
        availability_penalty = 0 if check_availability(volunteer["availability"], day_of_week) else -0.2
        
        performance_score = calculate_performance_score(volunteer["metrics"])
        workload_score = max(0, (volunteer["preferences"]["max_hours_per_week"] - 
                                 volunteer["metrics"]["hours_taught"]) / 
                                 volunteer["preferences"]["max_hours_per_week"])
        urgency_bonus = 0.1 if slot["is_urgent"] else 0

        total_score = (
            skill_score * 0.45 +
            performance_score * 0.25 +
            workload_score * 0.2 +
            urgency_bonus +
            availability_penalty
        )

        # Generate match reason based on scores
        match_reasons = []
        if skill_score > 0.8:
            match_reasons.append("High skill match")
        if performance_score > 0.7:
            match_reasons.append("Good performance history")
        if workload_score > 0.5:
            match_reasons.append("Suitable workload")
        if urgency_bonus > 0:
            match_reasons.append("Urgent slot")
        
        recommendations.append({
            "slot_id": slot["slot_id"],
            "chapter_title": chapter["title"],
            # "subject": chapter["subject"],
            "language": chapter.get("language", "English"),
            "matchScore": round(total_score * 100, 2),
            "matchReason": ", ".join(match_reasons),
            "schedule": {
                "day": day_of_week,
                "time": chapter["schedule"].get("time", "TBD")
            }
        })
    
    recommendations.sort(key=lambda x: x["matchScore"], reverse=True)
    return {"recommended_slots": recommendations}
def recommend_volunteers_to_school(school_id):
    school = db.schools.find_one({"school_id": int(school_id)})
    if not school:
        return {"error": "School not found"}
    
    syllabi = list(db.syllabus.find({"school_id": int(school_id)}))
    volunteers = list(db.volunteers.find())
    recommendations = []
    current_date = datetime.now().date()

    for volunteer in volunteers:
        total_scores = []
        matching_chapters = []

        for syllabus in syllabi:
            for subject in syllabus["subjects"]:
                for chapter in subject["chapters"]:
                    start_date = datetime.strptime(chapter["schedule"]["start_date"], "%Y-%m-%d").date()
                    skill_score = get_skill_match(volunteer["skills"], chapter["required_skills"])
                    
                    day_of_week = start_date.strftime("%A")
                    availability_penalty = 0 if check_availability(volunteer["availability"], day_of_week) else -0.2
                    performance_score = calculate_performance_score(volunteer["metrics"])
                    location_match = 1.0 if volunteer["preferences"]["location"] == school["location"] else 0.5
                    language_match = any(lang["code"] in school["requirements"]["languages"] 
                                         for lang in volunteer["languages"])
                    subject_match = 1.0 if subject["title"] in volunteer["preferences"]["subjects"] else 0.6
                    
                    chapter_score = (
                        skill_score * 0.3 +
                        performance_score * 0.2 +
                        location_match * 0.2 +
                        (1.0 if language_match else 0.0) * 0.2 +
                        subject_match * 0.1 +
                        availability_penalty
                    )
                    
                    total_scores.append(chapter_score)
                    matching_chapters.append({
                        "title": chapter["title"],
                        "subject": subject["title"],
                        "score": round(chapter_score * 100, 2)
                    })
        
        if total_scores:
            avg_score = sum(total_scores) / len(total_scores)
            recommendations.append({
                "volunteer_id": volunteer["volunteer_id"],
                "name": volunteer["name"],
                "match_score": round(avg_score * 100, 2),
                "matching_chapters": matching_chapters[:3]
            })
    
    recommendations.sort(key=lambda x: x["match_score"], reverse=True)
    return {"recommended_volunteers": recommendations}

def recommend_slots_to_volunteers():
    volunteers = list(db.volunteers.find())
    recommendations = {}
    for volunteer in volunteers:
        recommendations[volunteer["volunteer_id"]] = recommend_slots(volunteer["volunteer_id"])
    return recommendations
