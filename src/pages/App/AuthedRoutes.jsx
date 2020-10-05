import React from 'react';
import { FooView, MapCardView, MapView } from '~/pages';
import { Route } from 'react-router-dom';

const AuthedRoutes = () => (
    <>
        <Route exact path="/foo/:mapId" component={FooView} />
        <Route exact path="/foo" component={FooView} />
        <Route exact path="/map" component={MapCardView} />
        <Route exact path={['/map/:mapId', '/map/:mapId/note/:noteId']}>
            <MapView />
        </Route>
        <Route exact path="/">
            <MapCardView />
        </Route>
    </>
);

export default AuthedRoutes;
