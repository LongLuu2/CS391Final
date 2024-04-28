import { useState, useEffect } from 'react';

const useMovieManager = () => {
  const [movies, setMovies] = useState([]);
  const [movieData, setMovieData] = useState(null);

  // Load movies from local storage when component mounts
  useEffect(() => {
    const storedMovies = JSON.parse(localStorage.getItem('movies'));
    if (storedMovies) {
      setMovies(storedMovies);
    }
  }, []);

  const addMovie = async (movieId) => {
    await console.log(movieId);
    const movieData = await fetchMovieData(movieId);

    const movie = {
      id: movieId,
      //imageUrl: imageUrl,
      ...movieData
    };

    const updatedMovies = [...movies, movie];

    localStorage.setItem('movies', JSON.stringify(updatedMovies));

    setMovies(updatedMovies);
  };

  const clearMovies = async () => {
    localStorage.removeItem('movies');
    setMovies([]);
  };

  const fetchMovieData = async (movieId) => {
    const API_KEY = '7a644baa';
    try {
      const response = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&i=${movieId}`);
      const jsonData = await response.json();
      setMovieData(jsonData);
      console.log(jsonData);
      return jsonData.toString();
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
    //return { rating: 'PG-13', year: 2023 };
  };

  return { movies, addMovie, clearMovies, fetchMovieData};
};

export default useMovieManager;

