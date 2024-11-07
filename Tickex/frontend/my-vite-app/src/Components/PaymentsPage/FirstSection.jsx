import React, { useState } from "react";
import axios from "axios";
import styles from "../Styling/PaymentsPage.module.css";

const FirstSection = ({ handlePayment }) => {
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [cardDetails, setCardDetails] = useState({
        cardNumber: "4568 6749 7864 6543",
        nameOnCard: "Veer Bahadur Shastri",
        expiryMonth: "06",
        expiryYear: "23",
        cvv: "933"
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name in cardDetails) {
            setCardDetails({ ...cardDetails, [name]: value });
        } else if (name === "email") {
            setEmail(value);
        } else if (name === "mobile") {
            setMobile(value);
        }
    };

    const processPayment = async () => {
        try {
            const paymentData = {
                email,
                mobile,
                cardDetails,
                amount: 100 // Assuming a placeholder amount for the example
            };
            await axios.post("/api/payment/process", paymentData);
            handlePayment(); // Call parent handler for additional actions if needed
        } catch (error) {
            console.error("Payment failed:", error);
        }
    };

    return (
        <div>
            <div className={styles.contact}>
                <div><span>Share your contact details</span></div>
                <div className={styles.contact_details}>
                    <input
                        type="email"
                        placeholder="Email Address"
                        name="email"
                        value={email}
                        onChange={handleInputChange}
                    />
                    <input
                        type="text"
                        placeholder="Mobile number"
                        name="mobile"
                        value={mobile}
                        onChange={handleInputChange}
                    />
                    <button onClick={processPayment} style={{marginBottom: '-5px', color: 'white'}}>Continue</button>
                </div>
            </div>

            <div className={styles.contact}>
                <div>More Payment options</div>
                <div className={styles.StoredCard}>
                    <div className={styles.sidebar}>
                        <div>Quick pay</div>
                        <div style={{ background: 'white' }}>Credit / Debit card</div>
                        <div>Net Banking</div>
                        <div>Mobile wallet</div>
                        <div>Gift Voucher</div>
                        <div>UPI</div>
                        <div>Redeem Points</div>
                        <div>Credit Voucher</div>
                    </div>
                    <div className={styles.cardDetails}>
                        <span>Enter your card details</span>
                        <div className={styles.sampleCard}>
                            <div style={{ fontSize: '13px', color: 'gray' }}>Card Number</div>
                            <input
                                type="text"
                                placeholder="Enter Your Card Number"
                                name="cardNumber"
                                value={cardDetails.cardNumber}
                                onChange={handleInputChange}
                            />
                            <input
                                type="text"
                                placeholder="Name on the card"
                                name="nameOnCard"
                                value={cardDetails.nameOnCard}
                                onChange={handleInputChange}
                            />
                            <div className={styles.otherDetails}>
                                <div>
                                    <div style={{ fontSize: '13px', color: 'gray' }}>Expiry</div>
                                    <div style={{ display: 'flex' }}>
                                        <input
                                            type="text"
                                            placeholder="MM"
                                            name="expiryMonth"
                                            value={cardDetails.expiryMonth}
                                            onChange={handleInputChange}
                                        />
                                        <input
                                            type="text"
                                            placeholder="YY"
                                            name="expiryYear"
                                            value={cardDetails.expiryYear}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '13px', color: 'gray' }}>CVV</div>
                                    <input
                                        type="text"
                                        placeholder="CVV"
                                        name="cvv"
                                        style={{ width: "50px" }}
                                        value={cardDetails.cvv}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={styles.payment}>
                            <button onClick={processPayment}>Make Payment</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FirstSection;
