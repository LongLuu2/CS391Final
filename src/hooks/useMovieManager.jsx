import {useEffect, useState, useContext} from 'react';
import {useMovieContext} from "../context/MoviesContext.jsx";
import OpenAI from "openai";

const useMovieManager = () => {
  const { movies, setMovies } = useMovieContext();

  const openai = new OpenAI({
    apiKey: 'sk-proj-UNtXj4Vrm01cWamMXcFIT3BlbkFJKn4uctLw05cTouZvgjVN',
    dangerouslyAllowBrowser: true,
  })

  const API_KEY = '7a644baa';

  useEffect(() => {
    const storedMovies = JSON.parse(localStorage.getItem('movies'));
    if (storedMovies) {
      setMovies(storedMovies);
    }
  }, []);

  const addMovie = async (movieId) => {
    const movieData = await fetchMovieDataById(movieId);

    const movie = {
      id: movieId,
      name: movieData.Title,
    };

    const updatedMovies = [...movies, movie];

    localStorage.setItem('movies', JSON.stringify(updatedMovies));

    setMovies(updatedMovies);
  };

  const clearMovies = async () => {
    localStorage.removeItem('movies');
    setMovies([]);
  };

  const fetchMovieDataById = async (movieId) => {
    try {
      const response = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&i=${movieId}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  };

  const fetchMovieId = async (name) => {
    console.log(name);
    try {
      const response = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&t=${name}`);
      const body = await response.json();
      return body.imdbID;
    } catch (error) {
      return null;
    }
  };

  const merge = async (movieId1, movieId2) => {
    const [movieData1, movieData2] = await Promise.all([
      fetchMovieDataById(movieId1),
      fetchMovieDataById(movieId2)
    ]);

    const content = `Movie A: ${JSON.stringify(movieData1)}. Movie B: ${JSON.stringify(movieData2)}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          "role": "system", "content": "You are a function that ingests information about two different" +
              " movies, \"Movie A\" & \"Movie B\" and returns a third movie that is most similar /" +
              " relevant to the two given movies. IMPORTANT: Return just the movie Title and nothing else in" +
              " the format \"Movie Title\"."
        },
        {"role": "user", "content": content},
      ],
      stream: true,
    });

    let movieTitles = [];

    for await (const chunk of completion) {
      movieTitles.push(chunk.choices[0].delta.content);
    }

    return await fetchMovieId(movieTitles.join(''));
  };

  return { movies, addMovie, clearMovies, fetchMovieDataById, merge, fetchMovieId};
};

export default useMovieManager;

