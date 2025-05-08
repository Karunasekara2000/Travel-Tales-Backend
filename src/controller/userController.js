const userService = require("../service/userService");

const listUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.json({ users });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, role } = req.body;

        await userService.updateUser(id, username, role);

        res.json({ message: "User updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await userService.deleteUser(id);
        //await logService.log(req.user.id, "ADMIN_DELETE_USER", null, `Deleted user ID: ${id}`);

        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



module.exports = {  listUsers, updateUser, deleteUser };
