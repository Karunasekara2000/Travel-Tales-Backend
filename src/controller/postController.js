// /backend/controllers/postController.js
const postService = require('../service/postService');

const getPosts = async (req, res, next) => {
    try {
        const { country, author, page, limit, sort } = req.query;
        const posts = await postService.listPosts({ country, author, page, limit, sort });
        res.json({ data: posts, page: +page || 1, limit: +limit || posts.length });
    } catch (err) {
        next(err);
    }
};

const getPostById = async (req, res, next) => {
    try {
        const post = await postService.getPost(+req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.json(post);
    } catch (err) {
        next(err);
    }
};

const createPost = async (req, res, next) => {
    try {
        const post = await postService.createPost(req.user.id, {
            title: req.body.title,
            content: req.body.content,
            countryCode: req.body.countryCode,
            visitDate: req.body.visitDate,
            mediaUrl: req.body.mediaUrl,
            capital: req.body.capital,
            currency: req.body.currency,
        });
        res.status(201).json(post);
    } catch (err) {
        next(err);
    }
};

const updatePost = async (req, res, next) => {
    try {
        const updated = await postService.updatePost(
            +req.params.id,
            req.user.id,
            {
                title: req.body.title,
                content: req.body.content,
                countryCode: req.body.countryCode,
                visitDate: req.body.visitDate,
                mediaUrl: req.body.mediaUrl,
                capital: req.body.capital,
                currency: req.body.currency,
            }
        );
        res.json(updated);
    } catch (err) {
        if (err.message.includes('unauthorized')) return res.status(403).json({ message: 'Forbidden' });
        next(err);
    }
};

const deletePost = async (req, res, next) => {
    try {
        await postService.deletePost(+req.params.id, req.user.id);
        res.status(204).end();
    } catch (err) {
        if (err.message.includes('unauthorized')) return res.status(403).json({ message: 'Forbidden' });
        next(err);
    }
};

const postLike = async (req, res, next) => {

    try {
        const userId = req.user.id;
        const postId = Number(req.params.id);
        const is_like = Number(req.body.is_like);

        if (
            isNaN(postId) ||
            !(is_like === 0 || is_like === 1)
        ) {
            return res.status(400).json({
                message: "Invalid payload: post ID must be in URL and is_like must be 0 or 1",
            });
        }

        await postService.likeOrDislikePost(userId, postId, is_like);
        res.json({ message: is_like === 1 ? "Liked" : "Disliked" });
    } catch (err) {
        next(err);
    }
};

const removeLikes = async (req, res, next) => {
    try {
        await postService.removeLikeOrDislike(req.user.id, +req.params.id);
        res.status(204).end();
    } catch (err) {
        next(err);
    }
};


const followUsers = async (req, res, next) => {
    try {
        await postService.followUser(req.user.id, +req.params.id);
        res.json({ message: 'Now following user' });
    } catch (err) {
        next(err);
    }
};

const unfollowUsers = async (req, res, next) => {
    try {
        await postService.unfollowUser(req.user.id, +req.params.id);
        res.json({ message: 'Unfollowed user' });
    } catch (err) {
        next(err);
    }
};

const getFollowerList = async (req, res, next) => {
    try {
        const followers = await postService.getUserFollowers(+req.params.id);
        res.json(followers);
    } catch (err) {
        next(err);
    }
};

const getFollowingList = async (req, res, next) => {
    try {
        const following = await postService.getUserFollowing(+req.params.id);
        res.json(following);
    } catch (err) {
        next(err);
    }
};

const getCommentList = async (req, res, next) => {
    try {
        const comments = await postService.fetchComments(+req.params.postId);
        res.json(comments);
    } catch (err) {
        next(err);
    }
};

const commentPosts = async (req, res, next) => {
    try {
        const result = await postService.createComment(
            +req.params.postId,
            req.user.id,
            req.body.comment
        );
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

const deleteCommentOnPost = async (req, res, next) => {
    try {
        await postService.removeComment(+req.params.id, req.user.id);
        res.status(204).end();
    } catch (err) {
        if (err.message.includes('unauthorized')) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next(err);
    }
};

module.exports = {
    getPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    postLike,
    removeLikes,
    followUsers,
    unfollowUsers,
    getFollowerList,
    getFollowingList,
    commentPosts,
    getCommentList,
    deleteCommentOnPost
};
