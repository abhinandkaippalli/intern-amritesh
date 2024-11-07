import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Ticket } from "./Ticket";
import styles from "./Styling/Ticket.module.css";
import axios from "axios";

export const BookingHistory = () => {
  const [bookingData, setBookingData] = useState([]);
  const [previousBooking, setPreviousBooking] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await axios.get("/api/history", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const sortedData = response.data.sort((a, b) => {
          if (a.date === b.date) {
            const aShowTime = parseInt(a.showtime.split(":")[0], 10);
            const bShowTime = parseInt(b.showtime.split(":")[0], 10);
            return aShowTime - bShowTime;
          }
          return new Date(a.date) - new Date(b.date);
        });

        const today = new Date().toISOString().slice(0, 10); // today's date 
        const upcoming = sortedData.filter((item) => item.date >= today);
        const previous = sortedData.filter((item) => item.date < today);

        setBookingData(upcoming);
        setPreviousBooking(previous);
      } catch (error) {
        console.error("Error fetching booking history:", error);
      }
    };

    fetchBookingData();
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <div>
        <h1>BOOKING DETAILS</h1>
        <div className={styles.ticket__container}>
          {bookingData.map((item) => (
            <Ticket key={item._id} {...item} />
          ))}
        </div>
      </div>
      {previousBooking.length > 0 && (
        <div>
          <h1>Previous Bookings</h1>
          <div className={styles.ticket__container}>
            {previousBooking.map((item) => (
              <Ticket key={item._id} {...item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
