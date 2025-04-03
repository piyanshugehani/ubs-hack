import mongoose from 'mongoose';
const { Schema } = mongoose;

const SubjectSchema = new Schema({
  syllabus_id: {
    type: Schema.Types.ObjectId,
    ref: 'Syllabus',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  }
}, { timestamps: true });

export default mongoose.model('Subject', SubjectSchema);