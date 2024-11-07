import React from "react";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import styles from "../Styling/RecommendedMovies.module.css";

const data = [
    // Static data for entertainment categories (can be replaced with dynamic data if available)
    "https://in.bmscdn.com/discovery-catalog/collections/tr:w-800,h-800:ote-MTM1KyBFdmVudHM...",
    // ... other image URLs
];

export const Entertainment = () => {
    const responsive = {
        superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 6 },
        desktop: { breakpoint: { max: 3000, min: 1024 }, items: 5 },
        tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
        mobile: { breakpoint: { max: 464, min: 0 }, items: 1 }
    };

    return (
        <div className={styles.parent} style={{ margin: 10 }}>
            <div className={styles.parent__text}><h1>The Best of Entertainment</h1></div>
            <div className={styles.entertainment_container}>
                <Carousel responsive={responsive} removeArrowOnDeviceType={["tablet", "mobile"]}>
                    {data.map((image, index) => (
                        <div key={index}>
                            <img src={image} alt="Entertainment" />
                        </div>
                    ))}
                </Carousel>
            </div>
        </div>
    );
};
