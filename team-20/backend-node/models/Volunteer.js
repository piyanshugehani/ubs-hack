import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const { Schema } = mongoose;

const VolunteerSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false // Prevents password from being returned in queries
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number']
  },
  skills: {
    type: [String],
    default: []
  },
  languages: {
    type: [String],
    default: []
  },
  locations: {
    type: [String],
    default: []
  },
  availability: {
    type: [String],
    default: []
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  bookedSchedule: {
    type: [{
      date: {
        type: Date,
        required: true
      },
      time: {
        start: {
          type: String,
          required: true
        },
        end: {
          type: String,
          required: true
        }
      },
      chapter_id: {
        type: Schema.Types.ObjectId,
        ref: 'Chapter',
        required: true
      }
    }],
    default: []  // Initialize as empty array
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ** Hash Password Before Saving **
VolunteerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ** Sign JWT and return **
VolunteerSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { 
      id: this._id,
      role: 'volunteer'  // Make sure role is explicitly set
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE
    }
  );
};

// ** Match User Entered Password with Hashed Password **
VolunteerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to get booked slots with chapter details
VolunteerSchema.methods.getBookedSlots = async function() {
  return await mongoose.model('Slot').find({ 
    volunteer_id: this._id,
    assignedOrNot: 'assigned'
  })
  .populate({
    path: 'chapter_id',
    select: 'title description numberOfHours session_daterange'
  });
};

// Method to add a new booking
VolunteerSchema.methods.addBooking = async function(date, startTime, endTime, chapterId) {
  this.bookedSchedule.push({
    date: new Date(date),
    time: {
      start: startTime,
      end: endTime
    },
    chapter_id: chapterId
  });
  return await this.save();
};

export default mongoose.model('Volunteer', VolunteerSchema);
