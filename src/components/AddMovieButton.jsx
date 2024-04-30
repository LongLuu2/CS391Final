import styled from 'styled-components';
import PropTypes from 'prop-types';

// A button component for adding new movies to sidebar.
const AddButton = styled.div`
  border: 2px dashed gray;
  background: white;
  height: 70px;
  width: 150px;
  border-radius: 5px;
  box-sizing: border-box;
  color: gray;
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  touch-action: manipulation;
  transition: box-shadow 0.2s, transform 0.1s;
  margin-right: 4px;
  margin-bottom: 3px;

  &:active {
    border-color: gray;
    transform: scale(0.96);
  }
`;

export default function AddMovieButton({onClick}) {
    const handleButtonClick = async (e) => {
        const audio = new Audio('/on-click.mp3');
        await audio.play();
        onClick(e);
    };

    return (
            <AddButton onClick={handleButtonClick}>
            +
            </AddButton>
    );
}

AddMovieButton.propTypes = {
    onClick: PropTypes.func.isRequired,
};
