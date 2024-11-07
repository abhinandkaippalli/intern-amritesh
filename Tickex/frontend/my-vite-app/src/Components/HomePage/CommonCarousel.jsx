import React, { useEffect, useState } from "react";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import axios from 'axios';
import { CommonCard } from "./CommomCard";

export const CommonCarousel = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('/api/movies');
                setEvents(response.data);
            } catch (error) {
                console.error("Error fetching movies:", error);
            }
        };
        fetchEvents();
    }, []);

    const responsive = {
        superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 6 },
        desktop: { breakpoint: { max: 3000, min: 1024 }, items: 5 },
        tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
        mobile: { breakpoint: { max: 464, min: 0 }, items: 1 }
    };

    return (
        <div style={{ width: "80%", margin: "auto" }}>
            <Carousel responsive={responsive} removeArrowOnDeviceType={["mobile"]}>
                {events.map(event => <CommonCard {...event} key={event._id} />)}
            </Carousel>
        </div>
    );
};
