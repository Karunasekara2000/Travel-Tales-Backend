const db = require("../config/database");

const findUserByUsername = (username) => {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
            if (err) reject(err);
            else resolve(user);
        });
    });
};

const findUserById = (id) => {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM users WHERE id = ?", [id], (err, user) => {
            if (err) reject(err);
            else resolve(user);
        });
    });
};

const createUser = (userData) => {
    return new Promise((resolve, reject) => {
        const { username, password, role = "USER" } = userData;
        db.run(
            "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
            [username, password, role],
            function (err) {
                if (err) reject(err);
                else resolve(this.lastID);
            }
        );
    });
};



module.exports = {
    findUserByUsername,
    findUserById,
    createUser
};
