const express = require("express");
const {
  getMovies,
  getShowtimes,
  getMovieDetails,
  getShowtimeSeats,
  updateMovieRating,
  bookShowtimeSeats,
} = require("../controllers/movieController");
const auth = require("../middleware/authMiddleware"); // Make sure auth middleware is set up

const router = express.Router();

router.get("/", getMovies);
router.get("/:movieId", getMovieDetails);
router.get("/:movieId/showtimes", getShowtimes);
router.get("/:movieId/showtimes/:showtimeId/seats", getShowtimeSeats);

// New Routes for Rating and Booking
router.put("/:movieId/rate", auth, updateMovieRating); // Protected route
router.post("/:movieId/showtimes/:showtimeId/book", auth, bookShowtimeSeats); // Protected route

module.exports = router;
