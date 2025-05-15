// /backend/services/postService.js
const postDao = require('../dao/postDao');

async function listPosts(filterOpts) {
    return postDao.getPosts(filterOpts);
}

async function getPost(id) {
    return postDao.getPostById(id);
}

async function createPost(userId, postData) {
    return postDao.createPost({ ...postData, authorId: userId });
}

async function updatePost(id, userId, postData) {
    return postDao.updatePost(id, userId, postData);
}

async function deletePost(id, userId) {
    return postDao.deletePost(id, userId);
}

// --- Likes ---
async function likeOrDislikePost(userId, postId, isLike) {
    return postDao.likePost(userId, postId, isLike);
}

async function removeLikeOrDislike(userId, postId) {
    return postDao.unlikePost(userId, postId);
}

// --- Follows ---
async function followUser(followerId, followingId) {
    return postDao.followUser(followerId, followingId);
}

async function unfollowUser(followerId, followingId) {
    return postDao.unfollowUser(followerId, followingId);
}

async function getUserFollowers(userId) {
    return postDao.getFollowers(userId);
}

async function getUserFollowing(userId) {
    return postDao.getFollowing(userId);
}

// --- Comments ---
async function fetchComments(postId) {
    return postDao.getCommentsByPost(postId);
}

async function createComment(postId, userId, comment) {
    return postDao.addComment(postId, userId, comment);
}

async function removeComment(commentId, userId) {
    return postDao.deleteComment(commentId, userId);
}

module.exports = {
    listPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
    likeOrDislikePost,
    removeLikeOrDislike,
    followUser,
    unfollowUser,
    getUserFollowers,
    getUserFollowing,
    fetchComments,
    createComment,
    removeComment
};
