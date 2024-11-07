import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BsHeartFill, BsCircleFill } from "react-icons/bs";
import { handleSelectNameTime } from "../../Redux/booking_details/actions";
import styles from "../Styling/Cinemas.module.css";

export const CinemasBody = ({ filters }) => {
    const cinemas_data = useSelector(state => state.cinemas.cinemas_data);
    const date = useSelector(state => state.booking_details.date);
    const dispatch = useDispatch();
    let filteredData = cinemas_data;

    const handleFilter = () => {
        if (filters.length) {
            filteredData = cinemas_data?.filter(item => filters.includes(item.sub_region));
        }
    }

    handleFilter();

    const handleClick = (name, time) => {
        dispatch(handleSelectNameTime(name, time));
    }

    return (
        <div className={styles.container}>
            {filteredData.map(cinema => (
                <div key={cinema._id} className={styles.container__card}>
                    <div className={styles.container__card__title}>
                        <BsHeartFill className={styles.container__card__title__icon} />
                        <h4>{cinema.name}</h4>
                    </div>
                    <div className={styles.container__card__info}>
                        <div className={styles.container__card__info__times__container}>
                            {cinema.timings.map((time, index) => (
                                <div
                                    onClick={() => handleClick(cinema.name, time.time)}
                                    className={styles.button}
                                    key={index}
                                >
                                    {time.time}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
