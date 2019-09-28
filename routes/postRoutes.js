const router = require('express').Router();
const {
  createPost,
  deletePost,
  getPosts,
  getUserPosts,
  getloggedinUserPosts,
  like,
  unlike,
  comment,
  uncomment
} = require('../controllers/postControllers');

const authenticate = require('../utils/authMiddleware');

router.get('/getuserPost/:id', getUserPosts);

router.get('/getPost', authenticate, getloggedinUserPosts);

router.get('/getAll', authenticate, getPosts);

router.post('/create', authenticate, createPost);

router.post('/comment/:postId', authenticate, comment);

router.get('/uncomment/:postId/:commentId', authenticate, uncomment);

router.get('/like/:postId', authenticate, like);

router.get('/unlike/:postId', authenticate, unlike);

router.delete('/delete/:postId', authenticate, deletePost);

module.exports = router;
