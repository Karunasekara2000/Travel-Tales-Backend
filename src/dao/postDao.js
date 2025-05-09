const db = require('../config/database');

/**
 * Fetch paginated posts with optional filters and like/dislike counts
 */
function getPosts({ country, author, page = 1, limit = 10, sort = 'created_at' }) {
    return new Promise((resolve, reject) => {
        const params = [];
        const where = [];

        if (country) {
            where.push('p.country_code = ?');
            params.push(country.toUpperCase());
        }
        if (author) {
            where.push('u.username = ?');
            params.push(author);
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
        p.created_at   AS createdAt,
        (SELECT COUNT(*) FROM likes WHERE post_id = p.id AND is_like = 1) AS likeCount,
        (SELECT COUNT(*) FROM likes WHERE post_id = p.id AND is_like = 0) AS dislikeCount
      FROM posts p
      JOIN users u ON u.id = p.author_id
      ${whereSQL}
      ORDER BY p.${sort} DESC
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
function createPost({ title, content, countryCode, visitDate, authorId, mediaUrl }) {
    return new Promise((resolve, reject) => {
        const sql = `
      INSERT INTO posts 
        (title, content, country_code, visit_date, author_id, media_url)
      VALUES (?, ?, ?, ?, ?, ?);
    `;
        db.run(sql, [title, content, countryCode.toUpperCase(), visitDate, authorId, mediaUrl], function(err) {
            if (err) return reject(err);
            // this.lastID contains the new post's ID
            getPostById(this.lastID).then(resolve).catch(reject);
        });
    });
}

/**
 * Update an existing post (only if the author matches)
 */
function updatePost(id, authorId, { title, content, countryCode, visitDate, mediaUrl }) {
    return new Promise((resolve, reject) => {
        const sql = `
      UPDATE posts SET
        title = ?,
        content = ?,
        country_code = ?,
        visit_date = ?,
        media_url = ?
      WHERE id = ? AND author_id = ?;
    `;
        db.run(
            sql,
            [title, content, countryCode.toUpperCase(), visitDate, mediaUrl, id, authorId],
            function(err) {
                if (err) return reject(err);
                if (this.changes === 0) return reject(new Error('Not found or unauthorized'));
                getPostById(id).then(resolve).catch(reject);
            }
        );
    });
}

/**
 * Delete a post (only if the author matches)
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

module.exports = {
    getPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost
};
