// models/Syllabus.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const ScheduleSchema = new Schema({
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  }
});

const ChapterSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  topics: [{
    type: String
  }],
  required_skills: {
    type: Map,
    of: Number
  },
  hours_needed: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['unassigned', 'assigned', 'completed'],
    default: 'unassigned'
  },
  schedule: {
    type: ScheduleSchema,
    required: true
  }
});

const SubjectSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  chapters: [ChapterSchema]
});

const SyllabusSchema = new Schema({
  syllabus_id: {
    type: Number,
    required: true,
    unique: true
  },
  school_id: {
    type: Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  subjects: [SubjectSchema]
}, { timestamps: true });

export default mongoose.model('Syllabus', SyllabusSchema);