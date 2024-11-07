// routes/eventRoutes.js
const express = require("express");
const {
  getOutdoorEvents,
  getLaughterEvents,
  getPopularEvents,
  getLatestEvents,
} = require("../controllers/eventController");

const router = express.Router();

router.get("/outdoor", getOutdoorEvents); // Fetches outdoor events
router.get("/laughter", getLaughterEvents); // Fetches laughter events
router.get("/popular", getPopularEvents); // Fetches popular events
router.get("/latest", getLatestEvents); // Fetches latest events

module.exports = router;
