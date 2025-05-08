const apiKeyService = require("../service/apiKeyService");

const apiKeyAuth = async (req, res, next) => {
    const apiKey = req.header("x-api-key");
    if (!apiKey) {
        return res.status(401).json({ error: "API key missing" });
    }

    try {
        const keyData = await apiKeyService.findUserByKey(apiKey);
        if (!keyData || !keyData.is_active) {
            return res.status(403).json({ error: "Invalid or inactive API key" });
        }

        req.apiKey = keyData;
        next();
    } catch (error) {
        console.error("API key auth error:", error);
        res.status(500).json({ error: "Failed to validate API key" });
    }
};

module.exports = apiKeyAuth;
