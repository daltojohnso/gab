import React from 'react';
import {NavBar} from '~/components';
import {MainView} from '~/pages';
import {Route} from 'react-router-dom';
import styled from 'styled-components';

const Main = styled.main`
    height: calc(100% - 52px);
    width: 100%;
`;

const NavView = () => (
    <React.Fragment>
        <NavBar />
        <Main>
            <Route exact path="/" component={MainView} />
            <Route exact path="/map/:mapId" component={MainView} />
        </Main>
    </React.Fragment>
);

export default NavView;
