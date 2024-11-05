const Movie = require('../models/Movie');

exports.getMovies = async (req, res) => {
  const { language, genre, format } = req.query;
  let filter = {};

  if (language) filter.languages = language;
  if (genre) filter.genres = genre;
  if (format) filter.formats = format;

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
