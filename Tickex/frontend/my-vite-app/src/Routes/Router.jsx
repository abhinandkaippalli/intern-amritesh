import React from "react";
import { Switch, Route } from "react-router-dom";
import MoviePage from "../Pages/moviePage/MoviePage";
import { HomePage } from "../Pages/HomePage";
import SeeAll from "../Pages/SeeAll";
import { BookTicketsPage } from "../Pages/BookTicketsPage";
import { BookingHistory } from "../Components/BookingHistory";
import NotFound from "../Pages/NotFound"; // Custom 404 page component

const Router = () => {
  return (
    <div>
      <Switch>
        {/* Home Page Route */}
        <Route exact path="/" component={HomePage} />

        {/* Movies Route */}
        <Route exact path="/ncr/movies" component={SeeAll} />

        {/* Dynamic Route for Booking Tickets */}
        <Route
          exact
          path="/booktickets/:id"
          render={(props) => (
            <BookTicketsPage movieId={props.match.params.id} />
          )}
        />

        {/* Dynamic Route for Movie Details */}
        <Route
          exact
          path="/movies/:id"
          render={(props) => <MoviePage movieId={props.match.params.id} />}
        />

        {/* Booking History Route */}
        <Route
          exact
          path="/profile/booking-history"
          component={BookingHistory}
        />

        {/* 404 Fallback Route */}
        <Route component={NotFound} />
      </Switch>
    </div>
  );
};

export default Router;
