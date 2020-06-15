import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { LoginView } from '~/pages';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { loginAnonymously } from '~/store/actions/auth';
import { AuthedRerouter, UnauthedRerouter } from './AuthRerouter.jsx';
import AuthedRoutes from './AuthedRoutes.jsx';

const App = () => {
    const isReady = useSelector(store => store.auth.isReady);
    const isLoggedIn = useSelector(store => !!store.auth.user);
    const dispatch = useDispatch();

    if (window.location.pathname === '/anon') {
        dispatch(loginAnonymously());
    }

    return isReady ? (
        <Router>
            <Switch>
                <UnauthedRerouter
                    exact
                    path="/login"
                    component={LoginView}
                    isLoggedIn={isLoggedIn}
                />
                <UnauthedRerouter
                    exact
                    path="/anon"
                    component={LoginView}
                    isLoggedIn={isLoggedIn}
                    isAnon={true}
                />
                <AuthedRerouter
                    path="/"
                    component={AuthedRoutes}
                    isLoggedIn={isLoggedIn}
                />
            </Switch>
        </Router>
    ) : null;
};

App.propTypes = {
    isReady: PropTypes.bool,
    isLoggedIn: PropTypes.bool
};

export default App;
