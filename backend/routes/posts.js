const express = require('express');


const PostController = require('../controllers/posts');
// Middleware check authorization, can be injected inside a request
const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');

const router = express.Router();

// Creating a new post, secure
router.post("",checkAuth,extractFile,PostController.createPost);

// Modify a post, secure
router.put('/:id', checkAuth ,extractFile, PostController.modifyPost)

// Read posts, unsecure
router.get('', PostController.readPosts);

// Read a post, unsecure
router.get('/:id', PostController.readOnePost);

// Delete a post, secure
router.delete('/:id', checkAuth, PostController.deletePost);

module.exports = router;
