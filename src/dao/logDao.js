const db = require("../config/database");

const insertLog = (userId, action, apiKeyId, details) => {
    return new Promise((resolve, reject) => {
        db.run(
            "INSERT INTO logs (user_id, action, api_key_id, details) " +
            "VALUES (?, ?, ?, ?) " ,
            [userId, action, apiKeyId, details],
            function (err) {
                if (err) reject(err);
                else resolve({ id: this.lastID });
            }
        );
    });
};

module.exports = { insertLog };
