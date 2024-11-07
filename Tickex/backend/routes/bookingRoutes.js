const express = require("express");
const { bookSeats, checkout } = require("../controllers/bookingController");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/book", auth, bookSeats);
router.post("/checkout", auth, checkout);

module.exports = router;
