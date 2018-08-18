import React from 'react';
import PropTypes from 'prop-types';
import {UserButton, Spinner} from '~/components';
import styled from 'styled-components';

const Nav = styled.nav`
    &.navbar {
        z-index: 500;
    }
`;

const NavBar = ({isLoading}) => (
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
        </div>
        <div className="navbar-menu">
            <div className="navbar-end">
                <UserButton className="navbar-item" />
            </div>
        </div>
    </Nav>
);

NavBar.propTypes = {
    isLoading: PropTypes.bool
};

NavBar.defaultProps = {
    isLoading:false
};

export default NavBar;
