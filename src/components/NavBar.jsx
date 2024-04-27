import styled from 'styled-components';
import Button from './Button.jsx';

const StyledWrapper = styled.div`
    width: 100%;
    height: 15vh;
    display: flex;
    background: lightgoldenrodyellow;
    margin-bottom: 40px;
    align-items: center;
`;

const StyledTitle = styled.h1`
    margin-left: 30%;
`;

const StyledButton = styled(Button)`
    margin-left: 5%;
    height: 50%;
`;

export default function NavBar({goBack}) {
    return (
        <StyledWrapper>
            {goBack && <StyledButton onClick={goBack}>{`< Go Back`}</StyledButton>}
            <StyledTitle>Movie Details</StyledTitle>
        </StyledWrapper>
    )
}