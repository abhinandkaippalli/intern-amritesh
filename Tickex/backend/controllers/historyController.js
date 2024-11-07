const Booking = require("../models/Booking");

exports.getBookingHistory = async (req, res) => {
  const userId = req.user.userId;
  try {
    const bookings = await Booking.find({ user: userId })
      .populate("movie", "title genres languages formats")
      .exec();

    const formattedBookings = bookings.map((booking) => ({
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
      donation: booking.donation || 0, 
      paymentStatus: booking.paymentStatus,
      cancellationAvailable: true,
    }));

    res.json(formattedBookings);
  } catch (error) {
    console.error("Error fetching booking history:", error);
    res.status(500).json({ error: "Failed to fetch booking history" });
  }
};
