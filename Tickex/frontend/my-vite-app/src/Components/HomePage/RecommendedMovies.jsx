import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { MovieCarousel } from "./MovieCarousel";
import styles from "../Styling/RecommendedMovies.module.css";
import { RiArrowRightSLine } from "react-icons/ri";
import { fetchMovies } from "../../Redux/actions/movieActions"; // Adjust the path as needed

export const RecommendedMovies = () => {
  const dispatch = useDispatch();
  const movies_data = useSelector((state) => state.app.movies_data);

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  const filteredRecommendedMovies = movies_data?.filter(
    (movie) => !movie.is_premier
  );

  return (
    <div className={styles.parent}>
      <div className={styles.parent__text}>
        <h1>Recommended Movies</h1>
        <Link to="/ncr/movies" className={styles.link}>
          See all <RiArrowRightSLine />
        </Link>
      </div>
      <MovieCarousel movies={filteredRecommendedMovies} />
    </div>
  );
};
