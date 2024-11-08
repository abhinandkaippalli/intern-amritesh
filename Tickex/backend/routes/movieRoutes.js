const express = require("express");
const {
  getMovies,
  getShowtimes,
  getMovieDetails,
  getShowtimeSeats,
  updateMovieRating,
  bookShowtimeSeats,
} = require("../controllers/movieController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getMovies);
router.get("/:movieId", getMovieDetails);
router.patch("/:movieId", updateMovieRating); // PATCH for updating rating
router.get("/:movieId/showtimes", getShowtimes);
router.get("/:movieId/showtimes/:showtimeId/seats", getShowtimeSeats);
router.post("/:movieId/showtimes/:showtimeId/book", auth, bookShowtimeSeats); // POST for booking seats

module.exports = router;
