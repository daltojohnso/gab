import React from 'react';
import {NavBar} from '~/components';
import {MainView} from '~/pages';
import {Route} from 'react-router-dom';

const NavView = () => (
    <React.Fragment>
        <NavBar />
        <main style={{width: '100%', height: 'calc(100% - 52px)'}}>
            <Route exact path="/" component={MainView} />
        </main>
    </React.Fragment>
);

export default NavView;
