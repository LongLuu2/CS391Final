import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import GameScreen from "./pages/GameScreen.jsx";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    box-sizing: border-box;
  }
`;

function App() {
    return (
        <>
            <GlobalStyle/>
            <GameScreen />
        </>
    );
}

export default App;
