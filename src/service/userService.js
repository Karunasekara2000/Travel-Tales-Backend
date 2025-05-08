const userDao = require("../dao/userDao");
const logService = require("../service/logService");

class UserService {

    async getAllUsers() {
        return await userDao.getAllUsers();
    }

    async updateUser(id, username, role) {
        if (!username || !role) {
            throw new Error("Username and role are required for update");
        }

        const result = await userDao.updateUser(id, username, role);
        await logService.log(id, "UPDATE_USER", null, `Updated user [id=${id}, username=${username}, role=${role}]`);
        return result;
    }

    async deleteUser(id) {
        const result = await userDao.deleteUser(id);
        await logService.log(id, "DELETE_USER", null, `Deleted user with ID: ${id}`);
        return result;
    }
}

module.exports = new UserService();
