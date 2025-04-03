from dataclasses import dataclass
from typing import List, Dict, Optional
from datetime import datetime

@dataclass
class Language:
    code: str
    level: str

@dataclass
class Schedule:
    day: str
    slots: List[str]

@dataclass
class ChapterSchedule:
    start_date: str
    end_date: str

@dataclass
class Chapter:
    title: str
    topics: List[str]
    required_skills: Dict[str, int]
    hours_needed: int
    status: str
    schedule: ChapterSchedule

@dataclass
class Subject:
    title: str
    chapters: List[Chapter]

@dataclass
class Syllabus:
    syllabus_id: int
    school_id: int
    title: str
    subjects: List[Subject]

@dataclass
class SchoolRequirements:
    languages: List[str]
    subjects: List[str]
    grades: List[str]

@dataclass
class School:
    school_id: int
    name: str
    location: str
    description: str
    requirements: SchoolRequirements

@dataclass
class VolunteerPreferences:
    location: str
    mode: str
    max_hours_per_week: int
    subjects: List[str]
    grades: List[str]

@dataclass
class VolunteerMetrics:
    hours_taught: int
    rating: float
    student_retention: float
    gamification_points: int

@dataclass
class Volunteer:
    volunteer_id: int
    name: str
    email: str
    phone: Optional[str]
    skills: Dict[str, int]
    languages: List[Language]
    preferences: VolunteerPreferences
    metrics: VolunteerMetrics
    availability: List[Schedule]

    def to_dict(self):
        return {
            "volunteer_id": self.volunteer_id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "skills": self.skills,
            "languages": [{"code": l.code, "level": l.level} for l in self.languages],
            "preferences": {
                "location": self.preferences.location,
                "mode": self.preferences.mode,
                "max_hours_per_week": self.preferences.max_hours_per_week,
                "subjects": self.preferences.subjects,
                "grades": self.preferences.grades
            },
            "metrics": {
                "hours_taught": self.metrics.hours_taught,
                "rating": self.metrics.rating,
                "student_retention": self.metrics.student_retention,
                "gamification_points": self.metrics.gamification_points
            },
            "availability": [{
                "day": s.day,
                "slots": s.slots
            } for s in self.availability]
        }

    @staticmethod
    def from_dict(data: dict) -> 'Volunteer':
        return Volunteer(
            volunteer_id=data["volunteer_id"],
            name=data["name"],
            email=data["email"],
            phone=data.get("phone"),
            skills=data["skills"],
            languages=[Language(**l) for l in data["languages"]],
            preferences=VolunteerPreferences(**data["preferences"]),
            metrics=VolunteerMetrics(**data["metrics"]),
            availability=[Schedule(**s) for s in data["availability"]]
        )
        
        
@dataclass
class Slot:
    slot_id: int
    chapter_data: Chapter  # Embedded chapter data
    topics_covered: Dict[str, bool]  # Track which topics are covered
    language: str
    assignedOrNot: str  # "unassigned" or "assigned"
    is_urgent: bool
    volunteer_id: Optional[int] = None  # Optional field for assigned volunteer

    def to_dict(self):
        return {
            "slot_id": self.slot_id,
            "chapter_data": {
                "title": self.chapter_data.title,
                "topics": self.chapter_data.topics,
                "required_skills": self.chapter_data.required_skills,
                "hours_needed": self.chapter_data.hours_needed,
                "status": self.chapter_data.status,
                "schedule": {
                    "start_date": self.chapter_data.schedule.start_date,
                    "end_date": self.chapter_data.schedule.end_date
                }
            },
            "topics_covered": self.topics_covered,
            "language": self.language,
            "assignedOrNot": self.assignedOrNot,
            "is_urgent": self.is_urgent,
            "volunteer_id": self.volunteer_id
        }

    @staticmethod
    def from_dict(data: dict) -> 'Slot':
        return Slot(
            slot_id=data["slot_id"],
            chapter_data=Chapter(
                title=data["chapter_data"]["title"],
                topics=data["chapter_data"]["topics"],
                required_skills=data["chapter_data"]["required_skills"],
                hours_needed=data["chapter_data"]["hours_needed"],
                status=data["chapter_data"]["status"],
                schedule=ChapterSchedule(**data["chapter_data"]["schedule"])
            ),
            topics_covered=data["topics_covered"],
            language=data["language"],
            assignedOrNot=data["assignedOrNot"],
            is_urgent=data["is_urgent"],
            volunteer_id=data.get("volunteer_id")
        )