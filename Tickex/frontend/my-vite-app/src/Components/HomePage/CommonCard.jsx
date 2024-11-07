import React from 'react';
import styles from '../Styling/Card.module.css';

export const CommonCard = ({ banner_image, name, genres }) => {
    return (
        <div className={styles.card}>
            <img src={banner_image} alt={name} />
            <div className={styles.title}>{name}</div>
            <div className={styles.genre}>{genres.join(", ")}</div>
        </div>
    );
};
