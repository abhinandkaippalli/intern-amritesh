const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: String,
  genres: [String],
  languages: [String],
  formats: [String],
  rating: Number,
  duration: String,
  cast: [{ name: String, role: String }],
  showtimes: [
    {
      date: String,
      times: [
        {
          time: String,
          seats: [
            {
              seatNumber: String,
              isBooked: { type: Boolean, default: false },
              bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
            }
          ]
        }
      ]
    }
  ]
});

module.exports = mongoose.model('Movie', movieSchema);
