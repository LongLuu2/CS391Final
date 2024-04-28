import Draggable from 'react-draggable';
import styled from "styled-components"
import {useState, useRef, useEffect } from "react";
import {NavLink} from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import MovieButton from "./MovieButton.jsx";

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
    flex-direction: column;
    width: wrap-content;
    border-top: 1px solid #9f9f9f;
  }
`;

const Instructions = styled.h2`
  height: 100px;
  width: 200px;
  border: 1px solid #9f9f9f;
`

const StyledNavLink = styled.a`
  transition: all 0.5s;
  cursor: pointer;
  position: relative;

  &:after {
    content: '»';
    position: absolute;
    opacity: 0;
    right: -25px;
    transition: 0.5s;
  }

  &:hover {
    padding-right: 25px;

    &:after {
      opacity: 1;
      right: 10px;
    }
  }
`;

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

    const addDraggableButton = ({ clientX, clientY }) => {
        // Generate unique key for each button
        const key = uuidv4();

        const newButton = (
            <div
                key={key}
                style={{
                    position: 'absolute',
                    left: clientX,
                    top: clientY,
                    transform: 'translate(-50%, -50%)',
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
                    addDraggableButton(e);
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
        <SideBar>
            <CraftedButtons>
                {[...Array(5)].map((_, index) => (
                    <div key={index} onMouseDown={e => addDraggableButton(e)}>
                        <MovieButton/>
                    </div>
                ))}
            </CraftedButtons>
            {buttons.map(button => button)}
        </SideBar>
    );
}