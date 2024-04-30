import styled from "styled-components";

{/*
* This is the Button in nav bar for movie details page
* and will bring us back to movie craft page.
*/}
const NavButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    background: lightgrey;
    color: black;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    font-size: calc(8px + 1vmin);
`;

export default NavButton;