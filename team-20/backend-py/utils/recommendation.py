from pymongo import MongoClient
from datetime import datetime, time
import json

client = MongoClient("mongodb://localhost:27017")
db = client["volunteer_matching_db"]

def get_urgency_weight(slot):
    if slot["is_urgent"]:
        return 1.2  # Give a slight boost to urgent slots
    return 1.0

def get_skill_match(volunteer, required_skills):
    volunteer_skills = volunteer.get("skills", {})
    match_score = sum(min(volunteer_skills.get(skill, 0), level) / level for skill, level in required_skills.items())
    return match_score / len(required_skills) if required_skills else 0

def is_volunteer_available(volunteer_id, day_of_week, session_start, session_end):
    available_slots = db.volunteeravailability.find({"volunteer_id": volunteer_id, "day_of_week": day_of_week})
    for slot in available_slots:
        start_time = datetime.strptime(slot["start_time"], "%H:%M:%S").time()
        end_time = datetime.strptime(slot["end_time"], "%H:%M:%S").time()
        if start_time <= session_start <= end_time and start_time <= session_end <= end_time:
            return True
    return False
def recommend_slots(volunteer_id):
    volunteer = db.volunteers.find_one({"volunteer_id": volunteer_id})
    if not volunteer:
        return {"error": "Volunteer not found"}

    # Look for both unassigned and searching slots
    unassigned_slots = list(db.slots.find({
        "assignedOrNot": {"$in": ["unassigned", "searching"]},
        "volunteer_id": None
    }))

    if not unassigned_slots:
        return {"message": "No available slots found."}

    recommendations = []
    current_date = datetime.now().date()

    for slot in unassigned_slots:
        chapter = db.chapters.find_one({"chapter_id": slot["chapter_id"]})
        if not chapter:
            continue

        # Parse dates and validate
        session_start = datetime.strptime(chapter["session_daterange"][0], "%Y-%m-%d").date()
        session_end = datetime.strptime(chapter["session_daterange"][1], "%Y-%m-%d").date()
        
        # Skip if session has already passed
        if session_end < current_date:
            continue

        required_skills = json.loads(chapter["required_skills"]) if isinstance(chapter["required_skills"], str) else chapter["required_skills"]
        
        # More flexible availability check
        day_of_week = session_start.strftime("%A")
        if not check_volunteer_availability(volunteer_id, day_of_week):
            continue

        urgency_weight = get_urgency_weight(slot)
        skill_match_score = get_skill_match(volunteer, required_skills)

        # Adjusted workload calculation
        workload_factor = max(0.1, (volunteer["max_hours_per_week"] - volunteer["hours_taught"]) / volunteer["max_hours_per_week"])
        performance_factor = calculate_performance_factor(volunteer)

        final_score = (skill_match_score * 0.5 + workload_factor * 0.2 + performance_factor * 0.3) * urgency_weight

        recommendations.append({
            "slot_id": slot["slot_id"],
            "chapter_id": slot["chapter_id"],
            "chapter_title": chapter.get("title", "Unknown"),
            "topics_covered": slot["topics_covered"],
            "language": slot["language"],
            "is_urgent": slot["is_urgent"],
            "session_start": str(session_start),
            "session_end": str(session_end),
            "score": round(final_score, 2)
        })

    recommendations.sort(key=lambda x: x["score"], reverse=True)
    return recommendations if recommendations else {"message": "No suitable slots found based on your availability and skills."}

def check_volunteer_availability(volunteer_id, day_of_week, session_time=None):
    query = {
        "volunteer_id": volunteer_id,
        "day_of_week": day_of_week
    }
    
    available_slots = list(db.volunteeravailability.find(query))
    
    if not session_time:
        return len(available_slots) > 0
        
    session_time = datetime.strptime(session_time, "%H:%M:%S").time()
    
    for slot in available_slots:
        start = datetime.strptime(slot["start_time"], "%H:%M:%S").time()
        end = datetime.strptime(slot["end_time"], "%H:%M:%S").time()
        if start <= session_time <= end:
            return True
            
    return False

def calculate_performance_factor(volunteer):
    rating = volunteer.get("rating", 3.0)
    retention = volunteer.get("student_retention", 50.0)
    # Normalize and combine factors
    return ((rating / 5) * 0.6) + ((retention / 100) * 0.4)





def get_unassigned_chapters(school_id):
    """
    Get unassigned chapters for a given school through the subject hierarchy.
    Returns chapters that are either unassigned or searching for volunteers.
    """
    # Get all syllabi for the school
    syllabi = db.syllabus.find({"school_id": school_id})
    syllabus_ids = [s["syllabus_id"] for s in syllabi]
    
    # Get subjects for these syllabi
    subjects = db.subjects.find({"syllabus_id": {"$in": syllabus_ids}})
    subject_ids = [s["subject_id"] for s in subjects]
    
    # Get unassigned chapters for these subjects
    unassigned_chapters = list(db.chapters.find({
        "subject_id": {"$in": subject_ids},
        "assignedOrNot": {"$in": ["unassigned", "searching"]}
    }))
    
    return unassigned_chapters


def recommend_volunteers_to_school(school_id):
    unassigned_chapters = get_unassigned_chapters(school_id)
    return unassigned_chapters
    if not unassigned_chapters:
        return {"message": "No unassigned chapters found for this school."}

    volunteers = list(db.volunteers.find({"hours_taught": {"$lt": "max_hours_per_week"}}))
    current_date = datetime.now().date()
    recommendations = []

    for volunteer in volunteers:
        matches = []
        
        for chapter in unassigned_chapters:
            session_start = datetime.strptime(chapter["session_daterange"][0], "%Y-%m-%d").date()
            session_end = datetime.strptime(chapter["session_daterange"][1], "%Y-%m-%d").date()
            
            # Skip if chapter dates are in the past
            if session_end < current_date:
                continue

            day_of_week = session_start.strftime("%A")
            if not check_volunteer_availability(volunteer["volunteer_id"], day_of_week):
                continue

            required_skills = json.loads(chapter["required_skills"]) if isinstance(chapter["required_skills"], str) else chapter["required_skills"]
            skill_match_score = get_skill_match(volunteer, required_skills)
            
            workload_factor = max(0.1, (volunteer["max_hours_per_week"] - volunteer["hours_taught"]) / volunteer["max_hours_per_week"])
            performance_factor = calculate_performance_factor(volunteer)

            match_score = (skill_match_score * 0.5 + workload_factor * 0.2 + performance_factor * 0.3)
            matches.append(match_score)

        if matches:
            avg_score = sum(matches) / len(matches)
            recommendations.append({
                "volunteer_id": volunteer["volunteer_id"],
                "name": volunteer["name"],
                "email": volunteer["email"],
                "phone": volunteer["phone"],
                "avg_rating": volunteer.get("rating", 3.0),
                "available_hours": volunteer["max_hours_per_week"] - volunteer["hours_taught"],
                "score": round(avg_score, 2)
            })

    recommendations.sort(key=lambda x: x["score"], reverse=True)
    return recommendations if recommendations else {"message": "No suitable volunteers found matching the requirements."}