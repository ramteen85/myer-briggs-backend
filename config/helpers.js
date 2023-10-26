const jwt = require('jsonwebtoken');

exports.generateToken = (user) => {
  return jwt.sign(
    {
      email: user.email,
      id: user._id.toString(),
    },
    process.env.JWT_SECRET,
    { expiresIn: '28800s' },
  );
};
