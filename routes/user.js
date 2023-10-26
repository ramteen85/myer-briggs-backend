const express = require('express');
const {
  registerUser,
  loginUser,
  savePersonality,
  getUserById,
  //   allUsers,
  //   userPicEdit,
  //   userNameEdit,
  //   changePassword,
  //   deleteAccount,
} = require('../controllers/user.js');

const { protect } = require('../middleware/auth.js');
const { rateLimiter } = require('../middleware/rateLimiter.js');
const router = express.Router();

// router.get('/', rateLimiter(60, 15), protect, allUsers);

router.post('/register', rateLimiter(30, 5), registerUser);
router.post('/login', rateLimiter(60, 5), loginUser); // 60, 5
router.post('/save-result', protect, rateLimiter(60, 5), savePersonality);
router.post('/getUserById', protect, rateLimiter(60, 15), protect, getUserById);
// router.post('/edit/name', protect, userNameEdit);
// router.post('/edit/password', protect, changePassword);
// router.post('/terminate', protect, deleteAccount);

module.exports = router;
