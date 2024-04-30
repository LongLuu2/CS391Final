import {useEffect, useState} from 'react';
import {useMovieContext} from "../context/MoviesContext.jsx";
import OpenAI from "openai";

{/*
* useMovieManager handles:
*   Storing, Removing and Fetching Movies to & from localStorage
*   Fetching movieIds given movieTitle
*   Fetching movieTitle given movieId
*   Merging of two movies by openAI chat completion
*/}

const useMovieManager = () => {
  const { movies, setMovies } = useMovieContext();
  const [numAddMovies, setNumAddMovies] = useState(4);


  // openAI & omdbi API Keys
  const openai = new OpenAI({
    apiKey: "sk-proj-nsPsrIi9zl4tS6RqXxKyT3BlbkFJugUt3OZLFikAFlwRFHm3",
    dangerouslyAllowBrowser: true,
  })
  const API_KEY = '7a644baa';

  useEffect(() => {
    const storedMovies = JSON.parse(localStorage.getItem('movies'));
    const moviesLeft = JSON.parse(localStorage.getItem('left'));

    if (storedMovies) {
      setMovies(storedMovies);
    }

    if (moviesLeft) {
      setNumAddMovies(parseInt(moviesLeft));
    }
  }, [setMovies]);

  {/*
  * addMovie
  *   Passed in id of movie to be added to local storage by way of "movieId"
  *   const movie structure specifies a given movies "id" & "title"
  */}
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

  {/*
  * decrementMovie
  *   Handles number of Movies currently stored in local storage
  */}
  const decrementAddMovie = async () => {
    const updatedNumAddMovies = numAddMovies - 1;
    localStorage.setItem('left', updatedNumAddMovies.toString());
    setNumAddMovies(updatedNumAddMovies);
  };

  {/*
  * clearMovies
  *   Handles removing all movies from local storage
  */}
  const clearMovies = async () => {
    localStorage.removeItem('movies');
    localStorage.removeItem('left');
    setMovies([]);
    setNumAddMovies(4);
  };

  {/*
  * fetchMovieDataById
  *   Passed in id of a movie and calls omdbapi to retrieve movie Data in form of json
  *   (https://www.omdbapi.com/)
  */}
  const fetchMovieDataById = async (movieId) => {
    try {
      const response = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&i=${movieId}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  };

  {/*
  * fetchMovieId
  *   Passed in name of a movie and calls omdbapi to retrieve movie ID
  *   If movie doesn't exist, return null
  *   (https://www.omdbapi.com/)
  */}
  const fetchMovieId = async (name) => {
    console.log(name);
    try {
      const response = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&t=${name}`);
      const body = await response.json();
      if (body.Response === "False") {
        return null;
      }
      return body.imdbID;
    } catch (error) {
      return null;
    }
  };

  {/*
  * merge
  *   Passed in ids of two movies & returns a third movie of similarity
  *   openAI gpt-3.5-turbo ingests the two movies Data & returns a movie it thinks is most similar
  *   Given 3 attempts to provide a valid movie Title that omdbi accepts; if fails, returns the first movie
  *   (https://platform.openai.com/docs/api-reference/introduction)
  */}
  const merge = async (movieId1, movieId2) => {
    const [movieData1, movieData2] = await Promise.all([
      fetchMovieDataById(movieId1),
      fetchMovieDataById(movieId2)
    ]);

    const content = `Movie A: ${JSON.stringify(movieData1)}. Movie B: ${JSON.stringify(movieData2)}`;

    let attempts = 0;

    while (attempts < 3) {
      let movieTitles = [];

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

      for await (const chunk of completion) {
        movieTitles.push(chunk.choices[0].delta.content);
      }

      let movieC = await(fetchMovieId(movieTitles.join('')));

      if (movieC === null) {
        console.log(`WAHHHH ${movieTitles}`);
        attempts++;
      } else {
        return movieC;
      }
    }

    return movieId1;
  };

  return { movies, numAddMovies, addMovie, clearMovies, fetchMovieDataById, merge, fetchMovieId, decrementAddMovie };

};

export default useMovieManager;

