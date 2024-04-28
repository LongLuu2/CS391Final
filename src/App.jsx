import {createBrowserRouter, Route, RouterProvider, Routes} from "react-router-dom";
import Header from "./components/Header";
import GameScreen from "./pages/GameScreen"
import styled, { createGlobalStyle } from 'styled-components';
import Movies from "./pages/Movies";


const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    box-sizing: border-box;
  }
`;
function Root() {
  return(
    <>
    <GlobalStyle/>
    <Routes>
      /*adds routes */
      <Route path ='/' element = {<GameScreen/>}/>
      <Route path = 'Movies' element = {<Movies/>}/>
    </Routes>
    </>
  )
}

const router = createBrowserRouter([
  {path:'*', Component: Root}
])

function App() {

  return (
    <RouterProvider router ={router}/>
  )
}

export default App