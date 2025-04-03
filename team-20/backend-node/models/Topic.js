// models/Topic.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const TopicSchema = new Schema({
  chapter_id: {
    type: Schema.Types.ObjectId,
    ref: 'Chapter',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  weightage: {
    type: Number
  }
}, { timestamps: true });

export default mongoose.model('Topic', TopicSchema);
