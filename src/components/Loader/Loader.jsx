import React from 'react';
import styled from 'styled-components';

const speed = '2.0s';
const spacing = 50;
const LoaderDiv = styled.div`
    .cs-loader {
        height: 100%;
        width: 100%;
    }

    .cs-loader-inner {
        color: #000;
    }

    .cs-loader-inner label {
        font-size: 0.5rem;
        opacity: 0;
        display: inline-block;
    }

    @keyframes move {
        0% {
            opacity: 0;
            transform: translateX(-300px);
        }
        33% {
            opacity: 1;
            transform: translateX(0px);
        }
        66% {
            opacity: 1;
            transform: translateX(0px);
        }
        100% {
            opacity: 0;
            transform: translateX(300px);
        }
    }

    @-webkit-keyframes move {
        0% {
            opacity: 0;
            -webkit-transform: translateX(-300px);
        }
        33% {
            opacity: 1;
            -webkit-transform: translateX(0px);
        }
        66% {
            opacity: 1;
            -webkit-transform: translateX(0px);
        }
        100% {
            opacity: 0;
            -webkit-transform: translateX(300px);
        }
    }

    .cs-loader-inner label:nth-child(6) {
        -webkit-animation: move ${speed} infinite ease-in-out;
        animation: move ${speed} infinite ease-in-out;
    }

    .cs-loader-inner label:nth-child(5) {
        -webkit-animation: move ${speed} ${spacing}ms infinite ease-in-out;
        animation: move ${speed} ${spacing}ms infinite ease-in-out;
    }

    .cs-loader-inner label:nth-child(4) {
        -webkit-animation: move ${speed} ${spacing * 2}ms infinite ease-in-out;
        animation: move ${speed} ${spacing * 2}ms infinite ease-in-out;
    }

    .cs-loader-inner label:nth-child(3) {
        -webkit-animation: move ${speed} ${spacing * 3}ms infinite ease-in-out;
        animation: move ${speed} ${spacing * 3}ms infinite ease-in-out;
    }

    .cs-loader-inner label:nth-child(2) {
        -webkit-animation: move ${speed} ${spacing * 4}ms infinite ease-in-out;
        animation: move ${speed} ${spacing * 4}ms infinite ease-in-out;
    }

    .cs-loader-inner label:nth-child(1) {
        -webkit-animation: move ${speed} ${spacing * 5}ms infinite ease-in-out;
        animation: move ${speed} ${spacing * 5}ms infinite ease-in-out;
    }
`;

class Loader extends React.PureComponent {
    render () {
        return (
            <LoaderDiv className="cs-loader">
                <div className="cs-loader-inner">
                    <label> ●</label>
                    <label> ●</label>
                    <label> ●</label>
                    <label> ●</label>
                    <label> ●</label>
                    <label> ●</label>
                </div>
            </LoaderDiv>
        );
    }
}

export default Loader;
