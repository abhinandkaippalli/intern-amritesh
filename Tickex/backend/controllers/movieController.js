const Movie = require("../models/Movie");

exports.getMovies = async (req, res) => {
  const { language, genre, format, is_premier } = req.query;
  let filter = {};

  if (language) filter.languages = language;
  if (genre) filter.genres = genre;
  if (format) filter.formats = format;
  if (is_premier !== undefined) filter.is_premier = is_premier; 
  try {
    const movies = await Movie.find(filter);
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movies" });
  }
};

exports.getMovieDetails = async (req, res) => {
  const movieId = req.params.movieId;
  try {
    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movie details" });
  }
};

exports.getShowtimes = async (req, res) => {
  const movieId = req.params.movieId;
  try {
    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json(movie.showtimes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch showtimes" });
  }
};

exports.getShowtimeSeats = async (req, res) => {
  const { movieId, showtimeId } = req.params;
  try {
    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    const showtime = movie.showtimes.id(showtimeId);
    if (!showtime)
      return res.status(404).json({ message: "Showtime not found" });

    res.json(showtime.seats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch seats for showtime" });
  }
};
exports.updateMovieRating = async (req, res) => {
  const { movieId } = req.params;
  const { rating } = req.body;
  try {
    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    // Update rating based on new rating and increment count
    const updatedRating =
      (movie.rating * movie.ratingCount + rating) / (movie.ratingCount + 1);
    movie.rating = updatedRating;
    movie.ratingCount += 1;

    await movie.save();
    res.json({ message: "Rating updated successfully", rating: updatedRating });
  } catch (error) {
    res.status(500).json({ error: "Failed to update movie rating" });
  }
};

exports.bookShowtimeSeats = async (req, res) => {
  const { movieId, showtimeId } = req.params;
  const { seats, userId } = req.body;

  try {
    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    const showtime = movie.showtimes.id(showtimeId);
    if (!showtime)
      return res.status(404).json({ message: "Showtime not found" });

    seats.forEach((seatNumber) => {
      const seat = showtime.seats.find((s) => s.seatNumber === seatNumber);
      if (seat && !seat.isBooked) {
        seat.isBooked = true;
        seat.bookedBy = userId;
      }
    });

    await movie.save();
    res.json({ message: "Seats booked successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to book seats for showtime" });
  }
};
