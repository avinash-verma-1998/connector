const router = require("express").Router();
const { editUpdateProfile } = require("../controllers/profileControllers");
const authenticate = require("../utils/authMiddleware");

router.post("/edit", authenticate, editUpdateProfile);

module.exports = router;
