const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true
    },

    name: {
      type: String,
      required: true
    },

    username: {
      type: String,
      required: true
    },

    password: {
      type: String,
      required: true
    },

    createdAt: {
      type: Date,
      default: Date.now()
    },

    resetToken: String,

    resetTokenExpiration: Number,

    followers: [{ type: String }],

    following: [{ type: String }]
  },
  {
    writeConcern: {
      w: 'majority',
      j: true,
      wtimeout: 1000
    }
  }
);

module.exports = User = mongoose.model('user', UserSchema);
