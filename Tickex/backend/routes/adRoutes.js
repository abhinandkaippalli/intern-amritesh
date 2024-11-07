const express = require("express");
const { getAds } = require("../controllers/adController");
const router = express.Router();

router.get("/", getAds);

module.exports = router;
