const logDAO = require("../dao/logDao");

class LogService {
    async log(userId, action, apiKeyId, details) {
        return await logDAO.insertLog(userId, action, apiKeyId, details);
    }
}

module.exports = new LogService();
