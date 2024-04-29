import Draggable from 'react-draggable';
import styled from "styled-components"
import {NavLink} from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import MovieButton from "./MovieButton.jsx";
import AddMovieButton from "./AddMovieButton.jsx";
import SearchBar from './SearchBar.jsx';
import useMovieManager from "../hooks/useMovieManager.jsx";
import {useState, useRef, useEffect } from "react";

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
  height: wrap-content;
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 8px;

  div {
    margin-right: 4px;
    margin-bottom: 3px;
  }
  
  @media screen and (max-width: 900px) {
    height: 100%;
    width: wrap-content;
    flex-direction: column;
  }
  
`

const MovieButtonWrapper = styled.div`
  position: absolute;
  z-index: 1;
`;

const StyledForm = styled.form`
  width: 100%;
  position: absolute;
  bottom: 0;
  height: wrap-content;
`;

const StyledInput = styled.input`
  width: 100%;
  font-size: 16px;
  padding: 10px;
`;

export default function DraggableScreen() {
    const { movies, addMovie, merge, fetchMovieId} = useMovieManager();
    // Hold the buttons and their references to use their positions later on.
    const [buttons, setButtons] = useState({});
    const [numAddButtons, setNumAddButtons] = useState(4);
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
                            ref={ref => buttonRefs.current[key] = ref}
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

    const handleStop = (e, data, key, movieId) => {
        //User has picked up the mouse and we have to check if any buttons are overlapping
        const currentButton = buttonRefs.current[key];

        const currentButtonRect = currentButton.getBoundingClientRect();

        //Only overlap the first pair of buttons found.
        let deleted = false;
        Object.keys(buttonRefs.current).forEach(k => {
            if (k !== key && !deleted) {
                const rect = buttonRefs.current[k].getBoundingClientRect();

                if (
                    currentButtonRect.left < rect.right &&
                    currentButtonRect.right > rect.left &&
                    currentButtonRect.top < rect.bottom &&
                    currentButtonRect.bottom > rect.top
                ) {
                    //Overlap found. Delete the buttons and add a new one.
                    overlap(e, k, key, movieId)
                    deleted = true;
                }
            }
        });
    };

    const handleDelete = (e, key) => {
        e.preventDefault();
        const audio = new Audio('/delete-button.mp3');
        audio.play();

        setButtons(prevButtons => {
            const updatedButtons = { ...prevButtons };
            delete updatedButtons[key];
            return updatedButtons;
        });
    };

    const overlap = async (e, k, key, movieId) => {
        const movieId1 = movieId;
        const movieId2 = buttons[k].movieId;

        const newMovieId = await merge(movieId1, movieId2)
        console.log("new movie id", newMovieId)

        const movieExists = movies.some(movie => movie.id === newMovieId);

        if (!movieExists) {
            console.log("true")
            const audio = new Audio('/new-movie.mp3');
            audio.play();
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
            audio.play();
            await addMovie(movieId);
        }
        setSearchTerm("");
    };

    const handleFormChange = event => {
        setSearchTerm(event.target.value);
    };

    useEffect(() => {
    }, [movies]);

    //I thought references would delete themselves if the buttons were gone but noooo.
    //Remake button refs by going through them.
    useEffect(() => {
        const newButtonRefs = {};
        Object.keys(buttons).forEach(key => {
            const button = buttons[key];
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
                            <div key={index} onClick={(e) => addDraggableButton(e, movie.id)}>
                                <MovieButton movieId={movie.id} />
                            </div>
                        )
                    ))}

                {[...Array(numAddButtons)].map((_, index) => (
                    <AddMovieButton key={index} onClick={newMovie}/>
                ))}
            </CraftedButtons>

            <SearchBar searchTerm={searchTerm} handleFormChange={handleFormChange} />
            {Object.values(buttons).map(button => button.button)}
        </SideBar>
    );
}
