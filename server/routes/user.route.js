import express from 'express';
import { deleteUser, getUserPins, updateUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';


const router = express.Router();

router.post('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);
router.get('/pins/:id', verifyToken, getUserPins);

export default router;