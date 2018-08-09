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
    children: PropTypes.object
};

export const OnIcon = ({on, ...props}) => (
    <Icon
        onClick={() => on('onClick')}
        onMouseOver={() => on('onMouseOver')}
        onMouseOut={() => on('onMouseOut')}
        {...props}
    />
);

OnIcon.propTypes = {
    on: PropTypes.func
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
    children: PropTypes.string
};
