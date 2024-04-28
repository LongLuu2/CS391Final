import React from 'react';
import styled from "styled-components";
import { NavLink } from 'react-router-dom';

const Styledbubble = styled.div`
    position: absolute;
    left: calc(30% + 10px); 
    padding: 10px;
    border: 1px solid black;
    border-radius: 10px;
    margin-left: 10px;
    transform: translateX(-50%); /
    background-color: #fff; 
    z-index: 1; 
`;

const BubbleNav = ({ movieTitle }) => {
    return (
        <div> 
            <Styledbubble>
                <NavLink to={{ pathname: '/Movies', search: `?movieName=${movieTitle}` }}>
                    details
                </NavLink>
            </Styledbubble>
        </div>
    );
}

export default BubbleNav;