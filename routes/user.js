const express = require('express');
const {
  registerUser,
  loginUser,
  savePersonality,
  getUserById,
} = require('../controllers/user.js');

const { protect } = require('../middleware/auth.js');
const { rateLimiter } = require('../middleware/rateLimiter.js');
const router = express.Router();

router.post('/register', rateLimiter(30, 5), registerUser);
router.post('/login', rateLimiter(60, 5), loginUser); // 60, 5
router.post('/save-result', protect, rateLimiter(60, 5), savePersonality);
router.post('/getUserById', protect, rateLimiter(60, 15), protect, getUserById);

module.exports = router;
