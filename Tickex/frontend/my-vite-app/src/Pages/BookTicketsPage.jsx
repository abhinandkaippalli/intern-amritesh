import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCinemas } from "../Redux/cinemas/action";
import { CinemasBody } from "../Components/BookTickets/CinemasBody";
import { useParams } from "react-router";
import { Header } from "../Components/BookTickets/Header";
import { getMovieDetails } from "../Redux/data/actions"; // Update to use specific movie details action
import { Filter } from "../Components/BookTickets/Filter";

export const BookTicketsPage = () => {
  const dispatch = useDispatch();
  const { id } = useParams(); // movie ID from URL
  const [filters, setFilters] = useState([]);
  const [bookingDetails, setBookingDetails] = useState({
    movie_name: "",
    date: "",
    day: "",
    time: "",
    cinemas_name: "",
  });

  // Select data from Redux store
  const movieDetails = useSelector((state) => state.data.movieDetails); // Updated selector for specific movie data
  const cinemas = useSelector((state) => state.cinemas.list); // Assuming cinemas list is stored here

  useEffect(() => {
    dispatch(getCinemas()); // Fetch cinema data
    dispatch(getMovieDetails(id)); // Fetch movie details by ID
  }, [dispatch, id]);

  const handleFilters = (item) => {
    setFilters((prevFilters) =>
      prevFilters.includes(item)
        ? prevFilters.filter((filter) => filter !== item)
        : [...prevFilters, item]
    );
  };

  const handleSelectNameTime = (cinemas_name, time) => {
    setBookingDetails((prev) => ({ ...prev, cinemas_name, time }));
  };

  const handleSelectDate = (date, day) => {
    setBookingDetails((prev) => ({ ...prev, date, day }));
  };

  const handleMovieName = () => {
    if (movieDetails) {
      setBookingDetails((prev) => ({
        ...prev,
        movie_name: movieDetails.title,
      }));
    }
  };

  useEffect(() => {
    handleMovieName();
  }, [movieDetails]);

  return (
    <div style={{ backgroundColor: "#F2F2F2", paddingBottom: 20 }}>
      <Header movieTitle={movieDetails?.title || ""} />
      <Filter handleFilters={handleFilters} filters={filters} />
      <CinemasBody
        filters={filters}
        cinemas={cinemas}
        onSelectNameTime={handleSelectNameTime}
        onSelectDate={handleSelectDate}
        bookingDetails={bookingDetails}
      />
    </div>
  );
};
