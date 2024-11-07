const mongoose = require('mongoose');
const Movie = require('./models/Movie');
const Food = require('./models/Food');
const Theater = require('./models/Theater');

require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log("MongoDB connection error:", err));

const seedData = async () => {
  try {
    await Movie.deleteMany();
    await Food.deleteMany();
    await Theater.deleteMany();

    const theaters = await Theater.insertMany([
      { name: 'PVR Forum Mall, Kochi', location: 'Kochi', amenities: ['M-Ticket', 'Food & Beverage', 'Parking'] },
      { name: 'PVR Oberon Mall, Kochi', location: 'Kochi', amenities: ['M-Ticket', 'Food & Beverage'] },
      { name: 'INOX City Mall, Mumbai', location: 'Mumbai', amenities: ['E-Ticket', 'Food & Beverage', 'Parking'] },
      { name: 'Carnival Cinemas, Bangalore', location: 'Bangalore', amenities: ['M-Ticket', 'Food & Beverage', 'Parking'] },
      { name: 'Cinepolis, Hyderabad', location: 'Hyderabad', amenities: ['M-Ticket', 'Food & Beverage'] },
      { name: 'AMC Cinemas, Delhi', location: 'Delhi', amenities: ['E-Ticket', 'Parking'] }
    ]);

    await Movie.insertMany([
      {
        title: "Lucky Baskhar",
        genres: ["Crime", "Drama", "Thriller"],
        languages: ["Tamil"],
        formats: ["2D"],
        rating: 9.4,
        duration: "2h 30m",
        cast: [{ name: "Actor 1", role: "Lead" }, { name: "Actor 2", role: "Supporting" }],
        showtimes: [
          {
            theater: theaters[0]._id,
            date: "2024-11-05",
            times: [
              { time: "10:00 AM", seats: Array.from({ length: 10 }, (_, i) => ({ seatNumber: `A${i + 1}`, isBooked: false })) },
              { time: "02:00 PM", seats: Array.from({ length: 10 }, (_, i) => ({ seatNumber: `B${i + 1}`, isBooked: false })) },
              { time: "06:00 PM", seats: Array.from({ length: 10 }, (_, i) => ({ seatNumber: `C${i + 1}`, isBooked: false })) }
            ]
          }
        ]
      },
      {
        title: "Singham Again",
        genres: ["Action", "Drama"],
        languages: ["Hindi"],
        formats: ["2D", "3D"],
        rating: 8.1,
        duration: "2h 10m",
        cast: [{ name: "Ajay Devgn", role: "Lead" }, { name: "Kareena Kapoor", role: "Supporting" }],
        showtimes: [
          {
            theater: theaters[1]._id,
            date: "2024-11-06",
            times: [
              { time: "10:30 AM", seats: Array.from({ length: 10 }, (_, i) => ({ seatNumber: `A${i + 1}`, isBooked: false })) },
              { time: "03:30 PM", seats: Array.from({ length: 10 }, (_, i) => ({ seatNumber: `B${i + 1}`, isBooked: false })) },
              { time: "07:00 PM", seats: Array.from({ length: 10 }, (_, i) => ({ seatNumber: `C${i + 1}`, isBooked: false })) }
            ]
          }
        ]
      },
      {
        title: "Amaran",
        genres: ["Action", "Thriller"],
        languages: ["Tamil", "Hindi", "Telugu"],
        formats: ["2D"],
        rating: 7.5,
        duration: "2h 5m",
        cast: [{ name: "Sivakarthikeyan", role: "Lead" }, { name: "Sai Pallavi ", role: "Supporting" }],
        showtimes: [
          {
            theater: theaters[2]._id,
            date: "2024-11-07",
            times: [
              { time: "11:00 AM", seats: Array.from({ length: 10 }, (_, i) => ({ seatNumber: `D${i + 1}`, isBooked: false })) },
              { time: "03:00 PM", seats: Array.from({ length: 10 }, (_, i) => ({ seatNumber: `E${i + 1}`, isBooked: false })) },
              { time: "07:00 PM", seats: Array.from({ length: 10 }, (_, i) => ({ seatNumber: `F${i + 1}`, isBooked: false })) }
            ]
          }
        ]
      },
      {
        title: "RRR",
        genres: ["Drama", "Historical", "Action"],
        languages: ["Telugu", "Hindi"],
        formats: ["3D"],
        rating: 9.0,
        duration: "3h 10m",
        cast: [{ name: "Ram Charan", role: "Lead" }, { name: "Jr NTR", role: "Lead" }],
        showtimes: [
          {
            theater: theaters[3]._id,
            date: "2024-11-08",
            times: [
              { time: "09:30 AM", seats: Array.from({ length: 10 }, (_, i) => ({ seatNumber: `G${i + 1}`, isBooked: false })) },
              { time: "02:30 PM", seats: Array.from({ length: 10 }, (_, i) => ({ seatNumber: `H${i + 1}`, isBooked: false })) },
              { time: "06:30 PM", seats: Array.from({ length: 10 }, (_, i) => ({ seatNumber: `I${i + 1}`, isBooked: false })) }
            ]
          }
        ]
      },
      {
        title: "Brahmastra",
        genres: ["Fantasy", "Action"],
        languages: ["Hindi", "English"],
        formats: ["2D", "3D", "IMAX"],
        rating: 7.3,
        duration: "2h 45m",
        cast: [{ name: "Ranbir Kapoor", role: "Lead" }, { name: "Alia Bhatt", role: "Supporting" }],
        showtimes: [
          {
            theater: theaters[4]._id,
            date: "2024-11-09",
            times: [
              { time: "10:45 AM", seats: Array.from({ length: 10 }, (_, i) => ({ seatNumber: `J${i + 1}`, isBooked: false })) },
              { time: "03:45 PM", seats: Array.from({ length: 10 }, (_, i) => ({ seatNumber: `K${i + 1}`, isBooked: false })) },
              { time: "08:15 PM", seats: Array.from({ length: 10 }, (_, i) => ({ seatNumber: `L${i + 1}`, isBooked: false })) }
            ]
          }
        ]
      },
      {
        title: "Avatar: The Way of Water",
        genres: ["Sci-Fi", "Adventure"],
        languages: ["English", "Hindi"],
        formats: ["3D", "IMAX"],
        rating: 8.2,
        duration: "3h 15m",
        cast: [{ name: "Sam Worthington", role: "Jake" }, { name: "Zoe Saldana", role: "Neytiri" }],
        showtimes: [
          {
            theater: theaters[5]._id,
            date: "2024-11-10",
            times: [
              { time: "09:45 AM", seats: Array.from({ length: 10 }, (_, i) => ({ seatNumber: `M${i + 1}`, isBooked: false })) },
              { time: "02:15 PM", seats: Array.from({ length: 10 }, (_, i) => ({ seatNumber: `N${i + 1}`, isBooked: false })) },
              { time: "07:45 PM", seats: Array.from({ length: 10 }, (_, i) => ({ seatNumber: `O${i + 1}`, isBooked: false })) }
            ]
          }
        ]
      },
      {
        title: "Spider-Man: No Way Home",
        genres: ["Action", "Adventure"],
        languages: ["English", "Hindi", "Tamil"],
        formats: ["2D", "3D"],
        rating: 8.7,
        duration: "2h 28m",
        cast: [{ name: "Tom Holland", role: "Spider-Man" }, { name: "Zendaya", role: "MJ" }],
        showtimes: [
          {
            theater: theaters[0]._id,
            date: "2024-11-10",
            times: [
              { time: "10:30 AM", seats: Array.from({ length: 10 }, (_, i) => ({ seatNumber: `P${i + 1}`, isBooked: false })) },
              { time: "03:30 PM", seats: Array.from({ length: 10 }, (_, i) => ({ seatNumber: `Q${i + 1}`, isBooked: false })) },
              { time: "08:30 PM", seats: Array.from({ length: 10 }, (_, i) => ({ seatNumber: `R${i + 1}`, isBooked: false })) }
            ]
          }
        ]
      }
    ]);

    await Food.insertMany([
      { name: "Regular Salted Popcorn", category: "Popcorn", price: 290 },
      { name: "Regular Cheese Popcorn", category: "Popcorn", price: 340 },
      { name: "Spicy Grilled Chicken Burger", category: "Snacks", price: 240 },
      { name: "Medium Pepsi", category: "Beverages", price: 280 },
      { name: "Nachos With Cheese & Salsa", category: "Snacks", price: 250 },
      { name: "Regular Caramel Popcorn", category: "Popcorn", price: 320 }
    ]);

    console.log("Data seeded successfully");
  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedData();
