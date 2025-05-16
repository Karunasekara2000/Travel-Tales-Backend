const postDao = require('../dao/postDao');
const logService = require('../service/logService');
const userDao = require("../controller/postController");

async function listPosts(filterOpts) {
    return postDao.getPosts(filterOpts);
}

async function getPost(id) {
    const posts = await postDao.getPosts(id);
    await logService.log(posts.authorId, "GET_POSTS", posts.id, `Get posts by author id '${posts.title}'`);
    return posts;
}

async function createPost(userId, postData) {
    const post = await postDao.createPost({ ...postData, authorId: userId });
    await logService.log(userId, "POST_CREATE", post.id, `Created post titled '${postData.title}'`);
    return post;
}

async function updatePost(id, userId, postData) {
    const updated = await postDao.updatePost(id, userId, postData);
    await logService.log(userId, "POST_UPDATE", id, `Updated post titled '${postData.title}'`);
    return updated;
}

async function deletePost(id, userId) {
    const deleted = await postDao.deletePost(id, userId);
    await logService.log(userId, "POST_DELETE", id, "Deleted post");
    return deleted;
}

async function likeOrDislikePost(userId, postId, isLike) {
    const result = await postDao.likePost(userId, postId, isLike);
    const action = isLike ? "LIKE" : "DISLIKE";
    await logService.log(userId, `POST_${action}`, postId, `${action}d a post`);
    return result;
}

async function removeLikeOrDislike(userId, postId) {
    const result = await postDao.unlikePost(userId, postId);
    await logService.log(userId, "POST_LIKE_REMOVE", postId, "Removed like/dislike");
    return result;
}

async function followUser(followerId, followingId) {
    const result = await postDao.followUser(followerId, followingId);
    await logService.log(followerId, "FOLLOW_USER", followingId, "Started following user");
    return result;
}

async function unfollowUser(followerId, followingId) {
    const result = await postDao.unfollowUser(followerId, followingId);
    await logService.log(followerId, "UNFOLLOW_USER", followingId, "Stopped following user");
    return result;
}

async function getUserFollowers(userId) {
    const followers = await postDao.getFollowers(userId);
    await logService.log(userId, "GET_FOLLOWERS", followers.id, "Get followers");

    return followers;
}

async function getUserFollowing(userId) {
    const followings = await postDao.getFollowing(userId);
    await logService.log(userId, "GET_FOLLOWINGS", followings.id, "Get followings");
    return followings;
}


async function fetchComments(postId) {

    const comments = postDao.getCommentsByPost(postId)
    await logService.log(comments.userId, "GET_COMMENTS", comments.id, "Get Comments");
    return comments;
}

async function createComment(postId, userId, comment) {
    const result = await postDao.addComment(postId, userId, comment);
    await logService.log(userId, "COMMENT_CREATE", postId, "Added a comment");
    return result;
}

async function removeComment(commentId, userId) {
    const result = await postDao.deleteComment(commentId, userId);
    await logService.log(userId, "COMMENT_DELETE", commentId, "Deleted a comment");
    return result;
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
