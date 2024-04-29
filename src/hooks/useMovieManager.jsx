import { useState, useEffect } from 'react';
import OpenAI from "openai";

const useMovieManager = () => {
  const [movies, setMovies] = useState([]);

  const openai = new OpenAI({
    apiKey: '<API-KEY>',
    dangerouslyAllowBrowser: true,
  })

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
      return jsonData;
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
    //return { rating: 'PG-13', year: 2023 };
  };

  const merge = async (content) => {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          "role": "system", "content": "You are a function that ingests information about two different" +
              " movies, \"Movie A\" & \"Movie B\" and returns a third movie \"Movie C\" that is most similar /" +
              " relevant to the two given movies. IMPORTANT: Return just the movie Title and nothing else in" +
              " the format \"Movie C:<Insert Movie Title>\"."
        },
        {"role": "user", "content": content}
      ],
      stream: true,
    });

    let movieTitles = [];

    for await (const chunk of completion) {
      console.log(chunk.choices[0].delta.content);
      movieTitles.push(chunk.choices[0].delta.content);
    }

    return movieTitles;
  };

  return { movies, addMovie, clearMovies, fetchMovieData, merge};
};

export default useMovieManager;

