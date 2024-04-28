import styled from "styled-components"
import DraggableScreen from "../components/DraggableScreen.jsx";

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 20px;
  font-size: 15px;
`;

const StyledTitle = styled.h1`
  text-align: right;
`;

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

  @media screen and (max-width: 900px) {
    height: 75%;
    width: 100%;
  }
`;

export default function GameScreen() {
    return (
        <Screen>
            <MainScreen>
                <StyledHeader>
                    <StyledTitle>Lagtrain</StyledTitle>
                    <StyledTitle>Movie<br/>Craft</StyledTitle>
                </StyledHeader>
            </MainScreen>
            <DraggableScreen/>
        </Screen>
    );
}