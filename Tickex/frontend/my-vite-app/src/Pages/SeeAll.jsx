import React from "react";
import styles from "../Components/Styling/SeeAll.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getMovies } from "../Redux/app/actions";
import Card from "../Components/Card_seeAll";

const SeeAll = () => {
  const [language, setLanguage] = React.useState(false);
  const [genre, setGenre] = React.useState(false);
  const [format, setFormat] = React.useState(false);
  const [filterLanguage, setFilterLanguage] = React.useState([]);
  const [filterGenre, setFilterGenre] = React.useState([]);
  const [filterFormat, setFilterFormat] = React.useState([]);
  const [movie, setMovie] = React.useState([]);

  const dispatch = useDispatch();
  const movies_data = useSelector((state) => state.app.movies_data);
  const city = useSelector((state) => state.app.city);

  React.useEffect(() => {
    dispatch(getMovies());
    window.scrollTo(window.scrollX, 0);
  }, [dispatch]);

  React.useEffect(() => {
    setMovie(movies_data);
  }, [movies_data]);

  const handleFilter = (language, genre, format) => {
    const filters = {
      language: filterLanguage[filterLanguage.length - 1],
      genre: filterGenre[filterGenre.length - 1],
      format: filterFormat[filterFormat.length - 1],
    };
    dispatch(getMovies(filters));
  };

  const handleClear = (filterType) => {
    if (filterType === "languages") {
      setFilterLanguage([]);
    } else if (filterType === "genre") {
      setFilterGenre([]);
    } else {
      setFilterFormat([]);
    }
    dispatch(getMovies()); // Clear filters and fetch all movies
  };

  const handleFilterSelection = (type, value) => {
    if (type === "language") {
      setFilterLanguage((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value]
      );
    } else if (type === "genre") {
      setFilterGenre((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value]
      );
    } else {
      setFilterFormat((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value]
      );
    }
    handleFilter();
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftsideNav}>
        <h2 className={styles.header}>Filters</h2>

        {/* Language Filter */}
        <div>
          <div className={styles.header} onClick={() => setLanguage(!language)}>
            <span>Languages</span>
            <button onClick={() => handleClear("languages")}>Clear</button>
          </div>
          {language && (
            <div className={styles.filterOptions}>
              {["Hindi", "English", "Telugu", "Kannada"].map((lang) => (
                <button
                  key={lang}
                  className={filterLanguage.includes(lang) ? styles.active : ""}
                  onClick={() => handleFilterSelection("language", lang)}
                >
                  {lang}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Genre Filter */}
        <div>
          <div className={styles.header} onClick={() => setGenre(!genre)}>
            <span>Genre</span>
            <button onClick={() => handleClear("genre")}>Clear</button>
          </div>
          {genre && (
            <div className={styles.filterOptions}>
              {["Action", "Drama", "Thriller", "Comedy"].map((gen) => (
                <button
                  key={gen}
                  className={filterGenre.includes(gen) ? styles.active : ""}
                  onClick={() => handleFilterSelection("genre", gen)}
                >
                  {gen}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Format Filter */}
        <div>
          <div className={styles.header} onClick={() => setFormat(!format)}>
            <span>Format</span>
            <button onClick={() => handleClear("format")}>Clear</button>
          </div>
          {format && (
            <div className={styles.filterOptions}>
              {["2D", "3D", "IMAX"].map((fmt) => (
                <button
                  key={fmt}
                  className={filterFormat.includes(fmt) ? styles.active : ""}
                  onClick={() => handleFilterSelection("format", fmt)}
                >
                  {fmt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className={styles.header}>Movies in {city}</h2>
        <div className={styles.movieList}>
          {movie.length === 0 ? (
            <div className={styles.noMoviesMessage}>No movies found</div>
          ) : (
            movie.map((item) => <Card key={item.id} {...item} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default SeeAll;
