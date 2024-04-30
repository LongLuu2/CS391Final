import styled from "styled-components"
import DraggableScreen from "../components/DraggableScreen.jsx";
import useMovieManager from "../hooks/useMovieManager.jsx";
import Header from "../components/Header.jsx";

/*
   Game Screen manages holds the main game screen, the sidebar, and header. A good chunk of the
   logic is within the Draggable Screen, so there's global comments there too.
*/

const Screen = styled.div`
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
  position: relative;

  @media screen and (max-width: 900px) {
    height: 75%;
    width: 100%;
  }
`;

const ResetButton = styled.button`
  background: #fff;
  backface-visibility: hidden;
  border-color: gray;
  border-radius: .375rem;
  border-style: solid;
  border-width: .125rem;
  box-sizing: border-box;
  color: gray;
  cursor: pointer;
  display: inline-block;
  font-size: 1.125rem;
  font-weight: 700;
  letter-spacing: -.01em;
  line-height: 1.3;
  padding: 10px;
  position: absolute;
  bottom: 10px;
  left: 10px;
  text-align: left;
  text-decoration: none;
  transform: translateZ(0) scale(1);
  transition: transform .2s;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;

  &:not(:disabled):hover {
    transform: scale(1.05);
  }

  &:not(:disabled):hover:active {
    transform: scale(1.05) translateY(.125rem);
  }

  &:focus {
    outline: 0 solid transparent;
  }

  &:focus:before {
    content: "";
    left: calc(-1*.375rem);
    pointer-events: none;
    position: absolute;
    top: calc(-1*.375rem);
    transition: border-radius;
    user-select: none;
  }

  &:focus:not(:focus-visible) {
    outline: 0 solid transparent;
  }

  &:focus:not(:focus-visible):before {
    border-width: 0;
  }
`;

export default function GameScreen() {
    const {clearMovies} = useMovieManager();

    const resetGame = async () => {
        await clearMovies();
    };

    return (
        <Screen>
            <MainScreen>
                <Header/>
                <ResetButton onClick={resetGame}>
                    Reset
                </ResetButton>
            </MainScreen>
            <DraggableScreen/>
        </Screen>
    );
}