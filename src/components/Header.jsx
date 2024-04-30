import styled from 'styled-components';

const HeaderWrapper = styled.div`
    display: flex;
    color: white;
    padding: 10px;
    text-align: center;
    align-items: center;
    justify-content: space-between;
`;

const LeftImage = styled.img`
    width: 200px;
    height: auto;
    pointer-events: none;
`;

const RightImage = styled.img`
    width: 50px;
    height: auto;
    pointer-events: none;
`;
//basic header with images on both sides
function Header() {
    return (
        <HeaderWrapper>
            <LeftImage src = "/logo.png" alt = "popcorn"/>
            <RightImage src = "/movie.png" alt = "movie"/>
        </HeaderWrapper>
    )
}
export default Header;
