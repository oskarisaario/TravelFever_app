import mongoose from "mongoose";



const pinSchema = new mongoose.Schema({
  userRef: {
    type: String,
    required: true,
  },
  private: {
    type: Boolean,
    required: true
  },
  username: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    min: 3,
  },
  description: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5
  },
  lat: {
    type: Number,
    required: true,
  },
  long: {
    type: Number,
    required: true
  }
}, {timestamps: true});


const Pin = mongoose.model('Pin', pinSchema);

export default Pin;