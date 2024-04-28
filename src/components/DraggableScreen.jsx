import Draggable from 'react-draggable';
import styled from "styled-components"
import {useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import MovieButton from "./MovieButton.jsx";

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 20px;
  font-size: 15px;
`;
const StyledTitle = styled.h1`
  text-align: right;
`;

const GameScreen = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: row;

  @media screen and (max-width: 900px) {
    flex-direction: column;
  }
`;

const MainScreen = styled.div`
  height: 100%;
  width: 75%;

  @media screen and (max-width: 900px) {
    height: 75%;
    width: 100%;
  }
`;

const SideBar = styled.div`
  height: 100%;
  width: 25%;
  border-left: 1px solid #9f9f9f;
  overflow-y: auto;
  margin: 0;
  padding: 0;
  @media screen and (max-width: 900px) {
    height: 25%;
    width: 100%;
    border-top: 1px solid #9f9f9f;
    overflow-x: auto;
  }
`;

const CraftedButtons = styled.div`
  height: wrap-content;
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  border-left: 1px solid #9f9f9f;
  * {
    margin-right: 10px;
    margin-bottom: 10px;
  }
  @media screen and (max-width: 900px) {
    height: 100%;
    width: wrap-content;
    border-top: 1px solid #9f9f9f;
  }
`;

const Instructions = styled.h2`
  height: 100px;
  weight: 200px;
  border: 1px solid #9f9f9f;
`

const handleClick = (e) => {
    if (e.type === 'click') {
        console.log('Left click');
    } else if (e.type === 'contextmenu') {
        console.log('Right click');
    }
};

export default function DraggableScreen() {
    // Hold the buttons and their references to use their positions later on.
    const [buttons, setButtons] = useState([]);
    const buttonRefs = useRef({});

    const addDraggableButton = (event) => {
        console.log("FCUUUCUGO:SBNKLBNGKBJSKHCXBJHDK")
        const { clientX, clientY } = event;
        // Generate unique key for each button
        const key = uuidv4();

        const newButton = (
            <div
                key={key}
                style={{
                    position: 'absolute',
                    left: clientX,
                    top: clientY,
                    zIndex: 1000,
                }}
            >
                <Draggable
                    onStop={(e, data) => handleStop(e, data, key)}
                >
                    <div ref={ref => buttonRefs.current[key] = ref}>
                        <MovieButton/>
                    </div>
                </Draggable>
            </div>
        );

        setButtons([...buttons, newButton]);
    };

    const addNewButton = (left, top, key) => {
        const newButton = (
            <div
                key={key}
                style={{
                    position: 'absolute',
                    left: left + 50,
                    top: top + 50,
                    zIndex: 1000,
                }}
            >
                <Draggable
                    onStop={(e, data) => handleStop(e, data, key)}
                >
                    <div ref={ref => buttonRefs.current[key] = ref}>
                        <MovieButton/>
                    </div>
                </Draggable>
            </div>
        );

        setButtons(prevButtons => [...prevButtons, newButton]);
    };

    const handleStop = (e, data, key) => {
        //The user has picked up the mouse and we have to check if any buttons are overlapping
        const currentButton = buttonRefs.current[key];
        const currentButtonRect = currentButton.getBoundingClientRect();

        //Only overlap the first pair of buttons found.
        let deleted = false;

        Object.keys(buttonRefs.current).forEach(k => {
            if (k !== key && !deleted) {
                console.log("comparing against "+ k)
                const rect = buttonRefs.current[k].getBoundingClientRect();

                if (
                    currentButtonRect.left < rect.right &&
                    currentButtonRect.right > rect.left &&
                    currentButtonRect.top < rect.bottom &&
                    currentButtonRect.bottom > rect.top
                ) {
                    //Overlap found. Delete the buttons and add a new one.
                    setButtons(prevButtons => prevButtons.filter(button => button.key !== k && button.key !== key));
                    const newButtonKey = uuidv4();
                    const { left, top } = currentButtonRect;
                    addNewButton(left, top, newButtonKey);

                    deleted = true;
                }
            }
        });
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

    return (
        <GameScreen>
            <MainScreen>
            <StyledHeader>
                <StyledTitle>Lagtrain</StyledTitle>
                <StyledTitle>Movie<br/>Craft</StyledTitle>
            </StyledHeader>
            </MainScreen>
            <SideBar>
                <CraftedButtons>
                    {[...Array(5)].map((_, index) => (
                        <div key={index} onClick={addDraggableButton}>
                            <MovieButton/>
                        </div>
                    ))}
                    <Instructions>Drag elements to craft</Instructions>
                </CraftedButtons>
            </SideBar>
            {buttons.map(button => button)}
        </GameScreen>
    );
}