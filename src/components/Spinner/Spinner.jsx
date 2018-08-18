import React from 'react';
import styled from 'styled-components';

// animation: move ${speed} infinite ease-in-out;
const SpinnerDiv = styled.div`
    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }

        100% {
            transform: rotate(360deg);
        }
    }

    height: 25px;
    width: 25px;
    animation-duration: 0.6s;
    animation-iteration-count: infinite;
    animation-name: spin;
    animation-timing-function: linear;
    size: 30px;
    border: 4px solid #fff;
    border-right-color: transparent;
    border-radius: 50%;
    display: inline-block;
`;

class Spinner extends React.PureComponent {
    render () {
        return <SpinnerDiv />;
    }
}

export default Spinner;
