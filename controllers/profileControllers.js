const Profile = require('../models/profile');

exports.editUpdateProfile = (req, res, next) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      console.log(profile, req.user);
      if (profile) {
        if (req.body.website) profile.website = req.body.website;
        if (req.body.bio) profile.bio = req.body.bio;
        if (req.body.gender) profile.gender = req.body.gender;
        if (req.file) profile.profileImageUrl = req.file.path;
        return profile.save().then(profile => res.json(profile));
      } else {
        profileData = {};
        profileData.website = req.body.website;
        profileData.bio = req.body.bio;
        profileData.gender = req.body.gender;
        profileData.profileImageUrl = req.file
          ? req.file.path
          : '/images/download.png';
        profileData.user = req.user.id;
        newProfile = new Profile(profileData);
        return newProfile.save().then(profile => {
          res.json(profile);
        });
      }
    })
    .catch(err => {
      console.log(err);
    });
};
