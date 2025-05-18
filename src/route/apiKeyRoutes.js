const express = require("express");
const router = express.Router();
const { generateKey, listKeys, updateKeyStatus, deleteKey} = require("../controller/apiKeyController");
const { authenticateJWT } = require("../middleware/authMiddleware");
const { csrfProtection } = require("../middleware/csrfMiddleware");

/**
 * API Key Routes
 */
router.use(authenticateJWT);
router.use(csrfProtection);
router.post("/generate", generateKey);
router.get("/list", listKeys);
router.patch("/status/:id", updateKeyStatus);
router.delete("/:id", deleteKey);

module.exports = router;
