const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SchoolSchema = new Schema({
  name: { type: String, required: true },
  location: { type: String },
  description: { type: String }
});

const SyllabusSchema = new Schema({
  school_id: { type: Schema.Types.ObjectId, ref: 'School', required: true },
  title: { type: String, required: true },
  description: { type: String }
});

const SubjectSchema = new Schema({
  syllabus_id: { type: Schema.Types.ObjectId, ref: 'Syllabus', required: true },
  title: { type: String, required: true },
  description: { type: String }
});

const ChapterSchema = new Schema({
  subject_id: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
  title: { type: String, required: true },
  description: { type: String }
});

const TopicSchema = new Schema({
  chapter_id: { type: Schema.Types.ObjectId, ref: 'Chapter', required: true },
  title: { type: String, required: true },
  weightage: { type: Number }
});

const CurriculumSchema = new Schema({
  school_id: { type: Schema.Types.ObjectId, ref: 'School', required: true },
  syllabus_id: { type: Schema.Types.ObjectId, ref: 'Syllabus' },
  year: { type: Number },
  skills: { type: String },
  weightage: { type: Number },
  assignedOrNot: { type: String, enum: ["unassigned", "searching", "assigned"] },
  session_daterange: {
    start: Date,
    end: Date
  },
  numberOfHours: { type: Number }
});

const VolunteerSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  skills: { type: String },
  languages: { type: Array },
  locations: { type: String },
  location_type_preference: { type: String },
  availability: { type: String },
  hours_taught: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  student_retention: { type: Number, default: 0 },
  gamification_points: { type: Number, default: 0 }
});

const BadgeSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  points_required: { type: Number }
});

const VolunteerBadgeSchema = new Schema({
  volunteer_id: { type: Schema.Types.ObjectId, ref: 'Volunteer', required: true },
  badge_id: { type: Schema.Types.ObjectId, ref: 'Badge', required: true },
  awarded_date: { type: Date, default: Date.now }
});
VolunteerBadgeSchema.index({ volunteer_id: 1, badge_id: 1 }, { unique: true });

const SlotSchema = new Schema({
  curriculum_id: { type: Schema.Types.ObjectId, ref: 'Curriculum', required: true },
  language: { type: String },
  assignedOrNot: { type: String, enum: ["unassigned", "assigned"] },
  volunteer_id: { type: Schema.Types.ObjectId, ref: 'Volunteer' }
});

const SessionSchema = new Schema({
  slot_id: { type: Schema.Types.ObjectId, ref: 'Slot', required: true },
  volunteer_id: { type: Schema.Types.ObjectId, ref: 'Volunteer', required: true },
  session_type: { type: String, enum: ["live", "recorded"] },
  session_date: { type: Date },
  duration: { type: Number },
  feedback: { type: String },
  student_engagement: { type: Number }
});

module.exports = {
  School: mongoose.model('School', SchoolSchema),
  Syllabus: mongoose.model('Syllabus', SyllabusSchema),
  Subject: mongoose.model('Subject', SubjectSchema),
  Chapter: mongoose.model('Chapter', ChapterSchema),
  Topic: mongoose.model('Topic', TopicSchema),
  Curriculum: mongoose.model('Curriculum', CurriculumSchema),
  Volunteer: mongoose.model('Volunteer', VolunteerSchema),
  Badge: mongoose.model('Badge', BadgeSchema),
  VolunteerBadge: mongoose.model('VolunteerBadge', VolunteerBadgeSchema),
  Slot: mongoose.model('Slot', SlotSchema),
  Session: mongoose.model('Session', SessionSchema)
};
