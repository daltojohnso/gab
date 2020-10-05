import styled from 'styled-components';

const Spinner = styled.span`
    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }

        100% {
            transform: rotate(360deg);
        }
    }

    height: ${props => props.size || '25px'};
    width: ${props => props.size || '25px'};
    animation-duration: 0.6s;
    animation-iteration-count: infinite;
    animation-name: spin;
    animation-timing-function: linear;
    border: ${props => props.border || '4px solid #fff'};
    border-right-color: transparent;
    border-radius: 50%;
    display: inline-block;
`;

export default Spinner;
