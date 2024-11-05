const Movie = require("../models/Movie");
const Booking = require("../models/Booking");

exports.bookSeats = async (req, res) => {
  const { movieId, showtimeId, seats, theater, ticketType } = req.body;
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

    if (!showtime) {
      console.log("Showtime ID provided:", showtimeId);
      return res.status(404).json({ message: "Showtime not found" });
    }

    const timeSlot = showtime.times.find(
      (time) => time._id.toString() === showtimeId
    );

    if (!timeSlot) {
      return res.status(404).json({ message: "Time slot not found" });
    }

    const unavailableSeats = [];
    seats.forEach((seatNumber) => {
      const seat = timeSlot.seats.find((s) => s.seatNumber === seatNumber);
      if (!seat || seat.isBooked) {
        unavailableSeats.push(seatNumber);
      } else {
        seat.isBooked = true;
        seat.bookedBy = userId;
      }
    });

    if (unavailableSeats.length > 0) {
      return res
        .status(400)
        .json({ message: "Some seats are already booked", unavailableSeats });
    }

    await movie.save();

    const booking = new Booking({
      user: userId,
      movie: movieId,
      showtime: { date: showtime.date, time: timeSlot.time },
      seats: seats,
      theater: theater,
      ticketType: ticketType || "M-Ticket",
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
    booking.paymentStatus = true;
    booking.totalPrice = paymentDetails.amount;
    await booking.save();
    res.json({ message: "Booking confirmed", bookingDetails: booking });
  } catch (error) {
    res.status(500).json({ error: "Failed to confirm booking" });
  }
};
