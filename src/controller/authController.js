const authService = require("../service/authService");
const setAuthCookies = require("../util/authCookieUtil");

const register = async (req, res) => {
    try {
        const result = await authService.register(req.body);
        setAuthCookies(res, result, 201);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const login = async (req, res) => {
    try {
        const result = await authService.login(req.body.username, req.body.password);
        if (!result)
            return res.status(401).json({ error: "Invalid credentials" });
        setAuthCookies(res, result);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { register, login };
