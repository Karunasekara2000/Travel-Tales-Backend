const { verifyJWT } = require("../config/jwt");

const authenticateJWT = (req, res, next) => {
    const token = req.cookies?.jwt;
    if (!token) return res.status(401).json({ error: "JWT missing" });

    const decoded = verifyJWT(token);
    if (!decoded) return res.status(403).json({ error: "Invalid JWT" });

    req.user = decoded;
    next();
};

module.exports = { authenticateJWT };
