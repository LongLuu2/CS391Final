import { useState, useEffect } from 'react';
import styled from 'styled-components';
import BubbleNav from './BubbleNav';
import PropTypes from "prop-types";
import useSWR from 'swr';

const Button = styled.button`
    display: flex;
    flex-direction: row;
    background: linear-gradient(to bottom, #ffffff, #f0f0f0);
    border: 2px solid grey;
    align-items: center;
    height: 70px;
    width: 150px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.5s;

    &:hover {
        background: linear-gradient(to bottom, #ffffff, rgba(89, 165, 216, 0.5));
    }
`;

const ButtonImg = styled.img`
    width: 40px;
    height: 40px;
    overflow: hidden;
    border-radius: 50%;
    margin-right: 10px;
    align-self: center;
    pointer-events: none;
`

const ButtonText = styled.p`
    flex: 1;
    overflow: hidden;
    align-self: center;
    text-align: left;
    pointer-events: none;
`
const ImageColumn = styled.div`
    flex: 50%;
    padding-right: 10px;
    margin-left: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    
`;
const TextColumn = styled.div`
    flex: 50%;
    padding-top: 2px;
    display: flex;
    justify-content: center;
    text-align: center;
`;
const Row = styled.div`
    display: flex;
`;
const MovieButton = ({ movieId }) => {
    
    const API_KEY = '7a644baa';
    //const MOVIE_ID = 'nemo';

    
    //for NavBubble visiblity
    const [isVisible, setIsVisible] = useState(false);
    const toggle = () => {
        setIsVisible(!isVisible);
    };

    const {data, error} =
        useSWR(`http://www.omdbapi.com/?apikey=7a644baa&i=${movieId}`,
            (url) =>
                fetch(url).then((res) => res.json())
        );
    
    if (error) return <div><p>Failed to Load</p></div>;
    if (!data) return <div><p>Please Be Patient -- Loading...</p></div>;

    const handleButtonClick = (e) => {
        console.log("Button clicked!");
        const audio = new Audio('/on-click.mp3');
        audio.play();
    };

    const handleDoubleClick = () => {
        toggle();
    };
    
    const { Title, Poster } = data;
    const limitText = (text, maxLength) => {
        if (text == null) {
            return "";
        } else if (text.length <= maxLength) {
            return text;
        } else {
            return text.substring(0, maxLength) + '...';
        }
    };
///
    return (
        <>
            <Button onClick={handleButtonClick} onDoubleClick={handleDoubleClick}>
                <Row>
                    <ImageColumn>
                        <ButtonImg src={Poster} alt="Poster"/>
                    </ImageColumn>
                    <TextColumn>
                     <ButtonText>{limitText(Title, 20)}</ButtonText>
                 </TextColumn>
                </Row>
            </Button>
            {isVisible && <BubbleNav movieTitle={Title}/>}
        </>

    );
};

MovieButton.propTypes = {
    movieId: PropTypes.string.isRequired
};

export default MovieButton;

