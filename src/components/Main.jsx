import React, { useEffect } from "react";
import { useState } from "react";
import StarRating from "./StarRating";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const API_KEY = "f17e7175";

function Main({ movies }) {
  const [selectedMovie, setSelectedMovie] = useState({});
  const [selectedId, setSelectedId] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [watched, setWatched] = useState([]);

  const avgImdbRating = average(watched?.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched?.map((movie) => movie.userRating));
  const avgRuntime = average(
    watched?.map((movie) => movie.Runtime.split(" ")[0])
  );

  function handleSelectMovie(id) {
    setSelectedId((curId) => (curId === id ? null : id));
    setUserRating(0);
  }
  function handleBackBtn() {
    setSelectedId(null);
  }

  function handleAddToWatched(movie) {
    const watched = { ...movie, userRating: userRating };
    console.log(watched);
    setWatched((watchedMovies) => [...watchedMovies, watched]);
    setSelectedId(null);
  }

  useEffect(
    function () {
      async function fetchMovieDetails() {
        try {
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${API_KEY}&i=${selectedId}`
          );
          if (!res.ok) throw new Error("could'nt fetch movie details");
          const data = await res.json();
          setSelectedMovie(data);
        } catch (error) {
          console.log(error.message);
        }
      }
      fetchMovieDetails();
    },
    [selectedId]
  );

  return (
    <main className="main">
      <Box>
        <MovieList movies={movies} onSelect={handleSelectMovie} />
      </Box>

      <Box>
        {selectedId ? (
          <MovieDetails
            selectedMovie={selectedMovie}
            handleBackBtn={handleBackBtn}
            setUserRating={setUserRating}
            userRating={userRating}
            onAddToWatched={handleAddToWatched}
            watched={watched}
          />
        ) : (
          <>
            <WatchedSummary
              watched={watched}
              avgImdbRating={avgImdbRating}
              avgRuntime={avgRuntime}
              avgUserRating={avgUserRating}
            />
            <WatchedList watched={watched} />
          </>
        )}
      </Box>
    </main>
  );
}

function Box({ children }) {
  const [isOpen1, setIsOpen1] = useState(true);
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen1((open) => !open)}
      >
        {isOpen1 ? "–" : "+"}
      </button>
      {isOpen1 && children}
    </div>
  );
}

function MovieList({ movies, onSelect }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <li
          onClick={() => onSelect(movie.imdbID)}
          key={movie.imdbID}
          role="button"
        >
          <img src={movie.Poster} alt={`${movie.Title} poster`} />
          <h3>{movie.Title}</h3>
          <div>
            <p>
              <span>🗓</span>
              <span>{movie.Year}</span>
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function WatchedSummary({ watched, avgImdbRating, avgRuntime, avgUserRating }) {
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(2)} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedList({ watched }) {
  console.log(watched);
  return (
    <ul className="list">
      {watched.map((movie) => (
        <li key={movie.imdbID}>
          <img src={movie.Poster} alt={`${movie.Title} poster`} />
          <h3>{movie.Title}</h3>
          <div>
            <p>
              <span>⭐️</span>
              <span>{movie.imdbRating}</span>
            </p>
            <p>
              <span>🌟</span>
              <span>{movie.userRating}</span>
            </p>
            <p>
              <span>⏳</span>
              <span>{movie.Runtime} min</span>
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function MovieDetails({
  selectedMovie,
  handleBackBtn,
  setUserRating,
  userRating,
  onAddToWatched,
  watched,
}) {
  // const [movie, setMovie] = useState({});
  // const [isLoading, setIsLoading] = useState(false);
  const alreadyWatched = watched.find(
    (movie) => movie.imdbID === selectedMovie.imdbID
  );

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = selectedMovie;

  return (
    <div className="details">
      <header>
        <button onClick={handleBackBtn} className="btn-back">
          ⬅
        </button>
        <img src={poster} alt={`Poster of ${title} movie`} />
        <div className="details-overview">
          <h2>{title}</h2>
          <p>
            {released} &bull; {runtime}
          </p>
          <p>{genre}</p>
          <p>
            <span>⭐️</span>
            {imdbRating} IMDb rating
          </p>
        </div>
      </header>

      {/* <p>{avgRating}</p> */}

      <section>
        <div className="rating">
          {selectedMovie.imdbID === alreadyWatched?.imdbID ? (
            <p>
              You rated this movie {alreadyWatched?.userRating}
              <span>⭐️</span>
            </p>
          ) : (
            <>
              <StarRating
                maxRating={10}
                size={24}
                onSetRating={setUserRating}
              />
              {userRating > 0 && (
                <button
                  onClick={() => onAddToWatched(selectedMovie)}
                  className="btn-add"
                >
                  + Add to list
                </button>
              )}
            </>
          )}

          {/* <p>
              You rated with movie {watchedUserRating} <span>⭐️</span>
            </p> */}
        </div>
        <p>
          <em>{plot}</em>
        </p>
        <p>Starring {actors}</p>
        <p>Directed by {director}</p>
      </section>
    </div>
  );
}

export default Main;
