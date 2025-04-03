import json
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/ubs")
db = client["volunteer_matching_db"]

def load_json():
    return {
        "schools": [
            {"school_id": 1, "name": "Delhi Public School", "location": "Delhi",
             "requirements": {"languages": ["English", "Hindi"], "subjects": ["Python", "Data Structures"], "grades": ["11", "12"]}},
            {"school_id": 2, "name": "Bangalore International School", "location": "Bangalore",
             "requirements": {"languages": ["English", "Kannada"], "subjects": ["Operating Systems", "AI"], "grades": ["11", "12"]}},
            {"school_id": 3, "name": "Mumbai High", "location": "Mumbai",
             "requirements": {"languages": ["English", "Marathi"], "subjects": ["Networking", "DBMS"], "grades": ["10", "12"]}},
            {"school_id": 4, "name": "Hyderabad Tech Academy", "location": "Hyderabad",
             "requirements": {"languages": ["English", "Telugu"], "subjects": ["Python", "AI"], "grades": ["11", "12"]}},
            {"school_id": 5, "name": "Chennai Public School", "location": "Chennai",
             "requirements": {"languages": ["English", "Tamil"], "subjects": ["Data Structures", "Cybersecurity"], "grades": ["10", "12"]}}
        ],
        "syllabus": [
            {"syllabus_id": 1, "school_id": 1, "title": "Grade 11 CS - Python Basics",
             "subjects": [{"title": "Python Programming",
                           "chapters": [{"title": "Syntax & Variables", "topics": ["Syntax", "Variables"],
                                         "required_skills": {"python": 1, "logic": 1}, "hours_needed": 6, "status": "unassigned",
                                         "schedule": {"start_date": "2025-04-01", "end_date": "2025-05-01"}},
                                        {"title": "Loops & Conditionals", "topics": ["Loops", "If-Else"],
                                         "required_skills": {"python": 2, "logic": 2}, "hours_needed": 8, "status": "unassigned",
                                         "schedule": {"start_date": "2025-05-10", "end_date": "2025-06-10"}}]}]},
            {"syllabus_id": 2, "school_id": 2, "title": "Grade 12 Advanced AI",
             "subjects": [{"title": "Artificial Intelligence",
                           "chapters": [{"title": "Introduction to AI", "topics": ["Machine Learning", "Neural Networks"],
                                         "required_skills": {"ai": 3, "python": 2}, "hours_needed": 10, "status": "unassigned",
                                         "schedule": {"start_date": "2025-06-01", "end_date": "2025-07-15"}}]}]},
            {"syllabus_id": 3, "school_id": 3, "title": "Grade 10 Networking Basics",
             "subjects": [{"title": "Networking",
                           "chapters": [{"title": "OSI Model", "topics": ["Layers", "Protocols"],
                                         "required_skills": {"networking": 2, "logic": 1}, "hours_needed": 7, "status": "unassigned",
                                         "schedule": {"start_date": "2025-07-01", "end_date": "2025-08-15"}}]}]},
            {"syllabus_id": 4, "school_id": 4, "title": "Grade 11 Data Structures",
             "subjects": [{"title": "Data Structures",
                           "chapters": [{"title": "Trees & Graphs", "topics": ["Trees", "Graphs"],
                                         "required_skills": {"data_structures": 4, "python": 3}, "hours_needed": 10, "status": "unassigned",
                                         "schedule": {"start_date": "2025-08-01", "end_date": "2025-09-30"}}]}]}
        ],
        "volunteers": [
            {"volunteer_id": 1, "name": "Amit Sharma", "skills": {"python": 8, "logic": 7}, "languages": [{"code": "en"}, {"code": "hi"}],
             "preferences": {"location": "Delhi", "max_hours_per_week": 10, "subjects": ["Python"]},
             "metrics": {"hours_taught": 50, "rating": 4.5}, "availability": [{"day": "Monday"}, {"day": "Wednesday"}]},
            {"volunteer_id": 2, "name": "Priya Kapoor", "skills": {"python": 6, "data_structures": 5}, "languages": [{"code": "en"}],
             "preferences": {"location": "Bangalore", "max_hours_per_week": 8, "subjects": ["Data Structures"]},
             "metrics": {"hours_taught": 30, "rating": 4.0}, "availability": [{"day": "Tuesday"}, {"day": "Thursday"}]},
            {"volunteer_id": 3, "name": "Rahul Verma", "skills": {"networking": 7, "logic": 5}, "languages": [{"code": "en"}, {"code": "mr"}],
             "preferences": {"location": "Mumbai", "max_hours_per_week": 12, "subjects": ["Networking"]},
             "metrics": {"hours_taught": 60, "rating": 4.2}, "availability": [{"day": "Friday"}, {"day": "Saturday"}]},
            {"volunteer_id": 4, "name": "Samantha Das", "skills": {"ai": 5, "python": 4}, "languages": [{"code": "en"}, {"code": "te"}],
             "preferences": {"location": "Hyderabad", "max_hours_per_week": 6, "subjects": ["AI"]},
             "metrics": {"hours_taught": 20, "rating": 4.8}, "availability": [{"day": "Monday"}, {"day": "Wednesday"}]}
        ]
    }

def create_slots_from_syllabus(syllabi):
    slots = []
    slot_id = 1
    for syllabus in syllabi:
        for subject in syllabus["subjects"]:
            for chapter in subject["chapters"]:
                slots.append({
                    "slot_id": slot_id,
                    "chapter_data": {
                        "title": chapter["title"],
                        "topics": chapter["topics"],
                        "required_skills": chapter["required_skills"],
                        "hours_needed": chapter["hours_needed"],
                        "status": chapter["status"],
                        "schedule": chapter["schedule"]
                    },
                    "topics_covered": {topic: False for topic in chapter["topics"]},
                    "language": "English",
                    "assignedOrNot": "unassigned",
                    "is_urgent": slot_id % 2 == 0,
                    "volunteer_id": None
                })
                slot_id += 1
    return slots

def upload_data(data):
    for collection in ["schools", "syllabus", "volunteers", "slots"]:
        db.drop_collection(collection)

    db.schools.insert_many(data["schools"])
    db.syllabus.insert_many(data["syllabus"])
    db.volunteers.insert_many(data["volunteers"])

    slots = create_slots_from_syllabus(data["syllabus"])
    if slots:
        db.slots.insert_many(slots)

    print("Database populated successfully!")

if __name__ == "__main__":
    data = load_json()
    upload_data(data)
