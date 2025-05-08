require("dotenv").config(); // add here too

const jwt = require("jsonwebtoken");
const { generateToken: generateCSRFToken } = require("./csrf");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "24h";

const generateTokens = (user) => {
    const accessToken = jwt.sign(
        {
            id: user.id,
            username: user.username,
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );

    const csrfToken = generateCSRFToken();

    return { accessToken, csrfToken };
};

const verifyJWT = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return null;
    }
};

module.exports = { generateTokens, verifyJWT };
