const express = require("express");
const { getBookingHistory } = require("../controllers/historyController");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/history", auth, getBookingHistory);

module.exports = router;
