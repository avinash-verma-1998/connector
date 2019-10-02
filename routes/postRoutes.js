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
  uncomment,
  getPostbyid
} = require('../controllers/postControllers');

const authenticate = require('../utils/authMiddleware');

router.get('/getuserPost/:id', getUserPosts);

router.get('/getPost', authenticate, getloggedinUserPosts);

router.get('/getAll', authenticate, getPosts);

router.get('/unlike/:postId', authenticate, unlike);

router.get('/:postId', authenticate, getPostbyid);

router.get('/like/:postId', authenticate, like);

router.post('/create', authenticate, createPost);

router.post('/comment/:postId', authenticate, comment);

router.delete('/uncomment/:postId/:commentId', authenticate, uncomment);

router.delete('/delete/:postId', authenticate, deletePost);

module.exports = router;
