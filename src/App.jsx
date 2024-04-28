import Movies from './components/Movies.jsx';
import {Route, Routes, createBrowserRouter, RouterProvider} from 'react-router-dom';
import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    box-sizing: border-box;
  }
`;

function root() {
    return (
        <>
            <GlobalStyle />
            <Routes>
                <Route path='/*' element={<Movies title="nemo"/>} />
            </Routes>
        </>
    )
}

const router = createBrowserRouter(
    [{path:"*", Component: root}]
);

function App() {

  return (
    <>
        <RouterProvider router={router}/>
    </>
  )
}

export default App
