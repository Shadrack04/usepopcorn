import React from "react";

function Nav({ query, onChange, movies }) {
  return (
    <>
      <nav className="nav-bar">
        <Logo />
        <input
          className="search"
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => onChange(e.target.value)}
        />
        <p className="num-results">
          Found <strong>{movies?.length}</strong> results
        </p>
      </nav>
    </>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

export default Nav;
