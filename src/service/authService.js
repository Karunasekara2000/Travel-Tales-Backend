const bcrypt = require("bcrypt");
const authDAO = require("../dao/authDao");
const { generateTokens } = require("../config/jwt");
const logService = require("../service/logService");

class AuthService {
    async register({ username, password }) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = await authDAO.createUser({ username, password: hashedPassword });
        const user = await authDAO.findUserById(userId);

        user.role = user.role || "USER";
        const { accessToken, csrfToken } = generateTokens(user);
        delete user.password;

        await logService.log(userId, "REGISTER", null, "User registered");

        return { accessToken, csrfToken, user };
    }

    async login(username, password) {
        const user = await authDAO.findUserByUsername(username);
        if (!user) return null;

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        user.role = user.role || "USER";
        const { accessToken, csrfToken } = generateTokens(user);
        delete user.password;

        await logService.log(user.id, "LOGIN", null, "User logged in");

        return { accessToken, csrfToken, user };
    }
}

module.exports = new AuthService();
