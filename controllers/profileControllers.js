const Profile = require("../models/profile");

exports.editUpdateProfile = (req, res, next) => {
  profileData = {};
  if (req.body.website) profileData.website = req.body.website;
  if (req.body.bio) profileData.bio = req.body.bio;
  if (req.body.gender) profileData.gender = req.body.gender;
  if (req.body.profileImageUrl)
    profileData.profileImageUrl = req.body.profileImageUrl;
};
