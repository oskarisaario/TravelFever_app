import express from 'express';

import { create, deletePin, getPins, updatePin, getSearchedPins } from '../controllers/pin.controller.js';


const router = express.Router();


router.post('/create', create);
router.get('/getPins/:id', getPins);
router.delete('/delete/:id', deletePin);
router.post('/update/:id', updatePin);
router.get('/searchPins/get', getSearchedPins)


export default router;