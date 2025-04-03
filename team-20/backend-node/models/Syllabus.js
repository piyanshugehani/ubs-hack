// models/Syllabus.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const SyllabusSchema = new Schema({
  school_id: {
    type: Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  grade: { 
    type: String, // Example: "1st Grade", "Montessori"
    required: true
  }
}, { timestamps: true });

export default mongoose.model('Syllabus', SyllabusSchema);
