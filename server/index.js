import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import userRouter from './routes/user.route.js';
import pinRouter from './routes/pin.route.js';
import authRouter from './routes/auth.route.js';


//Connect to database
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


//Takes routers to use
app.use('/api/user', userRouter);
app.use('/api/pin', pinRouter);
app.use('/api/auth', authRouter);


//Middleware to handle errors
app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message
  });
});