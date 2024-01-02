import Pin from '../models/pin.model.js';
import { errorHandler } from "../utils/error.js"


export const create = async (req, res, next) => {
  const newPin = new Pin(req.body);
  try {
    await newPin.save();
    res.status(200).json(newPin);
  } catch (error) {
    next(errorHandler(401, 'Something went wrong while Creating new user!'));
  }
};


export const getPins = async (req, res, next) => {
  try {
    const pins = await Pin.find();
    const filteredPins = pins.filter(pin => pin.private === false && req.params.id !== pin.userRef || req.params.id === pin.userRef);
    res.status(200).json(filteredPins);
  } catch (error) {
    next(errorHandler(401, 'Could not load pins!'));
  }
};


export const deletePin = async (req, res, next) => {
  try {
    await Pin.findByIdAndDelete(req.params.id);
    res.status(200).json('Pin has been deleted');
  } catch (error) {
    next(errorHandler(401, 'Something went wrong, deleting pin failed!'));
  }
};


export const updatePin = async (req, res, next) => {
  try {
    const updatedPin = await Pin.findByIdAndUpdate(req.params.id, {
      $set: {
        title: req.body.title,
        description: req.body.description,
        rating: req.body.rating
      }
    }, {new: true});
    res.status(200).json(updatedPin);
  } catch (error) {
    console.log(error)
    next(errorHandler(401, 'Could not update pin!'));
  }
};


export const updatePinPrivate = async (id, privateUser) => {
  const updatedPin = await Pin.updateMany({userRef: id}, {
    private: privateUser
  }, {new: true})
};

export const getSearchedPins = async (req, res, next) => {
  try {
    const searchTerm = req.query.searchTerm || '';
    const pins = await Pin.find({
      '$or': [
      {title: {$regex: searchTerm, $options: 'i'}},
      {description: {$regex: searchTerm, $options: 'i'}},
    ]});
    const filteredPins = pins.filter(pin => pin.private === false);
    res.status(200).json(filteredPins);
  } catch (error) {
    next(errorHandler(401, 'Could not load pins!'));
  }
};
