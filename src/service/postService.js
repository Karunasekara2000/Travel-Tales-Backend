// /backend/services/postService.js
const postDao = require('../dao/postDao');

async function listPosts(filterOpts) {
    return postDao.getPosts(filterOpts);
}

async function getPost(id) {
    return postDao.getPostById(id);
}

async function createPost(userId, postData) {
    // postData: { title, content, countryCode, visitDate, mediaUrl }
    return postDao.createPost({ ...postData, authorId: userId });
}

async function updatePost(id, userId, postData) {
    // throws if not found or not the author
    return postDao.updatePost(id, userId, postData);
}

async function deletePost(id, userId) {
    // throws if not found or not the author
    return postDao.deletePost(id, userId);
}

module.exports = {
    listPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
};
