import styled from 'styled-components';

const StyledDiv = styled.div`
    display: flex;
    flex-direction: row;
    height: auto;
    width: 100%;
    padding: 10px;
    justify-content: center;
    //margin-top: 10%;
`;

const StyledCard = styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid lightgrey;
    border-radius: 5%;
    width: 50%;
    padding: 5px 20px 45px 20px;
    text-align: center;
`;

const StyledTitle = styled.h1`
    margin-bottom: 10px;
    color: darkblue;
`;

const StyledP = styled.p`
    margin-bottom: 5px;
`;

const StyledLabel = styled.span`
    font-weight: bold;
    margin-right: 5px;
`;

const StyledImage = styled.img`
  width: 45%; 
  height: auto; 
  margin-right: 20px;
    max-width: 400px;
`;

const StyledPlot = styled.p`
    margin: 20px 10px;
    text-align: left;
`;

export default function MovieDetails({movie}) {
    return (
        <>
            <StyledDiv>
                <StyledImage src={movie.Poster} alt={'Movie Poster'}/>
                <StyledCard>
                    <StyledTitle>{movie.Title}</StyledTitle>
                    <StyledP><StyledLabel>Year:</StyledLabel>{movie.Year}</StyledP>
                    <StyledP><StyledLabel>Genre: </StyledLabel>{movie.Genre}</StyledP>
                    <StyledP><StyledLabel>Country: </StyledLabel>{movie.Country}</StyledP>
                    <StyledP><StyledLabel>Language: </StyledLabel>{movie.Language}</StyledP>
                    <StyledP><StyledLabel>Director: </StyledLabel>{movie.Director}</StyledP>
                    <StyledP><StyledLabel>Writer: </StyledLabel>{movie.Writer}</StyledP>
                    <StyledP><StyledLabel>Actors: </StyledLabel>{movie.Actors}</StyledP>
                    <StyledPlot><StyledLabel>Plot: </StyledLabel>{movie.Plot}</StyledPlot>
                </StyledCard>
            </StyledDiv>
        </>
    );
}