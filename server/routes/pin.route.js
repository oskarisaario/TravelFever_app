import express from 'express';

import { create, getPins } from '../controllers/pin.controller.js';


const router = express.Router();


router.post('/create', create);
router.get('/get', getPins);


export default router;