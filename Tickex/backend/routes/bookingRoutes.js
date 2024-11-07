const express = require("express");
const {
  bookSeats,
  checkout,
  addDonation,
  getBookingSummary,
  addSeatsToBooking,
} = require("../controllers/bookingController");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/book", auth, bookSeats);
router.post("/checkout", auth, checkout);
router.post("/add-donation", auth, addDonation);
router.get("/summary", auth, getBookingSummary);
router.post("/:bookingId/add-seats", auth, addSeatsToBooking);

module.exports = router;
