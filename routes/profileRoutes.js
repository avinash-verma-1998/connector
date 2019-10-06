const router = require('express').Router();
const {
  editUpdateProfile,
  getProfile
} = require('../controllers/profileControllers');
const authenticate = require('../utils/authMiddleware');

router.get('/current', authenticate, getProfile);
router.post('/edit', authenticate, editUpdateProfile);

module.exports = router;
