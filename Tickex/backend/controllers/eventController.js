// controllers/eventController.js
const Event = require('../models/Event'); // Ensure an Event model exists

// Fetch Outdoor Events
exports.getOutdoorEvents = async (req, res) => {
  try {
    const outdoorEvents = await Event.find({ category: "Outdoor" });
    res.json(outdoorEvents);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch outdoor events" });
  }
};

// Fetch Laughter Events
exports.getLaughterEvents = async (req, res) => {
  try {
    const laughterEvents = await Event.find({ category: "Laughter" });
    res.json(laughterEvents);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch laughter events" });
  }
};

// Fetch Popular Events
exports.getPopularEvents = async (req, res) => {
  try {
    const popularEvents = await Event.find({ category: "Popular" });
    res.json(popularEvents);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch popular events" });
  }
};

// Fetch Latest Events
exports.getLatestEvents = async (req, res) => {
  try {
    const latestEvents = await Event.find({}).sort({ date: -1 }).limit(10);
    res.json(latestEvents);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch latest events" });
  }
};
