import React from 'react';
import {NavBar} from '~/components';
import {Foo} from '~/pages';
import {Route} from 'react-router-dom';

const NavView = () => (
    <div>
        <NavBar />
        <Route exact path="/" component={Foo} />
    </div>
);

export default NavView;
