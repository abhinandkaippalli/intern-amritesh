import React from "react";
import { useSelector } from "react-redux";
import styles from "../Styling/PaymentsPage.module.css";
import axios from "axios";

const SecondSection = () => {
    const city = useSelector(state => state.app.city);
    const bookingDetails = useSelector(state => state.booking_details);

    const handleDonationChange = async (e) => {
        try {
            const donation = e.target.checked ? 1 : 0;
            await axios.post("/api/booking/add-donation", { donation });
        } catch (error) {
            console.error("Failed to update donation:", error);
        }
    };

    return (
        <div>
            <div className={styles.summeryPart}>
                <div>Booking Summary</div>
                <div className={styles.categories}>
                    <div style={{ textTransform: 'uppercase' }}>{bookingDetails.cinemas_name}</div>
                    <div>{bookingDetails.silver.length + bookingDetails.platinium.length} Ticket(s)</div>
                </div>
                <span>AUDI 5</span>
                <div className={styles.line}></div>
                <div className={styles.categories}>
                    <div>Sub total</div>
                    <div>Rs. {bookingDetails.total_price}</div>
                </div>

                <div className={styles.charity}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <input type="checkbox" onChange={handleDonationChange} />
                            <img src="https://in.bmscdn.com/webin/common/icons/bookasmile-logo.svg" alt="BookASmile" />
                        </div>
                        <div>Rs 1</div>
                    </div>
                    <div style={{ fontSize: '12px', padding: "10px 20px" }}>
                        <div>Rs. 1 will be added to your transaction as a donation.</div>
                        <div>Re.1/1 Ticket</div>
                    </div>
                </div>

                <div style={{ fontSize: '12px', margin: '0 30px', fontWeight: '600' }}>Your current State is <a href="#">{city}</a></div>
                <div className={styles.total}>
                    <div>Amount Payable</div>
                    <div>Rs. {bookingDetails.total_price}</div>
                </div>

                <div className={styles.cancellation_policy}>
                    You can cancel the tickets 20 min(s) before the show. Refunds will be done according to <a href="#">Cancellation Policy</a>
                </div>
            </div>
        </div>
    );
};

export default SecondSection;
