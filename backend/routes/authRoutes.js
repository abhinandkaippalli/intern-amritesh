const express = require("express");
const { signup, login, logout, refreshToken } = require("../controllers/authController");

const router = express.Router();

router.post("/create-account", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);

module.exports = router;
