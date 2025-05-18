const express = require("express");
const {listUsers, updateUser, deleteUser} = require("../controller/userController");

const router = express.Router();

/**
 * Posts Routes
 */
router.get("/", listUsers);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
