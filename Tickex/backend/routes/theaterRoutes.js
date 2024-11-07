const express = require("express");
const { getCinemas } = require("../controllers/theaterController");
const router = express.Router();

router.get("/", getCinemas);

module.exports = router;
