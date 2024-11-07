import React from "react";
import { useHistory } from "react-router-dom";
import styles from "./Styling/Card.module.css";

const Card = ({ banner_image_url, movie_name, movie_genre, _id }) => {
  const history = useHistory();

  const handleClick = () => {
    history.push(`/movies/${_id}`); // Navigate to the movie detail page using the movie ID
  };

  return (
    <div onClick={handleClick} className={styles.card}>
      <img
        src={banner_image_url}
        alt={movie_name}
        className={styles.cardImage}
      />
      <div className={styles.title}>{movie_name}</div>
      <div className={styles.genre}>
        {movie_genre?.map((genre, index) => (
          <span key={index}>
            {genre}
            {index < movie_genre.length - 1 ? " / " : ""}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Card;
