import datetime
from mongoengine import Document, StringField, EmailField, IntField, FloatField, DateTimeField, ReferenceField, ListField, DictField

class School(Document):
    name = StringField(required=True)
    location = StringField()
    description = StringField()

class Syllabus(Document):
    school = ReferenceField(School, required=True)
    title = StringField(required=True)
    description = StringField()

class Subject(Document):
    syllabus = ReferenceField(Syllabus, required=True)
    title = StringField(required=True)
    description = StringField()

class Chapter(Document):
    subject = ReferenceField(Subject, required=True)
    title = StringField(required=True)
    description = StringField()

class Topic(Document):
    chapter = ReferenceField(Chapter, required=True)
    title = StringField(required=True)
    weightage = FloatField()

class Curriculum(Document):
    school = ReferenceField(School, required=True)
    syllabus = ReferenceField(Syllabus)
    year = IntField()
    skills = StringField()
    weightage = FloatField()
    assignedOrNot = StringField(choices=["unassigned", "searching", "assigned"])
    session_daterange = DictField()
    numberOfHours = IntField()

class Volunteer(Document):
    name = StringField(required=True)
    email = EmailField(required=True, unique=True)
    phone = StringField()
    skills = StringField()
    languages = ListField(DictField())
    locations = StringField()
    location_type_preference = StringField()
    availability = StringField()
    hours_taught = IntField(default=0)
    rating = FloatField(default=0)
    student_retention = FloatField(default=0)
    gamification_points = IntField(default=0)

class Badge(Document):
    name = StringField(required=True)
    description = StringField()
    points_required = IntField()

class VolunteerBadge(Document):
    volunteer = ReferenceField(Volunteer, required=True)
    badge = ReferenceField(Badge, required=True)
    awarded_date = DateTimeField(default=datetime.datetime.utcnow)
    meta = {'indexes': [{'fields': ['volunteer', 'badge'], 'unique': True}]}

class Slot(Document):
    curriculum = ReferenceField(Curriculum, required=True)
    language = StringField()
    assignedOrNot = StringField(choices=["unassigned", "assigned"])
    volunteer = ReferenceField(Volunteer)

class Session(Document):
    slot = ReferenceField(Slot, required=True)
    volunteer = ReferenceField(Volunteer, required=True)
    session_type = StringField(choices=["live", "recorded"])
    session_date = DateTimeField()
    duration = IntField()
    feedback = StringField()
    student_engagement = IntField()
