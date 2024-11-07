const Movie = require("../models/Movie");
const Booking = require("../models/Booking");

exports.bookSeats = async (req, res) => {
  const {
    movieId,
    showtimeId,
    seats,
    theater,
    ticketType = "M-Ticket",
  } = req.body;
  const userId = req.user.userId;

  if (!Array.isArray(seats) || seats.length === 0) {
    return res.status(400).json({ message: "Seats must be a non-empty array" });
  }

  try {
    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    const showtime = movie.showtimes.find((st) =>
      st.times.some((time) => time._id.toString() === showtimeId)
    );

    if (!showtime)
      return res.status(404).json({ message: "Showtime not found" });

    const timeSlot = showtime.times.find(
      (time) => time._id.toString() === showtimeId
    );

    const unavailableSeats = seats.filter((seatNumber) => {
      const seat = timeSlot.seats.find((s) => s.seatNumber === seatNumber);
      return !seat || seat.isBooked;
    });

    if (unavailableSeats.length > 0) {
      return res
        .status(400)
        .json({ message: "Some seats are already booked", unavailableSeats });
    }

    seats.forEach((seatNumber) => {
      const seat = timeSlot.seats.find((s) => s.seatNumber === seatNumber);
      seat.isBooked = true;
      seat.bookedBy = userId;
    });

    await movie.save();

    const booking = new Booking({
      user: userId,
      movie: movieId,
      showtime: { date: showtime.date, time: timeSlot.time },
      seats,
      theater,
      ticketType,
    });

    await booking.save();
    res.json({ message: "Seats booked successfully", booking });
  } catch (error) {
    console.error("Error booking seats:", error);
    res.status(500).json({ error: "Failed to book seats" });
  }
};

exports.checkout = async (req, res) => {
  const { bookingId, paymentDetails } = req.body;

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.paymentStatus = true;
    booking.totalPrice = paymentDetails.amount;
    await booking.save();

    res.json({ message: "Booking confirmed", bookingDetails: booking });
  } catch (error) {
    res.status(500).json({ error: "Failed to confirm booking" });
  }
};

exports.addSeatsToBooking = async (req, res) => {
  const { bookingId } = req.params;
  const { seats } = req.body;
  const userId = req.user.userId;

  if (!Array.isArray(seats) || seats.length === 0) {
    return res.status(400).json({ message: "Seats must be a non-empty array" });
  }

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const movie = await Movie.findById(booking.movie);
    const showtime = movie.showtimes.find(
      (st) => st.date === booking.showtime.date
    );
    const timeSlot = showtime.times.find(
      (time) => time.time === booking.showtime.time
    );

    const unavailableSeats = seats.filter((seatNumber) => {
      const seat = timeSlot.seats.find((s) => s.seatNumber === seatNumber);
      return !seat || seat.isBooked;
    });

    if (unavailableSeats.length > 0) {
      return res
        .status(400)
        .json({ message: "Some seats are already booked", unavailableSeats });
    }

    seats.forEach((seatNumber) => {
      const seat = timeSlot.seats.find((s) => s.seatNumber === seatNumber);
      seat.isBooked = true;
      seat.bookedBy = userId;
    });

    await movie.save();

    booking.seats = booking.seats.concat(seats);
    await booking.save();

    res.json({ message: "Seats added to booking", booking });
  } catch (error) {
    res.status(500).json({ error: "Failed to add seats to booking" });
  }
};

exports.addDonation = async (req, res) => {
  const { bookingId, donationAmount } = req.body;

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.donation = (booking.donation || 0) + donationAmount;
    await booking.save();

    res.json({
      message: "Donation added successfully",
      donation: booking.donation,
    });
  } catch (error) {
    console.error("Error adding donation:", error);
    res.status(500).json({ error: "Failed to add donation" });
  }
};

exports.getBookingSummary = async (req, res) => {
  const userId = req.user.userId;

  try {
    const bookings = await Booking.find({ user: userId })
      .populate("movie", "title genres languages formats")
      .exec();

    const summary = bookings.map((booking) => ({
      bookingId: booking._id,
      movieTitle: booking.movie ? booking.movie.title : "Unknown Movie",
      genres: booking.movie ? booking.movie.genres : [],
      languages: booking.movie ? booking.movie.languages : [],
      formats: booking.movie ? booking.movie.formats : [],
      showtime: `${booking.showtime.date} at ${booking.showtime.time}`,
      theater: booking.theater,
      ticketType: booking.ticketType,
      seats: booking.seats,
      food: booking.food.map((item) => item.name),
      totalPrice: booking.totalPrice,
      paymentStatus: booking.paymentStatus,
      cancellationAvailable: true,
    }));

    res.json(summary);
  } catch (error) {
    console.error("Error fetching booking summary:", error);
    res.status(500).json({ error: "Failed to fetch booking summary" });
  }
};
