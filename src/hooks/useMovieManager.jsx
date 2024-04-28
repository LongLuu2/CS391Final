import { useState, useEffect } from 'react';

const useMovieManager = () => {
  const [movies, setMovies] = useState([]);

  // Load movies from local storage when component mounts
  useEffect(() => {
    const storedMovies = JSON.parse(localStorage.getItem('movies'));
    if (storedMovies) {
      setMovies(storedMovies);
    }
  }, []);

  const addMovie = async (name, imageUrl) => {
    const movieData = await fetchMovieData(name);

    const movie = {
      name: name,
      imageUrl: imageUrl,
      ...movieData
    };

    const updatedMovies = [...movies, movie];

    localStorage.setItem('movies', JSON.stringify(updatedMovies));

    setMovies(updatedMovies);
  };

  const fetchMovieData = async (name) => {
    return { rating: 'PG-13', year: 2023 };
  };

  return { movies, addMovie };
};

export default useMovieManager;
