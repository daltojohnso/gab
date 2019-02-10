import React from 'react';
import {MainView, FooView} from '~/pages';
import {Route} from 'react-router-dom';

const NavView = () => (
    <React.Fragment>
        <Route exact path="/foo" component={FooView} />
        <Route exact path="/" component={MainView} />
        <Route exact path="/map/:mapId" component={MainView} />
        <Route exact path="/map/:mapId/note/:noteId" component={MainView} />
    </React.Fragment>
);

export default NavView;
