const logDAO = require("../dao/logDAO");

class LogService {
    async log(userId, action, apiKeyId, details) {
        return await logDAO.insertLog(userId, action, apiKeyId, details);
    }
}

module.exports = new LogService();
