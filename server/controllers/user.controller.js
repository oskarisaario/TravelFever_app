import User from '../models/user.model.js';
import Pin from '../models/pin.model.js';
import { updatePin, updatePinPrivate } from './pin.controller.js';
import { errorHandler } from "../utils/error.js"
import bcryptjs from 'bcryptjs';



export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) return next(errorHandler(401, 'You can only update your own account'));
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
      $set:{
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        avatar: req.body.avatar,
        private: req.body.private
      }
    }, {new: true});

    const {password, ...userWithoutPassword} = updatedUser._doc;
    res.status(200).json(userWithoutPassword);

    updatePinPrivate(req.user.id, req.body.private);


  } catch (error) {
    next(error);
  }
};

export const getUserPins = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const pins = await Pin.find({ userRef: req.params.id });
      res.status(200).json(pins);
    } catch (error) {
      next(error)
    }
  } else {
    return next(errorHandler(401, 'You can only view your own pins!'));
  }
};


export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) return next(errorHandler(401, 'You can only delete your own account'));
  try {
    await User.findByIdAndDelete(req.params.id);
    await Pin.deleteMany({userRef: req.params.id});
    res.clearCookie('access_token');
    res.status(200).json('User and your pins has been deleted');
  } catch (error) {
    next(error);
  }
};