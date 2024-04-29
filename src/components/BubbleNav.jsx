import React from 'react';
import styled from "styled-components";
import { NavLink } from 'react-router-dom';

const Styledbubble = styled.div`
    position: absolute;
    left: 18%; 
    padding: 5px;
    border-left: 2px solid grey;
    border-right: 2px solid grey;
    border-bottom: 2px solid grey;
    border-radius: 0 0 5px 5px;
    z-index: 1; 
    background-color: #f0f0f0;
`;

const StyledP = styled.p `
    color: black;
    &:hover {
        color: blue;
        text-decoration: none;
    }
`;

const StyledNavLink = styled(NavLink)`
    text-decoration: none;
`;


const BubbleNav = ({ movieTitle }) => {
    return (
        <div> 
            <Styledbubble>
                <StyledNavLink to={{ pathname: '/Movies', search: `?movieName=${movieTitle}`}}>
                    <StyledP>more details</StyledP>
                </StyledNavLink>
            </Styledbubble>
        </div>
    );
}

export default BubbleNav;