import React from 'react';
import PropTypes from 'prop-types';
import {UserButton, Spinner} from '~/components';
import styled from 'styled-components';

const Nav = styled.nav`
    &.navbar {
        z-index: 500;
    }
`;

const NavBar = ({isLoading, isRejected}) => (
    <Nav className="navbar is-dark">
        <div className="navbar-brand">
            <div className="navbar-item">
                <a>
                    <h1 className="title has-text-white">gab</h1>
                </a>
            </div>
            {isLoading && (
                <div className="navbar-item">
                    <Spinner></Spinner>
                </div>
            )}
            {isRejected && (
                <div className="navbar-item">
                    Something went wrong...
                </div>
            )}
            <a style={{visibility: 'hidden'}} className="navbar-burger has-text-white">
                <span aria-hidden="true" />
                <span aria-hidden="true" />
                <span aria-hidden="true" />
            </a>
            <UserButton className="navbar-item is-hidden-desktop" />
        </div>
        <div className="navbar-menu">
            <div className="navbar-end">
                <UserButton className="navbar-item is-hidden-touch" />
            </div>
        </div>
    </Nav>
);

NavBar.propTypes = {
    isLoading: PropTypes.bool,
    isRejected: PropTypes.bool
};

NavBar.defaultProps = {
    isLoading: false,
    isRejected: false
};

export default NavBar;
