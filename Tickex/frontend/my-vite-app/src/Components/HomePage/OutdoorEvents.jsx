import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CommonCarousel } from "./CommonCarousel";
import styles from "../Styling/RecommendedMovies.module.css";
import { fetchOutdoorEvents } from "../../Redux/actions/eventActions"; // Ensure correct path

export const OutdoorEvents = () => {
  const dispatch = useDispatch();
  const outdoor_events = useSelector((state) => state.events.outdoorEvents);

  useEffect(() => {
    dispatch(fetchOutdoorEvents());
  }, [dispatch]);

  return (
    <div className={styles.parent}>
      <div className={styles.parent__text}>
        <h1>Outdoor Events</h1>
      </div>
      <CommonCarousel events={outdoor_events} />
    </div>
  );
};
