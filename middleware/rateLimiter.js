const { redisClient } = require('../config/redis.js');
const asyncHandler = require('express-async-handler');

// limit the number of requests for an endpoint

exports.rateLimiter = (SECONDS_LIMIT, LIMIT_AMOUNT) => {
  return asyncHandler(async (req, res, next) => {
    const ip = req.connection.remoteAddress;
    const [response] = await redisClient
      .multi()
      .incr(ip)
      .expire(ip, SECONDS_LIMIT)
      .exec();
    if (response[1] > LIMIT_AMOUNT) {
      res.status(400);
      res.json({ message: 'Too many requests. Try again later.' });
    } else next();
  });
};
