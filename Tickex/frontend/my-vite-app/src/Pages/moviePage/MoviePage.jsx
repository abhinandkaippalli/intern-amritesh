import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovieById, updateMovieRating } from "../../Redux/data/actions"; // Updated import
import { useHistory, useParams } from "react-router-dom";
import "../../Components/MoviePage/moviePage.css";
import Carousel from "react-elastic-carousel";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import { RecommendedMovies } from "../../Components/HomePage/RecommendedMovies";
import Login from "../LoginPage";
import { setAuth } from "../../Redux/app/actions"; // Updated import

function valuetext(value) {
  return `${value}`;
}

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    height: "400px",
    width: "300px",
  },
  root: {
    width: 250,
    margin: 20,
    textAlign: "center",
  },
}));

const MoviePage = () => {
  const [rValue, setRvalue] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  const { id } = useParams();
  const data = useSelector((state) => state.data.selectedMovie); // Updated state
  const dispatch = useDispatch();
  const history = useHistory();
  const isAuth = useSelector((state) => state.app.isAuth);

  React.useEffect(() => {
    dispatch(fetchMovieById(id)); // Fetch movie by ID from backend
    window.scrollTo(window.scrollX, 0);
  }, [id]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleChange = (e, v) => setRvalue(v);

  const handleRating = () => {
    dispatch(updateMovieRating(id, rValue)); // Update rating on backend
    setOpen(false);
  };

  const handleBookTickets = () => {
    if (isAuth) {
      history.push(`/booktickets/${id}`);
    } else {
      alert("Please log in to book tickets.");
      setOpen(true);
    }
  };

  return (
    <div>
      {data && (
        <>
          <div
            className="container"
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(34, 34, 34, 0.8) 25%, rgba(34, 34, 34, 0.04) 97%), url(${data.cover_image_url})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          >
            <Login isOpen={open} onClose={() => setOpen(false)} />
            <div className="container__card">
              <img src={data.banner_image_url} alt="title" />
            </div>
            <div className="container__movieDetail">
              <h1>{data.title}</h1>
              <div className="container__movieDetail_rating">
                <img
                  src="https://www.leadingwithhonor.com/wp-content/uploads/2021/02/redheart.png"
                  alt="Rating"
                  style={{ width: 25 }}
                />
                <h1>{data.rating.percentage}%</h1>
                <p style={{ marginBottom: 0 }}>{data.rating.count} Ratings</p>
              </div>
              <div className="container__movieDetail_ratingButton">
                <div>
                  <h4 style={{ color: "white" }}>Add your rating and review</h4>
                  <p>Your ratings matter</p>
                </div>
                <div>
                  <button style={{ cursor: "pointer" }} onClick={handleOpen}>
                    Rate Now
                  </button>
                </div>
              </div>
              <div className="container__movieDetail_language">
                <div>
                  <p>{data.format}</p>
                </div>
                <div>
                  <p>{data.languages.join(", ")}</p>
                </div>
              </div>
              <div style={{ color: "white", fontSize: 18 }}>
                <h5>{`${data.duration} - ${data.genres.join(", ")} - ${
                  data.release_date
                }`}</h5>
              </div>
              <div className="BookButton">
                <button onClick={handleBookTickets}>Book Tickets</button>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="middleContainer">
            <div>
              <h1>About the movie</h1>
              <p>{data.about}</p>
            </div>
            <hr />
            <div>
              <h1>Cast</h1>
              <Carousel itemsToShow={8} pagination={false}>
                {data.cast.map((actor) => (
                  <div key={actor.id}>
                    <img
                      className="carousel_image"
                      src={actor.image}
                      alt={actor.name}
                    />
                    <h4>{actor.name}</h4>
                    <p>{actor.role}</p>
                  </div>
                ))}
              </Carousel>
            </div>
            <hr />
          </div>
        </>
      )}

      {/* Rating Modal */}
      <Modal
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <div style={{ textAlign: "center" }}>
              <h5>Rate the movie</h5>
              <p>{data?.title}</p>
              <button
                onClick={handleClose}
                style={{ position: "absolute", right: 10, top: 0 }}
              >
                X
              </button>
            </div>
            <hr />
            <div className={classes.root}>
              <Typography id="discrete-slider" gutterBottom>
                How would you rate the movie?
              </Typography>
              <Slider
                onChange={handleChange}
                value={rValue}
                getAriaValueText={valuetext}
                step={10}
                marks
                min={0}
                max={100}
                color="secondary"
              />
              <div
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  backgroundColor: "#f84464",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "20px auto",
                }}
              >
                <h1>{rValue}%</h1>
              </div>
            </div>
            <button
              onClick={handleRating}
              style={{
                width: "80%",
                margin: "20px auto",
                height: 50,
                fontSize: 18,
                color: "white",
                backgroundColor: "#f84464",
                borderRadius: 10,
              }}
            >
              Submit Rating
            </button>
          </div>
        </Fade>
      </Modal>

      {/* Recommended Movies */}
      <RecommendedMovies />
    </div>
  );
};

export default MoviePage;
