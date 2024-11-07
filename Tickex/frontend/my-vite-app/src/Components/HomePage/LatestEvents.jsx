import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CommonCarousel } from "./CommonCarousel";
import styles from "../Styling/RecommendedMovies.module.css";
import { fetchLatestEvents } from "../../Redux/actions/eventActions"; // Adjust the path as needed

export const LatestEvents = () => {
  const dispatch = useDispatch();
  const latest_events = useSelector((state) => state.events.latestEvents);

  useEffect(() => {
    dispatch(fetchLatestEvents());
  }, [dispatch]);

  return (
    <div className={styles.parent}>
      <div className={styles.parent__text}>
        <h1>Latest Events</h1>
      </div>
      <CommonCarousel events={latest_events} />
    </div>
  );
};
