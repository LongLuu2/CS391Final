import styled from 'styled-components';

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

  &:active {
    border-color: gray;
    transform: scale(0.96);
  }
`;

export default function AddMovieButton({onClick}) {
    const handleButtonClick = (e) => {
        console.log("AAAAAAAHH!");
        const audio = new Audio('/on-click.mp3');
        audio.play();
        onClick(e);
    };

    return (
            <AddButton onClick={handleButtonClick}>
            +
            </AddButton>
    );
};

