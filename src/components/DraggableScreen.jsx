import Draggable, {DraggableCore} from 'react-draggable';
import styled from "styled-components"
import {useState, useRef } from "react";

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  color: mediumpurple;
  padding: 10px;
  height: 50px;
  width: 100px;
  line-height: 2;
  border-radius: 5px;
  font-weight: bold;
  border: 4px solid mediumpurple;
  font-size: inherit;
  cursor: pointer;
`;

export const GameScreen = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: row;
    
   @media screen and (max-width: 900px) {
     flex-direction: column;
   }
`;

export const MainScreen = styled.div`
    height: 100%;
    width: 75%;
    
   @media screen and (max-width: 900px) {
    height: 75%;
    width: 100%;
  }
`;

export const SideBar = styled.div`
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

export const CraftedButtons = styled.div`
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
    const [buttons, setButtons] = useState([]);
    const buttonRefs = useRef([]);

    const addDraggableButton = () => {
        const newButton = (
            <Draggable
                key={buttons.length}
                onStop={(e, data) => handleStop(e, data, buttons.length)}
            >
                <Button
                    ref={el => (buttonRefs.current[buttons.length] = el)}
                >
                    Move Me
                </Button>
            </Draggable>
        );
        setButtons([...buttons, newButton]);
    };

    const handleStop = (e, data, index) => {
        const currentButton = buttonRefs.current[index];
        const currentButtonRect = currentButton.getBoundingClientRect();

        buttonRefs.current.forEach((button, idx) => {
            if (idx !== index) {
                const rect = button.getBoundingClientRect();

                if (
                    currentButtonRect.left < rect.right &&
                    currentButtonRect.right > rect.left &&
                    currentButtonRect.top < rect.bottom &&
                    currentButtonRect.bottom > rect.top
                ) {
                    console.log(`Buttons at index ${index} and ${idx} are overlapping.`);
                }
            }
        });
    };

    return (
        <GameScreen>
            <MainScreen />
            <SideBar>
                <CraftedButtons>
                    {[...Array(5)].map((_, index) => (
                        <Button
                            key={index}
                            onClick={addDraggableButton}
                        >
                            Move Me
                        </Button>
                    ))}
                    <Instructions>Drag elements to craft</Instructions>
                </CraftedButtons>
            </SideBar>
            {buttons.map(button => button)}
        </GameScreen>
    );
}