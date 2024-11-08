import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Button,
  Dialog,
  Toolbar,
  IconButton,
  Typography,
  Slide,
} from "@material-ui/core";
import {
  ChevronLeft as ChevronLeftIcon,
  Clear as ClearIcon,
} from "@material-ui/icons";
import styles from "../Components/Styling/Summary.module.css";
import { useDispatch, useSelector } from "react-redux";
import Food from "../Components/SummaryPage/Food";
import PaymentsPage from "./PaymentsPage";
import { handleAddTotalPrice } from "../Redux/booking_details/actions";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
    background: "#1F2533",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
    color: "white",
  },
}));

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

const SummaryPage = ({ foodModalOpen, handleCloseFoodModal }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [totalFood, setTotalFood] = useState(0);
  const [proceed, setProceed] = useState(false);
  const city = useSelector((state) => state.app.city);
  const foodArray = useSelector((state) => state.food.foodArray);
  const bookingDetails = useSelector((state) => state.booking_details);

  useEffect(() => {
    const total = foodArray.reduce(
      (acc, item) => acc + item.count * item.food_price,
      0
    );
    setTotalFood(total);
  }, [foodArray]);

  const totalAmount = bookingDetails.price + 28 + totalFood;

  const handleProceed = () => {
    dispatch(handleAddTotalPrice(totalAmount));
    setProceed(true);
  };

  return (
    <div>
      <Dialog
        fullScreen
        open={foodModalOpen}
        onClose={handleCloseFoodModal}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleCloseFoodModal}
              aria-label="close"
            >
              <ChevronLeftIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              {bookingDetails.movie_name}
            </Typography>
            <Button color="inherit" onClick={handleCloseFoodModal}>
              <ClearIcon />
            </Button>
          </Toolbar>
        </AppBar>

        <div className={styles.container}>
          <Food />

          <div className={styles.summaryPart}>
            <div>Booking Summary</div>
            <div className={styles.categories}>
              <div style={{ textTransform: "uppercase" }}>
                {bookingDetails.cinemas_name}
              </div>
              <div>Rs {bookingDetails.price}</div>
            </div>
            <span>AUDI 5</span>
            <div className={styles.categories}>
              <div style={{ fontSize: "12px", lineHeight: "25px" }}>
                Internet handling fees
              </div>
              <div>Rs 28.00</div>
            </div>
            <div className={styles.line}></div>
            <div className={styles.categories}>
              <div>Sub total</div>
              <div>Rs {bookingDetails.price + 28}</div>
            </div>

            {foodArray.length > 0 && (
              <div className={styles.categories}>
                <div>Food and beverages</div>
                <div>Rs {totalFood}</div>
              </div>
            )}

            <div className={styles.charity}>
              <div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input type="checkbox" />
                  <img
                    src="https://in.bmscdn.com/webin/common/icons/bookasmile-logo.svg"
                    alt="bookasmile"
                  />
                </div>
                <div>Rs 1</div>
              </div>
              <div className={styles.charityInfo}>
                <div>
                  Re. 1 will be added to your transaction as a donation.
                </div>
                <div>Re.1/1 Ticket</div>
              </div>
            </div>

            <div className={styles.cityInfo}>
              Your current State is <a href="">{city}</a>
            </div>
            <div className={styles.total}>
              <div>Amount Payable</div>
              <div>Rs {totalAmount}</div>
            </div>

            <h3 className={styles.ticketType}>Select Ticket Type</h3>
            <div onClick={handleProceed} className={styles.proceedBtn}>
              <div>Total : Rs {totalAmount}</div>
              <div> Proceed</div>
            </div>

            <div className={styles.cancellationPolicy}>
              You can cancel the tickets 20 min(s) before the show. Refunds will
              be done according to
              <a href="">Cancellation Policy</a>
            </div>
          </div>
        </div>
      </Dialog>
      <PaymentsPage proceed={proceed} />
    </div>
  );
};

export default SummaryPage;
