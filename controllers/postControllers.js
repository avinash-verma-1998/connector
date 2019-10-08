const Post = require('../models/post');
const path = require('path');
const fs = require('fs');

exports.createPost = (req, res, next) => {
  if (!req.file) {
    const error = new Error('no image was provided');
    error.statusCode = 422;
    throw error;
  }
  const postImageUrl = req.file.path;
  postData = {
    user: req.user.id,
    postImageUrl: postImageUrl,
    caption: req.body.caption
  };

  newPost = new Post(postData);
  newPost
    .save()
    .then(post => {
      res.json({ message: 'created' });
    })
    .catch(err => {
      console.log(err);
    });
};
// get all posts by a user
exports.getUserPosts = (req, res) => {
  Post.find({ user: req.params.id })
    .then(posts => {
      res.json(posts);
    })
    .catch(err => {
      console.log(err);
    });
};
//logged in user posts
exports.getloggedinUserPosts = (req, res) => {
  Post.find({ user: req.user.id })
    .then(posts => {
      res.json(posts);
    })
    .catch(err => {
      console.log(err);
    });
};

// get all posts.
exports.getPosts = (req, res) => {
  Post.find()
    .populate('user')
    .then(posts => {
      res.json(posts);
    })
    .catch(err => {
      console.log(err);
    });
};

// delete a post by id
exports.deletePost = (req, res, next) => {
  Post.findOne({ _id: req.params.postId })
    .then(post => {
      if (post) {
        if (!(post.user.toString() === req.user.id)) {
          return res.json({ error: 'cannot delete post by other users' });
        } else {
          Post.deleteOne({ _id: req.params.postId }).then(result => {
            res.json({ message: 'deleted' });
            const postname = post.postImageUrl.split('\\')[1];

            postPath = path.join(__dirname, '..', 'images', postname);
            fs.unlink(postPath, err => {
              console.log(err);
            });
          });
        }
      }
    })
    .catch(err => {
      console.log(err);
    });
};
// like a post
exports.like = (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .then(post => {
      if (!post) {
        return res.status(400).json({ error: 'not found' });
      }

      if (post.likes.some(like => like.toString() === req.user.id.toString())) {
        return res.json({ message: 'already liked' });
      } else {
        post.likes.push(req.user.id);

        return post.save().then(res.json(post));
      }
    })
    .catch(err => {
      console.log(err);
    });
};
// unlike a post
exports.unlike = (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .then(post => {
      if (!post) {
        return res.status(400).json({ error: 'no post Found' });
      }
      const likes = post.likes.filter(
        likes => !(likes.toString() === req.user.id.toString())
      );
      post.likes = likes;
      return post.save().then(post => {
        res.json(post);
      });
    })
    .catch(err => {
      console.log(err);
    });
};
// comment on a post
exports.comment = (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .then(post => {
      if (!post) {
        return res.status(400).json({ error: 'not found' });
      }

      post.comments.push({
        comment: req.body.comment,
        username: req.user.username,
        user: req.user.id
      });

      return post.save().then(res.json(post));
    })
    .catch(err => {
      console.log(err);
    });
};

// uncomment on a post
exports.uncomment = (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .then(post => {
      if (!post) {
        return res.status(400).json({ error: 'not found' });
      }
      const commentIndex = post.comments.findIndex(
        commentObj => commentObj.user.toString() === req.user.id.toString()
      );
      const newComments = post.comments.filter(
        (_, index) => !(index === commentIndex)
      );
      post.comments = newComments;
      return post.save().then(res.json(post));
    })
    .catch(err => {
      console.log(err);
    });
};
// get a single post
exports.getPostbyid = (req, res, next) => {
  Post.findOne({ _id: req.params.postId })
    .populate('user')

    .then(post => {
      if (!post) {
        return res.status(500).json({ error: 'cannot load post' });
      }

      res.json(post);
    })
    .catch(err => {
      console.log(err);
    });
};
