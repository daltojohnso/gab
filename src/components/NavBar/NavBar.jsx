import React from 'react';
import {UserButton} from '~/components';
import styled from 'styled-components';

const Nav = styled.nav`
    &.navbar {
        z-index: 500;
    }
`;

const NavBar = () => (
    <Nav className="navbar is-dark">
        <div className="navbar-brand">
            <div className="navbar-item">
                <a>
                    <h1 className="title has-text-white">gab</h1>
                </a>
            </div>
        </div>
        <div className="navbar-menu">
            <div className="navbar-end">
                <UserButton className="navbar-item" />
            </div>
        </div>
    </Nav>
);

export default NavBar;
