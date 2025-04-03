from pymongo import MongoClient
from datetime import datetime
import json

client = MongoClient("mongodb://localhost:27017")
db = client["volunteer_matching_db"]

def get_skill_match(volunteer_skills, required_skills_obj):
    if not required_skills_obj or not required_skills_obj.get("skills"):
        return 1.0
    required_skills = required_skills_obj.get("skills", [])
    matched_skills = set(volunteer_skills).intersection(set(required_skills))
    return len(matched_skills) / len(required_skills) if required_skills else 1.0

def check_availability(volunteer_availability, day_of_week):
    # Handle string-based availability
    # if isinstance(volunteer_availability, str):
    #     if volunteer_availability == "Weekends" and day_of_week in ["Saturday", "Sunday"]:
    #         return True
    #     if volunteer_availability == "Weekdays" and day_of_week not in ["Saturday", "Sunday"]:
    #         return True
    #     if volunteer_availability == "Flexible" or volunteer_availability == "Any":
    #         return True
    #     return day_of_week.lower() in volunteer_availability.lower()
    
    # # For backward compatibility with array-based availability
    # if isinstance(volunteer_availability, list):
    #     return any(slot.get("day") == day_of_week for slot in volunteer_availability)
    
    # # Default case
    return True


def calculate_performance_score(volunteer):
    # Extract metrics directly from volunteer document
    rating = float(volunteer.get("rating", 3.0))
    retention = float(volunteer.get("student_retention", 50.0))
    return (rating / 5 * 0.6) + (retention / 100 * 0.4)

def recommend_slots(volunteer_id):
    volunteer = db.volunteers.find_one({"volunteer_id": volunteer_id})
    if not volunteer:
        return {"error": "Volunteer not found"}
    
    # Find unassigned chapters from all syllabi
    syllabi = list(db.syllabus.find({}))
    recommendations = []
    
    for syllabus in syllabi:
        for subject in syllabus.get("subjects", []):
            for chapter in subject.get("chapters", []):
                if chapter.get("assignedOrNot") == "unassigned":
                    # Assuming we need to create a schedule if it doesn't exist
                    # For demo purposes, using current date + 7 days
                    start_date = datetime.now().date()
                    day_of_week = start_date.strftime("%A")
                    
                    skill_score = get_skill_match(volunteer["skills"], chapter.get("required_skills", {}))
                    availability_match = check_availability(volunteer["availability"], day_of_week)
                    availability_penalty = 0 if availability_match else -0.2
                    
                    performance_score = calculate_performance_score(volunteer)
                    
                    # Simplified workload calculation
                    hours_taught = float(volunteer.get("hours_taught", 0))
                    max_hours = 20  # Default max hours if not specified
                    workload_score = max(0, (max_hours - hours_taught) / max_hours)
                    
                    urgency_bonus = 0.1 if chapter.get("is_urgent", False) else 0

                    total_score = (
                        skill_score * 0.45 +
                        performance_score * 0.25 +
                        workload_score * 0.2 +
                        urgency_bonus +
                        availability_penalty
                    )

                    # Generate match reasons
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
                        "chapter_id": str(chapter.get("_id", "")),
                        "chapter_title": chapter["title"],
                        "subject": subject["title"],
                        "language": chapter.get("language", "English"),
                        "matchScore": round(total_score * 100, 2),
                        "matchReason": ", ".join(match_reasons),
                        "schedule": {
                            "day": day_of_week,
                            "time": "TBD"
                        }
                    })
    
    recommendations.sort(key=lambda x: x["matchScore"], reverse=True)
    return {"recommended_slots": recommendations}

def recommend_volunteers_to_school(school_id):
    school = db.schools.find_one({"school_id": school_id})
    if not school:
        return {"error": "School not found"}
    
    syllabi = list(db.syllabus.find({"school_id": school_id}))
    volunteers = list(db.volunteers.find())
    recommendations = []

    for volunteer in volunteers:
        total_scores = []
        matching_chapters = []

        for syllabus in syllabi:
            for subject in syllabus.get("subjects", []):
                for chapter in subject.get("chapters", []):
                    if chapter.get("assignedOrNot") == "unassigned":
                        # Use current date for scheduling logic
                        start_date = datetime.now().date()
                        day_of_week = start_date.strftime("%A")
                        
                        skill_score = get_skill_match(volunteer["skills"], chapter.get("required_skills", {}))
                        availability_match = check_availability(volunteer["availability"], day_of_week)
                        availability_penalty = 0 if availability_match else -0.2
                        
                        performance_score = calculate_performance_score(volunteer)
                        
                        # Simplified location and language matching
                        location_match = 1.0 if school.get("location") in volunteer.get("locations", []) else 0.5
                        
                        # Check if volunteer languages match school requirements
                        volunteer_languages = [lang.lower() for lang in volunteer.get("languages", [])]
                        school_languages = [lang.lower() for lang in school.get("requirements", {}).get("languages", [])]
                        language_match = any(lang in school_languages for lang in volunteer_languages)
                        
                        chapter_score = (
                            skill_score * 0.3 +
                            performance_score * 0.2 +
                            location_match * 0.2 +
                            (1.0 if language_match else 0.0) * 0.2 +
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
                "email": volunteer["email"],
                "phone": volunteer["phone"],
                "skills": volunteer["skills"],
                "languages": volunteer["languages"],
                "locations": volunteer["locations"],
                "availability": volunteer.get("availability", ""),
                "hours_taught": volunteer.get("hours_taught", 0),
                "rating": volunteer.get("rating", 0),
                "student_retention": volunteer.get("student_retention", 0),
                "gamification_points": volunteer.get("gamification_points", 0),
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
