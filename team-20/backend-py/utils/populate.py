from pymongo import MongoClient
from datetime import datetime, timedelta
import random

client = MongoClient("mongodb://localhost:27017")
db = client["volunteer_matching_db"]

def generate_schools(n=5):
    schools = [{"school_id": i, "name": f"School {i}", "location": random.choice(["New York", "LA", "Chicago"]), "description": f"School #{i}"} for i in range(1, n+1)]
    db.schools.insert_many(schools)

def generate_syllabus(n=10):
    syllabi = [{"syllabus_id": i, "school_id": random.randint(1, 5), "title": f"Syllabus {i}", "description": f"Syllabus for grade {random.randint(1, 12)}"} for i in range(1, n+1)]
    db.syllabus.insert_many(syllabi)

def generate_subjects(n=20):
    subjects = [{"subject_id": i, "syllabus_id": random.randint(1, 10), "title": random.choice(["Math", "Physics", "History"]), "description": "Subject Details"} for i in range(1, n+1)]
    db.subjects.insert_many(subjects)

def generate_chapters(n=50):
    chapters = []
    for i in range(1, n+1):
        required_skills = {"math": random.randint(1, 10), "physics": random.randint(1, 10)}
        chapters.append({
            "chapter_id": i,
            "subject_id": random.randint(1, 20),
            "title": f"Chapter {i}",
            "description": "Important chapter",
            "year": random.randint(1, 12),
            "required_skills": required_skills,
            "weightage": round(random.uniform(0.1, 1.0), 2),
            "assignedOrNot": random.choice(["unassigned", "searching", "assigned"]),
            "session_daterange": [str(datetime.now().date()), str((datetime.now() + timedelta(days=random.randint(10, 100))).date())],
            "numberOfHours": random.randint(5, 20)
        })
    db.chapters.insert_many(chapters)

def generate_topics(n=100):
    topics = [{"topic_id": i, "chapter_id": random.randint(1, 50), "title": f"Topic {i}", "weightage": round(random.uniform(0.1, 1.0), 2)} for i in range(1, n+1)]
    db.topics.insert_many(topics)

def generate_volunteers(n=30):
    volunteers = []
    for i in range(1, n+1):
        skills = {"math": random.randint(1, 10), "physics": random.randint(1, 10)}
        languages = [{"code": "en", "level": "fluent"}, {"code": "es", "level": random.choice(["basic", "fluent"])}]
        availability = [{"start": str(datetime.now().date()), "end": str((datetime.now() + timedelta(days=30)).date())}]
        volunteers.append({
            "volunteer_id": i,
            "name": f"Volunteer {i}",
            "email": f"volunteer{i}@example.com",
            "phone": f"555-010{i}",
            "skills": skills,
            "languages": languages,
            "locations": random.choice(["New York", "Los Angeles", "Chicago"]),
            "location_type_preference": random.choice(["online", "offline", "hybrid"]),
            "availability": availability,
            "max_hours_per_week": random.randint(5, 40),
            "hours_taught": random.randint(0, 200),
            "rating": round(random.uniform(3.0, 5.0), 2),
            "student_retention": round(random.uniform(50.0, 100.0), 2),
            "gamification_points": random.randint(100, 5000)
        })
    db.volunteers.insert_many(volunteers)

def generate_volunteer_availability(n=30):
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    availability = []
    for i in range(1, n+1):
        for _ in range(random.randint(2, 5)):  # Each volunteer has 2-5 available time slots
            availability.append({
                "availability_id": len(availability) + 1,
                "volunteer_id": i,
                "day_of_week": random.choice(days),
                "start_time": random.choice(["08:00:00", "09:00:00", "10:00:00", "13:00:00"]),
                "end_time": random.choice(["12:00:00", "14:00:00", "16:00:00"])
            })
    db.volunteeravailability.insert_many(availability)

def generate_slots(n=40):
    slots = []
    for i in range(1, n+1):
        slots.append({
            "slot_id": i,
            "chapter_id": random.randint(1, 50),
            "topics_covered": [random.randint(1, 100) for _ in range(3)],
            "language": random.choice(["en", "es"]),
            "assignedOrNot": random.choice(["unassigned", "assigned"]),
            "is_urgent": random.choice([True, False]),
            "volunteer_id": None if random.random() > 0.5 else random.randint(1, 30)
        })
    db.slots.insert_many(slots)

def generate_sessions(n=20):
    sessions = []
    for i in range(1, n+1):
        sessions.append({
            "session_id": i,
            "slot_id": random.randint(1, 40),
            "volunteer_id": random.randint(1, 30),
            "session_type": random.choice(["live", "recorded"]),
            "session_date": str(datetime.now() - timedelta(days=random.randint(1, 60))),
            "duration": random.randint(30, 180),
            "feedback": f"Feedback for session {i}",
            "student_engagement": random.randint(1, 10)
        })
    db.sessions.insert_many(sessions)

def generate_badges(n=10):
    badges = [{"badge_id": i, "name": f"Badge {i}", "description": f"Achieved badge {i}", "points_required": random.randint(100, 1000)} for i in range(1, n+1)]
    db.badges.insert_many(badges)

def generate_volunteer_badges(n=50):
    volunteer_badges = [{"volunteer_id": random.randint(1, 30), "badge_id": random.randint(1, 10), "awarded_date": str(datetime.now() - timedelta(days=random.randint(1, 365)))} for _ in range(n)]
    db.volunteerbadges.insert_many(volunteer_badges)

def populate_database():
    print("Populating database...")
    generate_schools()
    generate_syllabus()
    generate_subjects()
    generate_chapters()
    generate_topics()
    generate_volunteers()
    generate_volunteer_availability()  # New availability data
    generate_slots()
    generate_sessions()
    generate_badges()
    generate_volunteer_badges()
    print("Database population complete!")



def delete_db():
    client.drop_database("volunteer_matching_db")
    print("Database deleted!")


if __name__ == "__main__":
    delete_db()
    populate_database()
