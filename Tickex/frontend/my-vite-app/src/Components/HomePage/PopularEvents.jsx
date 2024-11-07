import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CommonCarousel } from "./CommonCarousel";
import styles from "../Styling/RecommendedMovies.module.css";
import { fetchPopularEvents } from "../../Redux/actions/eventActions"; // Adjust path as needed

export const PopularEvents = () => {
  const dispatch = useDispatch();
  const popular_events = useSelector((state) => state.events.popularEvents);

  useEffect(() => {
    dispatch(fetchPopularEvents());
  }, [dispatch]);

  return (
    <div className={styles.parent}>
      <div className={styles.parent__text}>
        <h1>Popular Events</h1>
      </div>
      <CommonCarousel events={popular_events} />
    </div>
  );
};
