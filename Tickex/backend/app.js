const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const movieRoutes = require("./routes/movieRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const foodRoutes = require("./routes/foodRoutes");
const historyRoutes = require("./routes/historyRoutes");
const theaterRoutes = require("./routes/theaterRoutes");
const adRoutes = require("./routes/adRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const eventRoutes = require("./routes/eventRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/cinemas", theaterRoutes);
app.use("/api/ads", adRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/events", eventRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
