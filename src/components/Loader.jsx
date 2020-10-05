import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import LoaderIcon from 'react-feather/dist/icons/loader';
import classnames from 'classnames';

const Rotate = styled.div`
    animation: spin 2s linear infinite;

    @keyframes spin {
        100% {
            transform: rotate(360deg);
        }
    }
`;

const Loader = ({className}) => (
    <Rotate className="leading-zero inline-block">
        <LoaderIcon className={classnames('w-7 h-7 text-black', className)} />
    </Rotate>
);

Loader.propTypes = {
    className: PropTypes.string
};


export default Loader;
