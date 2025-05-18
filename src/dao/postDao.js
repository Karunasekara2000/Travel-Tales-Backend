const db = require('../config/database');

/**
 * Fetch paginated posts with optional filters and like/dislike counts
 */
function getPosts({ country, author, page = 1, limit = 10, sort = 'created_at' }) {
    return new Promise((resolve, reject) => {
        const params = [];
        const where = [];

        if (country) {
            where.push('LOWER(p.country_code) LIKE LOWER(?)');
            params.push(`%${country}%`);
        }
        if (author) {
            where.push('LOWER(u.username) LIKE LOWER(?)');
            params.push(`%${author}%`);
        }

        const whereSQL = where.length ? `WHERE ${where.join(' AND ')}` : '';
        const offset = (page - 1) * limit;

        const sql = `
      SELECT
        p.id,
        p.title,
        p.content,
        p.country_code AS countryCode,
        p.visit_date   AS visitDate,
        p.author_id    AS authorId,
        u.username     AS authorUsername,
        p.media_url    AS mediaUrl,
        p.currency     AS currency,
        p.capital      AS capital,
        p.created_at   AS createdAt,
        (SELECT COUNT(*) FROM likes WHERE post_id = p.id AND is_like = 1) AS likeCount,
        (SELECT COUNT(*) FROM likes WHERE post_id = p.id AND is_like = 0) AS dislikeCount
      FROM posts p
      JOIN users u ON u.id = p.author_id
      ${whereSQL}
      ORDER BY likeCount DESC, p.${sort} DESC
      LIMIT ? OFFSET ?;
    `;

        params.push(limit, offset);
        db.all(sql, params, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}

/**
 * Fetch a single post by ID, including like/dislike counts
 */
function getPostById(id) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT " +
            "        p.*, " +
            "        (SELECT COUNT(*) FROM likes WHERE post_id = p.id AND is_like = 1) AS likeCount, " +
            "        (SELECT COUNT(*) FROM likes WHERE post_id = p.id AND is_like = 0) AS dislikeCount " +
            "      FROM posts p " +
            "      WHERE p.id = ?"
      ;
        db.get(sql, [id], (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
}

/**
 * Insert a new post and return the created record
 */
function createPost({ title, content, countryCode, visitDate, authorId, mediaUrl, capital, currency }) {
    return new Promise((resolve, reject) => {
        const sql = `
      INSERT INTO posts 
        (title, content, country_code, visit_date, author_id, media_url,capital,currency)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;
        db.run(sql, [title, content, countryCode.toUpperCase(), visitDate, authorId, mediaUrl, capital, currency], function(err) {
            if (err) return reject(err);
            // this.lastID contains the new post's ID
            getPostById(this.lastID).then(resolve).catch(reject);
        });
    });
}

/**
 * Update an existing post
 */
function updatePost(id, authorId, { title, content, countryCode, visitDate, mediaUrl, capital, currency }) {
    return new Promise((resolve, reject) => {
        const sql = `
      UPDATE posts SET
        title = ?,
        content = ?,
        country_code = ?,
        visit_date = ?,
        media_url = ?,
        capital = ?,
        currency = ?
      WHERE id = ? AND author_id = ?;
    `;
        db.run(
            sql,
            [title, content, countryCode.toUpperCase(), visitDate, mediaUrl, capital, currency, id, authorId],
            function(err) {
                if (err) return reject(err);
                if (this.changes === 0) return reject(new Error('Not found or unauthorized'));
                getPostById(id).then(resolve).catch(reject);
            }
        );
    });
}

/**
 * Delete a post
 */
function deletePost(id, authorId) {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM posts WHERE id = ? AND author_id = ?;`;
        db.run(sql, [id, authorId], function(err) {
            if (err) return reject(err);
            if (this.changes === 0) return reject(new Error('Not found or unauthorized'));
            resolve();
        });
    });
}


/**
 * Like a post
 */
function likePost(userId, postId, isLike) {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO likes (user_id, post_id, is_like)
            VALUES (?, ?, ?)
            ON CONFLICT(user_id, post_id) DO UPDATE SET is_like = ?;
        `;
        db.run(sql, [userId, postId, isLike,  isLike], function (err) {
            if (err) return reject(err);
            resolve();
        });
    });
}

/**
 * Unlike a post
 */
function unlikePost(userId, postId) {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM likes WHERE user_id = ? AND post_id = ?;`;
        db.run(sql, [userId, postId], function(err) {
            if (err) return reject(err);
            resolve();
        });
    });
}

/**
 * Follows an author
 */
function followUser(followerId, followingId) {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT OR IGNORE INTO follows (follower_id, following_id)
            VALUES (?, ?);
        `;
        db.run(sql, [followerId, followingId], function(err) {
            if (err) return reject(err);
            resolve();
        });
    });
}

/**
 * UnFollows an author
 */
function unfollowUser(followerId, followingId) {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM follows WHERE follower_id = ? AND following_id = ?;`;
        db.run(sql, [followerId, followingId], function(err) {
            if (err) return reject(err);
            resolve();
        });
    });
}

/**
 * Get followers list of author
 */
function getFollowers(userId) {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT u.id, u.username
            FROM users u
            JOIN follows f ON f.follower_id = u.id
            WHERE f.following_id = ?;
        `;
        db.all(sql, [userId], (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}

/**
 * Get following list of author
 */
function getFollowing(userId) {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT u.id, u.username
            FROM users u
            JOIN follows f ON f.following_id = u.id
            WHERE f.follower_id = ?;
        `;
        db.all(sql, [userId], (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}

/**
 * Get Comment list of author
 */
function getCommentsByPost(postId) {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT c.id, c.comment, c.created_at, u.username AS author
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.post_id = ?
            ORDER BY c.created_at DESC
        `;
        db.all(sql, [postId], (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}

/**
 * Post a comment for the author
 */
function addComment(postId, userId, comment) {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO comments (post_id, user_id, comment)
            VALUES (?, ?, ?)
        `;
        db.run(sql, [postId, userId, comment], function (err) {
            if (err) return reject(err);
            resolve({ id: this.lastID, postId, userId, comment });
        });
    });
}

/**
 * Delete a comment
 */
function deleteComment(commentId, userId) {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM comments WHERE id = ? AND user_id = ?`;
        db.run(sql, [commentId, userId], function (err) {
            if (err) return reject(err);
            if (this.changes === 0) return reject(new Error("Not found or unauthorized"));
            resolve();
        });
    });
}



module.exports = {
    getPosts,
    createPost,
    updatePost,
    deletePost,
    likePost,
    unlikePost,
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    getCommentsByPost,
    addComment,
    deleteComment
};
