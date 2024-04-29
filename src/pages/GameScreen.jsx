import styled from "styled-components"
import DraggableScreen from "../components/DraggableScreen.jsx";
import useMovieManager from "../hooks/useMovieManager.jsx";
import Header from "../components/Header.jsx";

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

export const StyledButton = styled.button`
    margin: 10px;
    position: absolute;
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
                <StyledButton onClick={resetGame}>
                    Reset
                </StyledButton>
            </MainScreen>
            <DraggableScreen/>
        </Screen>
    );
}