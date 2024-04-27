import Movies from './components/Movies.jsx';
import {Route, Routes, createBrowserRouter, RouterProvider} from 'react-router-dom';

function root() {
    return (
        <>
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
