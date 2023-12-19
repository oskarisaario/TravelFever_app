import mongoose from "mongoose";



const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 6,
  },
  private: {
    type: Boolean,
    default: false
  }
}, {timestamps: true});


const User = mongoose.model('User', userSchema);

export default User;