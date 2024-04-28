import styled from 'styled-components';

const HeaderWrapper = styled.div`
    display: flex;
    background-color: #ADD8E6;
    color: white;
    padding: 20px;
    text-align: center;
    align-items: center;
    justify-content: space-between;
`;

const LeftImage = styled.img`
    width: 50px;
    height: auto;
`;

const RightImage = styled.img`
    width: 50px;
    height: auto;
`;

const StyledH1 = styled.h1`
justify-self: center;
`


function Header() {
    return (
        <HeaderWrapper>
            <LeftImage src = "/popcorn.png" alt = "popcorn"/>
            <StyledH1>Movie Craft</StyledH1>
            <RightImage src = "/Movie.png" alt = "movie"/>
        </HeaderWrapper>
    )
}
export default Header;