const apiKeyService = require("../service/apiKeyService");

const generateKey = async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.user.id;

        const apiKey = await apiKeyService.generate(userId, name);
        res.status(201).json({
            message: "API key created successfully",
            apiKey: apiKey.key,
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const listKeys = async (req, res) => {
    try {
        const userId = req.user.id;
        const keys = await apiKeyService.list(userId);
        res.json({ keys });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateKeyStatus = async (req, res) => {
    try {
        const keyId = req.params.id;
        const userId = req.user.id;
        await apiKeyService.updateStatus(keyId);
        res.json({ message: "API key status toggled successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteKey = async (req, res) => {
    try {
        const keyId = req.params.id;
        const userId = req.user.id;

        const result = await apiKeyService.deleteKey(keyId, userId);
        if (result.deleted) {
            res.json({ message: "API key deleted successfully" });

        } else {
            res.status(404).json({ error: "Key not found or unauthorized" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { generateKey, listKeys, updateKeyStatus, deleteKey };
