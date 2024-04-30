import Draggable from 'react-draggable';
import styled from "styled-components"
import { v4 as uuidv4 } from 'uuid';
import MovieButton from "./MovieButton.jsx";
import AddMovieButton from "./AddMovieButton.jsx";
import SearchBar from './SearchBar.jsx';
import useMovieManager from "../hooks/useMovieManager.jsx";
import {useState, useRef, useEffect } from "react";

/*
   Draggable Screen manages a sidebar interface containing draggable buttons for movies.
   It deals with the logic for buttons overlapping through buttons references. The component
   also has a search function that to display relevant buttons.
*/

const SideBar = styled.div`
    height: 100%;
    width: 25%;
    min-width: 350px;
    overflow-x: hidden;
    overflow-y: auto;
    border-left: 1px solid #9f9f9f;
    @media screen and (max-width: 900px) {
        height: 25%;
        min-height: 200px;
        width: 100%;
        overflow-x: auto;
        overflow-y: hidden;
        border-top: 1px solid #9f9f9f;
    }
`;

const CraftedButtons = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 8px;
  
  @media screen and (max-width: 900px) {
    height: 100%;
    flex-direction: column;
  }
  
`
const CraftedButton = styled.div`
  margin-right: 4px;
  margin-bottom: 3px;
`;

const MovieButtonWrapper = styled.div`
  position: absolute;
  z-index: 1;
`;

export default function DraggableScreen() {
    const { movies, addMovie, merge, fetchMovieId, numAddMovies, decrementAddMovie} = useMovieManager();
    // Hold the buttons and their references to use their positions later on.
    const [buttons, setButtons] = useState({});
    const [searchTerm, setSearchTerm] = useState("");

    const buttonRefs = useRef({});

    const addDraggableButton = ({ clientX, clientY }, movieId) => {
        // Generate unique key for each button
        const key = uuidv4();

        //Hard-coded centering around a point, because Draggable overwrites transform.
        //When I wrapped it in a div, it would cover the other buttons without dragging.
        if (typeof movieId === 'string') {
            const newButton = {
                key: key,
                movieId: movieId,
                button: (
                    <Draggable
                        key={key}
                        onStop={(e, data) => handleStop(e, data, key, movieId)}
                    >
                        <MovieButtonWrapper
                            style={{
                                left: clientX - 75,
                                top: clientY - 35,
                            }}
                            ref={ref => {
                                buttonRefs.current[key] = { ref, movieId };
                            }}
                            onContextMenu={(e) => handleDelete(e, key)}
                        >
                            <MovieButton movieId={movieId}/>
                        </MovieButtonWrapper>
                    </Draggable>
                )
            };

            setButtons(prevButtons => ({
                ...prevButtons,
                [key]: newButton
            }));
        }
    };

    const handleStop = async (e, data, key, movieId) => {
        //User has picked up the mouse, and we have to check if any buttons are overlapping
        const currentButton = buttonRefs.current[key];

        const currentButtonRect = currentButton.ref.getBoundingClientRect();

        //Only overlap the first pair of buttons found.
        let deleted = false;
        for (const k of Object.keys(buttonRefs.current)) {
            if (k !== key && !deleted) {
                const rect = buttonRefs.current[k].ref.getBoundingClientRect();

                if (
                    currentButtonRect.left < rect.right &&
                    currentButtonRect.right > rect.left &&
                    currentButtonRect.top < rect.bottom &&
                    currentButtonRect.bottom > rect.top
                ) {
                    //Overlap found. Delete the buttons and add a new one.
                    await overlap(e, k, key, movieId, buttonRefs.current[k].movieId)
                    deleted = true;
                }
            }
        }
    };

    const handleDelete = async (e, key) => {
        e.preventDefault();
        const audio = new Audio('/delete-button.mp3');
        await audio.play();

        setButtons(prevButtons => {
            const updatedButtons = {...prevButtons};
            delete updatedButtons[key];
            return updatedButtons;
        });
    };

    const overlap = async (e, k, key, movieId1, movieId2) => {
        const newMovieId = await merge(movieId1, movieId2)

        const movieExists = movies.some(movie => movie.id === newMovieId);

        if (!movieExists) {
            const audio = new Audio('/new-movie.mp3');
            await audio.play();
            await addMovie(newMovieId);
        }

        setButtons(prevButtons => {
            const updatedButtons = {...prevButtons};
            delete updatedButtons[k];
            delete updatedButtons[key];
            return updatedButtons;
        });

        addDraggableButton(e, newMovieId);
    }

    const newMovie = async() => {
        if (searchTerm === "" || searchTerm === null) {
            return;
        }
        const movieId = await fetchMovieId(searchTerm)

        if (movieId === null) {
            return;
        }

        const movieExists = movies.some(movie => movie.id === movieId);

        if (!movieExists) {
            const audio = new Audio('/new-movie.mp3');
            await audio.play();
            await addMovie(movieId);
            await decrementAddMovie();
        }

        setSearchTerm("");
    };

    const handleFormChange = event => {
        setSearchTerm(event.target.value);
    };

    useEffect(() => {
    }, [movies]);

    //I thought references would delete themselves if the buttons were gone but no.
    //Remake button refs by going through them.
    useEffect(() => {
        const newButtonRefs = {};
        Object.keys(buttons).forEach(key => {
            const ref = buttonRefs.current[key];
            if (ref) {
                newButtonRefs[key] = ref;
            }
        });
        buttonRefs.current = newButtonRefs;
    }, [buttons]);

    return (
        <SideBar>
            <CraftedButtons>
                {movies
                    .filter(movie => movie.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((movie, index) => (
                        typeof movie.id === 'string' && (
                            <CraftedButton key={index} onClick={(e) => addDraggableButton(e, movie.id)}>
                                <MovieButton movieId={movie.id} />
                            </CraftedButton>
                        )
                    ))}

                {[...Array(numAddMovies)].map((_, index) => (
                    <AddMovieButton key={index} onClick={newMovie}/>
                ))}

            </CraftedButtons>

            <SearchBar searchTerm={searchTerm} handleFormChange={handleFormChange} onSubmit={newMovie}/>
            {Object.values(buttons).map(button => button.button)}
        </SideBar>
    );
}
