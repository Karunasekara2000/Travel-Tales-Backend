const Tokens = require("csrf");
const tokens = new Tokens();

const generateToken = () => tokens.create(process.env.CSRF_SECRET);

const verifyToken = (token) => tokens.verify(process.env.CSRF_SECRET, token);

module.exports = { generateToken, verifyToken };
