const { verifyToken } = require("../config/csrf");

const csrfProtection = (req, res, next) => {
    if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();

    const headerToken = req.headers["x-csrf-token"];
    const cookieToken = req.cookies["csrf-token"];

    if (!headerToken || !cookieToken || headerToken !== cookieToken) {
        return res.status(403).json({ error: "CSRF token mismatch" });
    }

    if (!verifyToken(headerToken)) {
        return res.status(403).json({ error: "Invalid CSRF token" });
    }

    next();
};

module.exports = { csrfProtection };
