const { v4: uuidv4 } = require("uuid");
const db = require("../config/database");

const createApiKey = (userId, name) => {
    const id = uuidv4();
    const key = uuidv4();

    return new Promise((resolve, reject) => {
        db.run(
            "INSERT INTO api_keys (id, key, user_id, name) VALUES (?, ?, ?, ?)",
            [id, key, userId, name],
            (err) => {
                if (err) reject(err);
                else resolve({ id, key, userId, name });
            }
        );
    });
};

const getApiKeysByUserId = (userId) => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM api_keys WHERE user_id = ?", [userId], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

const findUserByApiKey = (key) => {
    return new Promise((resolve, reject) => {
        const query = "SELECT users.*, api_keys.last_used, api_keys.is_active" +
            " FROM users " +
            "JOIN api_keys ON users.id = api_keys.user_id " +
            "WHERE api_keys.key = ?";
        db.get(query, [key], (err, row) => {
            if (err) reject(err);
            else {
                // Update usage timestamp
                if (row) {
                    db.run("UPDATE api_keys SET last_used = DATETIME('now', 'localtime') WHERE key = ?", [key]);
                }
                resolve(row);
            }
        });
    });
};


const findUserByKeyId = (keyId) => {
    return new Promise((resolve, reject) => {
        const query = "SELECT user_id FROM api_keys WHERE id = ?";
        db.get(query, [keyId], (err, row) => {
            if (err) reject(err);
            else resolve(row?.user_id || null);
        });
    });
};


// Toggle active/inactive status of API key
const keyStatus = (keyId) => {
    return new Promise((resolve, reject) => {
        const query = "UPDATE api_keys " +
            "SET is_active = NOT is_active " +
            "WHERE id = ? ";
        db.run(query, [keyId], function (err) {
            if (err) reject(err);
            else resolve({ updated: true });
        });
    });
};

// Delete API key
const deleteApiKey = (keyId, userId) => {
    return new Promise((resolve, reject) => {
        const query = "DELETE FROM api_keys WHERE id = ? AND user_id = ?";
        db.run(query, [keyId, userId], function (err) {
            if (err) reject(err);
            else resolve({ deleted: this.changes > 0 });
        });
    });
};

module.exports = {
    createApiKey,
    getApiKeysByUserId,
    findUserByApiKey,
    keyStatus,
    deleteApiKey,
    findUserByKeyId
};
