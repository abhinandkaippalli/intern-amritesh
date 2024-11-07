import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CommonCarousel } from "./CommonCarousel";
import styles from "../Styling/RecommendedMovies.module.css";
import { fetchLaughterEvents } from "../../Redux/actions/eventActions"; // Adjust the path as needed

export const LaughterEvents = () => {
  const dispatch = useDispatch();
  const laughter_events = useSelector((state) => state.events.laughterEvents);

  useEffect(() => {
    dispatch(fetchLaughterEvents());
  }, [dispatch]);

  return (
    <div className={styles.parent}>
      <div className={styles.parent__text}>
        <h1>Laughter Events</h1>
      </div>
      <CommonCarousel events={laughter_events} />
    </div>
  );
};
