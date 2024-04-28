import { useState, useEffect } from 'react';
import styled from 'styled-components';
import BubbleNav from './BubbleNav';

const Button = styled.button`
    display: flex;
    background: linear-gradient(to bottom, #ffffff, #f0f0f0);
    border: 2px solid grey;
    align-items: center;
    height: 70px;
    width: 150px;
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
    pointer-events: none;
    margin-right: 10px;
`

const ButtonText = styled.p`
    flex: 1;    
    overflow: hidden;
    pointer-events: none;
`
const Column = styled.div`
`
const Row = styled.div`
    display: flex;
    flex-direction: row;
`

const MovieButton = () => {
    const [movieData, setMovieData] = useState(null);
    const API_KEY = '7a644baa';
    const MOVIE_ID = 'nemo';

    //for NavBubble visiblity
    const [isVisible, setIsVisible] = useState(false);
    const toggle = () => {
        setIsVisible(!isVisible);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&t=${MOVIE_ID}`);
                const jsonData = await response.json();
                setMovieData(jsonData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleButtonClick = (e) => {
        console.log("Button clicked!");
        const audio = new Audio('/on-click.mp3');
        audio.play();
    };

    const handleDoubleClick = () => {
        toggle();
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
        <>
        <Button onClick={handleButtonClick} onDoubleClick={handleDoubleClick}>
            {movieData ? (
                    <Row>
                        <ButtonImg src={movieData.Poster} alt="Poster"/>
                        <ButtonText>{limitText(movieData.Title, 40)}</ButtonText>
                    </Row>
            ) : (
                <div>Loading...</div>
            )}
        </Button> 
        {isVisible && <BubbleNav movieTitle={movieData ? movieData.Title : ''}/>}
        </>

);
};

export default MovieButton;
