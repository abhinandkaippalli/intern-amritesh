const express = require("express");
const { getMovies, getShowtimes } = require("../controllers/movieController");
const router = express.Router();

router.get("/", getMovies);
router.get("/:movieId/showtimes", getShowtimes);

module.exports = router;
