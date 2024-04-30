import styled from 'styled-components';
import BubbleNav from './BubbleNav';
import PropTypes from "prop-types";
import useSWR from 'swr';
import {useState} from "react";

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
    padding-right: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
`;
const TextColumn = styled.div`
    display: flex;
    justify-content: center;
    text-align: center;
`;
const Row = styled.div`
    display: flex;
`;
const MovieButton = ({ movieId }) => {
    
    const API_KEY = '7a644baa';

    
    //for NavBubble visiblity
    const [isVisible, setIsVisible] = useState(false);
    const toggle = () => {
        setIsVisible(!isVisible);
    };
    //use SWR to make the api call
    const {data, error} =
        useSWR(`http://www.omdbapi.com/?apikey=${API_KEY}&i=${movieId}`,
            (url) =>
                fetch(url).then((res) => res.json())
        );
    //error handling
    if (error) return <div><p>Failed to Load</p></div>;
    if (!data) return <div><p>Please Be Patient -- Loading...</p></div>;

   //play audio when clicked
    const audio = new Audio('/on-click.mp3');
    audio.play();

    const handleDoubleClick = () => {
        toggle();
    };
    
    const { Title, Poster } = data;
    //function to limit the number of chatacters being displayed
    const limitText = (text, maxLength) => {
        if (text == null) {
            return "";
        } else if (text.length <= maxLength) {
            return text;
        } else {
            //when it reach the maxlength, it will replace the rest with ...
            return text.substring(0, maxLength) + '...';
        }
    };
//limit movie title to 25 characters
    return (
        <>
            <Button onClick={handleButtonClick} onDoubleClick={handleDoubleClick}>
                <Row>
                    <ImageColumn>
                        <ButtonImg src={Poster} alt="Poster"/>
                    </ImageColumn>
                    <TextColumn>
                        <ButtonText>{limitText(Title, 25)}</ButtonText>
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

