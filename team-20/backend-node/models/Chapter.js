// models/Chapter.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const ChapterSchema = new Schema({
  subject_id: {
    type: Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  year: {
    type: Number
  },
  required_skills: {
    skills: {
      type: [String],  // Changed from Map to String array
      default: []
    }
  },
  weightage: {
    type: Number
  },
  assignedOrNot: {
    type: String,
    enum: ['unassigned', 'searching', 'assigned'],
    default: 'unassigned'
  },
  session_daterange: {
    start: Date,
    end: Date
  },
  numberOfHours: {
    type: Number
  }
}, { timestamps: true });

export default mongoose.model('Chapter', ChapterSchema);
