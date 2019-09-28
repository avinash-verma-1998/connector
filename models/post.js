const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },
  postImageUrl: String,
  caption: String,
  comments: [
    {
      comment: {
        type: String
      },

      user: {
        type: Schema.Types.ObjectId,
        ref: "user"
      },
      commentedOn: {
        type: Date,
        default: Date.now()
      }
    }
  ],
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "user"
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

module.exports = Post = mongoose.model("post", postSchema);
