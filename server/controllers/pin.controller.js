import Pin from '../models/pin.model.js';


export const create = async (req, res, next) => {
  const newPin = new Pin(req.body);
  try {
    await newPin.save();
    res.status(200).json(newPin);
  } catch (error) {
    next(error);
  }
};


export const getPins = async (req, res, next) => {
  try {
    const pins = await Pin.find();
    res.status(200).json(pins);
  } catch (error) {
    next(error);
  }
};