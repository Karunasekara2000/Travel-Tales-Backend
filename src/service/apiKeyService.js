const apiKeyDAO = require("../dao/apiKeyDao");
const logService = require("../service/logService");

class ApiKeyService {
    async generate(userId, name) {
        if (!name) throw new Error("API key name is required");

        const key = await apiKeyDAO.createApiKey(userId, name);
        await logService.log(userId, "API_KEY_GENERATE", key.id, `API key '${name}' generated`);

        return key;
    }

    async list(userId) {

        const keyList = await apiKeyDAO.getApiKeysByUserId(userId);
        await logService.log(userId, "API_KEY_LIST", JSON.stringify(keyList), "Listed all API keys");
        return keyList;
    }

    async findUserByKey(apiKey) {
        return await apiKeyDAO.findUserByApiKey(apiKey);
    }

    async updateStatus(keyId) {

        const status = await apiKeyDAO.keyStatus(keyId)
        const userId = await apiKeyDAO.findUserByKeyId(keyId)

        await logService.log(userId, "API_KEY_STATUS_TOGGLE", keyId, "API key status changed");

        return status;
    }

    async deleteKey(keyId, userId) {

        const result = await apiKeyDAO.deleteApiKey(keyId, userId);
        await logService.log(userId, "API_KEY_DELETE", keyId,  "API key deleted");

        return result;
    }
}

module.exports = new ApiKeyService();
