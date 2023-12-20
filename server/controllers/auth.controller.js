import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';



export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json('User created successfully!');
  } catch (error) {
    next(error);
  }
};


export const signIn = async (req, res, next) => {
  const { username, password } = req.body;
 
  try {
    const validUser = await User.findOne({ username });
    if (!validUser) return next(errorHandler(404, 'User not found!'));

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'));

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...userWithoutPassword } = validUser._doc;

    res.cookie('access_token', token, { httpOnly: true }).status(200).json(userWithoutPassword);

  } catch (error) {
    next(error);
  }
};


export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    //If user is found sign in and great token. Otherwise create new user with random password.
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...userWithoutPassword } = user._doc;
      res.cookie('access_token', token, { httpOnly: true }).status(200).json(userWithoutPassword);
    } else {
      //Create random 16 characters long password
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        //First take off the space in username and join together. then add random number and letter to end for making it unique.
        username: req.body.name.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-4), 
        email: req.body.email, 
        password: hashedPassword,
        avatar: req.body.photo
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...userWithoutPassword } = newUser._doc;
      res.cookie('access_token', token, { httpOnly: true }).status(200).json(userWithoutPassword);
    }
  } catch (error) {
    next(error);
  }
}