const jwt = require('jsonwebtoken');
const { User } = require('../models/user');
const asyncHandler = require('express-async-handler');

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  console.log(req.headers);

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // get token from header
      token = req.headers.authorization.split(' ')[1];

      //decode token
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decodedToken.id).select('-password');
      next();
    } catch (error) {
      res.status(401);
      throw new Error('Token Failed. Access Denied...');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Token Failed. Access Denied...');
  }
});
