const db = require("../config/database");


const getAllUsers = () => {
    return new Promise((resolve, reject) => {
        db.all("SELECT id, username, role FROM users", [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};


const updateUser = (id, username, role) => {
    return new Promise((resolve, reject) => {
        db.run(
            "UPDATE users SET username = ?, role = ? WHERE id = ?",
            [username, role, id],
            function (err) {
                if (err) reject(err);
                else resolve({ updated: this.changes > 0 });
            }
        );
    });
};

//  Delete user
const deleteUser = (id) => {
    return new Promise((resolve, reject) => {
        db.run("DELETE FROM api_keys WHERE user_id = ?", [id]);
        db.run("DELETE FROM logs WHERE user_id = ?", [id]);
        db.run("DELETE FROM users WHERE id = ?", [id], function (err) {
            if (err) reject(err);
            else resolve({ deleted: this.changes > 0 });
        });
    });
};

module.exports = {
    getAllUsers,
    updateUser,
    deleteUser
};
