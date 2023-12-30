import express from 'express';

import { create, deletePin, getPins, updatePin } from '../controllers/pin.controller.js';


const router = express.Router();


router.post('/create', create);
router.get('/getPins/:id', getPins);
router.delete('/delete/:id', deletePin);
router.post('/update/:id', updatePin);


export default router;