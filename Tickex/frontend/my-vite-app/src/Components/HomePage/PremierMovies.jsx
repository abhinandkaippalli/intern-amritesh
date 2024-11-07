import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MovieCarousel } from "./MovieCarousel";
import styles from "../Styling/RecommendedMovies.module.css";
import { fetchMovies } from "../../Redux/actions/movieActions"; // Adjust the path as needed

export const PremierMovies = () => {
  const dispatch = useDispatch();
  const movies_data = useSelector((state) => state.app.movies_data);

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  const filteredPremierMovies = movies_data?.filter(
    (movie) => movie.is_premier
  );

  const premierMovieContainerStyle = `${styles.parent} ${styles.premier__container}`;

  return (
    <div className={premierMovieContainerStyle}>
      <div className={styles.parent__text}>
        <h1 style={{ color: "white" }}>Premiers</h1>
      </div>
      <span style={{ color: "white", marginLeft: "11%" }}>
        Brand new releases every Friday
      </span>
      <MovieCarousel movies={filteredPremierMovies} />
    </div>
  );
};
