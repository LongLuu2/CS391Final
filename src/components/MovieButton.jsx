import { useState, useEffect } from 'react';
import styled from 'styled-components';

const Button = styled.button`
    display: flex;
    align-items: center;
    background: linear-gradient(to bottom, #ffffff, #f0f0f0);
    border: 2px solid grey;
    padding: 10px;
    height: 100px;
    width: 175px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background: linear-gradient(to bottom, #ffffff, rgba(89, 165, 216, 0.5));
    }
`;

const ButtonImg = styled.img` 
    width: 30px;
    height: auto;
    padding-top: 8px;
    pointer-events: none;
`

const ButtonText = styled.p`
    flex: 1;    
    overflow: hidden;
    pointer-events: none;
`
const Column = styled.div`
    flex: 50%;
`
const Row = styled.div`
    display: flex;
`

const MovieButton = () => {
    const [movieData, setMovieData] = useState(null);
    const API_KEY = '7a644baa';
    const MOVIE_ID = 'tt3896198';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&i=${MOVIE_ID}`);
                const jsonData = await response.json();
                setMovieData(jsonData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleButtonClick = () => {
        console.log("Button clicked!");
    };

    const limitText = (text, maxLength) => {
        if (text.length <= maxLength) {
            return text;
        } else {
            return text.substring(0, maxLength) + '...';
        }
    };
///
    return (
        <Button onClick={handleButtonClick}>
            {movieData ? (
                    <Row>
                        <Column>
                            <ButtonImg src={movieData.Poster} alt="Poster"/>
                        </Column>
                        <Column>
                            <ButtonText>{limitText(movieData.Title, 40)}</ButtonText>
                        </Column>
                    </Row>
            ) : (
                <div>Loading...</div>
            )}
        </Button>

);
};

export default MovieButton;
