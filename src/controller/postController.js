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
        // req.user.id comes from authMiddleware
        const post = await postService.createPost(req.user.id, {
            title: req.body.title,
            content: req.body.content,
            countryCode: req.body.countryCode,
            visitDate: req.body.visitDate,
            mediaUrl: req.file ? `/upload/${req.file.filename}` : null,
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
                mediaUrl: req.file ? `/uploads/${req.file.filename}` : req.body.mediaUrl,
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

module.exports = {
    getPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost
};
