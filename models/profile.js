const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  website: String,
  bio: String,
  gender: String,
  profileImageUrl: String,

  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  }
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
