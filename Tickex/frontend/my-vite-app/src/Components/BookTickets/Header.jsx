import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../Styling/Cinemas.module.css";
import { handleAddMovieName } from "../../Redux/booking_details/actions";

export const Header = () => {
    const movie = useSelector(state => state.data.movies).data;
    const dispatch = useDispatch();

    useEffect(() => {
        if (movie) {
            dispatch(handleAddMovieName(movie.movie_name, movie.movie_grade, movie.banner_image_url));
        }
    }, [movie]);

    return movie ? (
        <div className={styles.header__container}>
            <div className={styles.header_container__info}>
                <h1>{movie.movie_name}</h1>
                <div>{movie.release_date}</div>
                <div>{movie.movie_duration}</div>
            </div>
            <div className={styles.header__container__crew}>
                <h4>Cast & Crew</h4>
            </div>
        </div>
    ) : <div>Loading...</div>;
}
