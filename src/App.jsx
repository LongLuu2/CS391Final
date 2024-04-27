import React, { useState } from 'react';
import DraggableScreen from './components/DraggableScreen';
import styled, { createGlobalStyle } from 'styled-components';

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
        <DraggableScreen />
      </>
  );
}

export default App;
