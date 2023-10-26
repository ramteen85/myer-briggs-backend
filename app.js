const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/user');
const helmet = require('helmet');

// server init
const app = express();
dotenv.config();
app.use(helmet());

// database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
    });

    console.log(`Database Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit();
  }
};

connectDB();

// middlewares
app.use(express.json({ limit: '50mb' }));
app.use(
  cors({
    credentials: true,
    allowedHeaders: '*',
    origin: 'http://localhost',
  }),
);

// api routes
app.get('/', (req, res) => {
  res.send('API is Running...');
});
app.use('/api/user', userRoutes);

// error handling
app.use(async (error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  const retErr = {
    message: message,
    data: data,
  };
  next(retErr);
  res.status(status).json(retErr);
});

// spin up server
app.listen(process.env.PORT || 8000, () => {
  console.log('Server Up!');
});
