const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const { User } = require('../models/user');
const { generateToken } = require('../config/helpers.js');

// /api/user
exports.registerUser = asyncHandler(async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // server side validation...

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please enter all the fields...');
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists...');
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      personality: '',
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        personality: '',
        token: generateToken(user),
        expiresIn: 28800,
        message: 'Registration Successful!',
      });
    } else {
      throw new Error('Failed to register new user...');
    }
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// /api/user/login
exports.loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // user does not exist
      throw new Error('Invalid Username / Password');
    }

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        personality: user.personality,
        token: generateToken(user),
        expiresIn: 28800,
        message: 'Login Successful!',
      });
    } else {
      res.status(401);
      throw new Error('Invalid Username / Password');
    }
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// /api/user/save-result
exports.savePersonality = asyncHandler(async (req, res) => {
  const { personality, email } = req.body;

  console.log(personality);

  const userRecord = await User.findOne({ email: email });
  if (!userRecord) {
    throw new Error('User record not found');
  }
  userRecord.personality = personality;
  await userRecord.save();
  res.status(200).json({
    message: 'Result saved!',
    personality: personality,
  });
});

exports.getUserById = asyncHandler(async (req, res) => {
  const userId = req.body.id;

  const user = User.findOne({ _id: userId });

  if (user) {
    res.status(200).json({
      message: 'User retrieved!',
      user: user,
    });
  } else {
    throw new Error('User record not found');
  }
});
