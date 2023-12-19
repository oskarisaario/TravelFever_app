import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import userRouter from './routes/user.route.js';
import pinRouter from './routes/pin.route.js';
import authRouter from './routes/auth.route.js';


mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log(error);
  });

const app = express();
app.use(express.json());

app.listen(3000, () => {
  console.log('Server is running on port 3000!');
  }
);

app.use('/api/user', userRouter);
app.use('/api/pin', pinRouter);
app.use('/api/auth', authRouter);