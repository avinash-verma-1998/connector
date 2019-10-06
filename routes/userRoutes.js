const express = require('express');
const router = express.Router();
const authenticate = require('../utils/authMiddleware');

const {
  signUpUser,
  loginUser,
  sendEmail,
  resetPassword,
  getUserById,
  updateUser
} = require('../controllers/userController');

router.get('/:userId', authenticate, getUserById);

router.post('/edit', authenticate, updateUser);
router.post('/register', signUpUser);
router.post('/login', loginUser);
router.post('/resetpassword', sendEmail);
router.post('/reset/:token', resetPassword);

module.exports = router;
