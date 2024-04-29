import Draggable from 'react-draggable';
import styled from "styled-components"
import {NavLink} from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import MovieButton from "./MovieButton.jsx";
import AddMovieButton from "./AddMovieButton.jsx";
import {useState, useRef, useEffect } from "react";
import useMovieManager from "../hooks/useMovieManager.jsx";

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
    margin-right: 10px;
    margin-bottom: 10px;
  }
  
  @media screen and (max-width: 900px) {
    height: 100%;
    width: wrap-content;
    flex-direction: column;
  }
`
const MovieButtonWrapper = styled.div`
  position: absolute;
  left: ${props => props.clientX};
  top: ${props => props.clientY};
  z-index: 1;
`;

export const StyledButton = styled.button`
    margin: 10px;
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
    const { movies, addMovie, clearMovies} = useMovieManager();
    // Hold the buttons and their references to use their positions later on.
    const [buttons, setButtons] = useState([]);
    const [numAddButtons, setNumAddButtons] = useState(4);

    const [query, setQuery] = useState("");

    const buttonRefs = useRef({});

    const addDraggableButton = ({ clientX, clientY }, movieId) => {
        // Generate unique key for each button
        const key = uuidv4();

        //Hard-coded centering around a point, because Draggable overwrites transform.
        //When I wrapped it in a div, it would cover the other buttons without dragging.
        const newButton = (
            <Draggable
                key={key}
                onStop={(e, data) => handleStop(e, data, key)}
            >
                <MovieButtonWrapper
                    clientX={clientX}
                    clientY={clientY}
                    style={{
                        position: 'absolute',
                        left: clientX - 75,
                        top: clientY - 35,
                        zIndex: 1,
                    }}
                    ref={ref => buttonRefs.current[key] = ref}
                    onContextMenu={(e) => handleDelete(e, key)}
                >
                    <MovieButton movieId={movieId}  onContextMenu={(e) => handleDelete(e, key)}/>
                </MovieButtonWrapper>
            </Draggable>
        );

        setButtons(prevButtons => [...prevButtons, newButton]);
    };

    const handleStop = (e, data, key) => {
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
                    setButtons(prevButtons => prevButtons.filter(button => button.key !== k && button.key !== key));
                    const audio = new Audio('/new-movie.mp3');
                    audio.play();
                    addDraggableButton(e);
                    deleted = true;
                }
            }
        });
    };

    const handleDelete = (e, key) => {
        e.preventDefault();
        const audio = new Audio('/delete-button.mp3');
        audio.play();
        setButtons(prevButtons => prevButtons.filter(button => button.key !== key));
    };

    //I thought references would delete themselves if the buttons were gone but noooo.
    //Remake button refs by going through the buttons.
    useEffect(() => {
        const newButtonRefs = {};
        buttons.forEach(button => {
            const key = button.key;
            if (buttonRefs.current[key]) {
                newButtonRefs[key] = buttonRefs.current[key];
            }
        });
        buttonRefs.current = newButtonRefs;
    }, [buttons]);

    const randomMovie = async() => {
        const movieIds = ['tt0110912', 'tt1160419', 'tt3783958'];
        const randomMovieId = movieIds[Math.floor(Math.random() * movieIds.length)];
        await addMovie(randomMovieId);
    };
    const handleClicky = () => {
        clearMovies();
    };

    return (
        <SideBar>
            <CraftedButtons>
                {movies.map((movie, index) => (
                    <div key={index} onClick={(e) => addDraggableButton(e, movie.id)}>
                        <MovieButton movieId={movie.id} />
                    </div>
                ))}

                {[...Array(numAddButtons)].map((_, index) => (
                    <AddMovieButton key={index} onClick={randomMovie}/>
                ))}

                <StyledButton onClick={handleClicky}>
                    NukeMovies
                </StyledButton>
            </CraftedButtons>

            <StyledForm>
                <label>
                    <StyledInput type="text" name="name" placeholder="Search Items" />
                </label>
            </StyledForm>

            {buttons.map(button => button)}
        </SideBar>
    );
}