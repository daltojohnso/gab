import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

export const Card = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

export const CardContent = styled.div`
    flex: 1;

    > .DraftEditor-root {
        height: 100%;
    }
`;

export const Icon = ({label, children, ...props}) => (
    <a {...props} href="#" aria-label={label} className="card-header-icon">
        <span className="icon">{children}</span>
    </a>
);

Icon.propTypes = {
    label: PropTypes.string,
    children: PropTypes.any
};

export const FooterItem = ({link, children, ...props}) => {
    return link ? (
        <a {...props} href="#" className="card-footer-item">
            {children}
        </a>
    ) : (
        <div {...props} className="card-footer-item">
            {children}
        </div>
    );
};

FooterItem.propTypes = {
    link: PropTypes.bool,
    children: PropTypes.any
};

const speed = '2.0s';
const spacing = 50;
const Loader = styled.div`
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

export const LoaderFooter = (
    <FooterItem>
        <Loader className="cs-loader">
            <div className="cs-loader-inner">
                <label> ●</label>
                <label> ●</label>
                <label> ●</label>
                <label> ●</label>
                <label> ●</label>
                <label> ●</label>
            </div>
        </Loader>
    </FooterItem>
);
