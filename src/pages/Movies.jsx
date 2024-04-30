import {useState, useEffect} from "react";
import styled from "styled-components";
import MovieDetails from '../components/MovieDetails.jsx';
import NavBar from "../components/NavBar.jsx";
import {useNavigate} from 'react-router-dom';
import { useLocation } from "react-router-dom"; // use to get tittle

const StyledRow = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
`;

const StyledH5 = styled.h5`
    text-align: center;
`;

{/*
* Fetches the movie title after the corresponding button is clicked
* and presents more movie's details.
*/}

export default function Movies() {
    let navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [movie, setMovie] = useState(null);

    //get title
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const title = searchParams.get("movieName");

    //use useEffect to fetch more details about the movie
    useEffect(() => {
        async function fetchData() {
            const data = await fetch(`https://www.omdbapi.com/?apikey=e906836d&t=${title}`);
            const result = await data.json();

            if (result) {
                setMovie(result);
                setLoading(false);
            }
        }
        fetchData()
            .then(() => console.log("everything is fine"))
            .catch(() => console.log("something went wrong"))
    }, [])

    return (
        <>
            {navigate && (<NavBar goBack={() => navigate(-1)}/>)}
            <StyledRow>
                {loading ? (
                    <StyledH5>Loading...</StyledH5>
                ): (
                    <MovieDetails
                            key={movie.Title}
                            movie={movie}
                    />
                )}
            </StyledRow>
        </>
    );
}