import {useState, useEffect} from "react";
import styled from "styled-components";
import MovieDetails from './MovieDetails.jsx';
import NavBar from "./NavBar.jsx";
import {useNavigate} from 'react-router-dom';

const StyledRow = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
`;

const StyledH5 = styled.h5`
    text-align: center;
`;

export default function Movies({title}) {
    let navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [movie, setMovie] = useState(null);

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