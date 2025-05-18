// File: /backend/routes/postRoutes.js
const express = require("express");
const {getPosts, getPostById, createPost, updatePost, deletePost, removeReaction, postComment, postLike, removeLikes,
    followUsers, getFollowerList, getFollowingList, commentPosts, deleteCommentOnPost, unfollowUsers, getCommentList
} = require("../controller/postController");
const { authenticateJWT } = require("../middleware/authMiddleware");
const { csrfProtection } = require("../middleware/csrfMiddleware");
const upload = require("../middleware/upload");
const {} = require("../dao/postDao");

const router = express.Router();



/**
 * Posts Routes
 */
router.post("/", authenticateJWT, csrfProtection, upload.single("media"), createPost);
router.put("/:id", authenticateJWT, csrfProtection, upload.single("media"), updatePost);
router.delete("/:id", authenticateJWT, csrfProtection, deletePost);
router.post("/like/:id", authenticateJWT, csrfProtection, postLike);
router.delete("/like/:id", authenticateJWT, csrfProtection, removeLikes);
router.post("/follow/:id", authenticateJWT, csrfProtection, followUsers);
router.delete("/follow/:id", authenticateJWT, csrfProtection, unfollowUsers);
router.get("/followers/:id", authenticateJWT, getFollowerList);
router.get("/following/:id", authenticateJWT, getFollowingList);
router.post("/comments/:postId", authenticateJWT, csrfProtection, commentPosts);
router.get("/comments/:postId",authenticateJWT, csrfProtection, getCommentList);
router.delete("/comments/:id", authenticateJWT, csrfProtection, deleteCommentOnPost);
router.get("/", getPosts);
router.get("/:id", getPostById);


module.exports = router;
