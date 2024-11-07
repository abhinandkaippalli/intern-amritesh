import React, { useEffect, useState } from "react";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import axios from 'axios';

export const AddCarousel = () => {
    const [dataList, setDataList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/ads');
                setDataList(response.data);
            } catch (error) {
                console.error("Error fetching ad banners:", error);
            }
        };
        fetchData();
    }, []);

    const responsive = {
        superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 2 },
        desktop: { breakpoint: { max: 3000, min: 1024 }, items: 2 },
        tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
        mobile: { breakpoint: { max: 464, min: 0 }, items: 1 }
    };

    return (
        <div style={{ padding: "5px 0px" }}>
            <Carousel responsive={responsive} removeArrowOnDeviceType={["mobile"]} autoPlay infinite>
                {dataList.map((banner, index) => (
                    <div style={{ padding: "0px 15px" }} key={index}>
                        <img style={{ width: "100%", cursor: "pointer" }} src={banner.url} alt="Advertisement banner" />
                    </div>
                ))}
            </Carousel>
        </div>
    );
};
