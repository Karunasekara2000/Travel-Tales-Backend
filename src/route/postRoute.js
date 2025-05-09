// File: /backend/routes/postRoutes.js
const express = require("express");
const {getPosts, getPostById, createPost, updatePost, deletePost
} = require("../controller/postController");
const { authenticateJWT } = require("../middleware/authMiddleware");
const { csrfProtection } = require("../middleware/csrfMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

// Public
router.get("/", getPosts);
router.get("/:id", getPostById);


router.post("/", authenticateJWT, csrfProtection, upload.single("media"), createPost);
router.put("/:id", authenticateJWT, csrfProtection, upload.single("media"), updatePost);
router.delete("/:id", authenticateJWT, csrfProtection, deletePost);

module.exports = router;
