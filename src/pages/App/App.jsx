import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Login, NavView } from '~/pages';
import PropTypes from 'prop-types';
import {
    BrowserRouter as Router,
    Route,
    Redirect,
    Switch
} from 'react-router-dom';
import { loginAnonymously } from '~/store/actions/auth';

const Authed = ({ component: Component, isLoggedIn, ...rest }) => (
    <Route
        {...rest}
        render={p =>
            isLoggedIn ? (
                <Component {...p} />
            ) : (
                <Redirect
                    to={{ pathname: '/login', state: { from: p.location } }}
                />
            )
        }
    />
);
Authed.propTypes = {
    component: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    isLoggedIn: PropTypes.bool
};

const Unauthed = ({ component: Component, isLoggedIn, isAnon, ...rest }) => (
    <Route
        {...rest}
        render={p =>
            isLoggedIn ? (
                <Redirect to={{ pathname: '/', state: { from: p.location } }} />
            ) : (
                <Component {...p} isAnon={isAnon} />
            )
        }
    />
);
Unauthed.propTypes = {
    component: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    isLoggedIn: PropTypes.bool,
    isAnon: PropTypes.bool
};

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
                <Unauthed
                    exact
                    path="/login"
                    component={Login}
                    isLoggedIn={isLoggedIn}
                />
                <Unauthed
                    exact
                    path="/anon"
                    component={Login}
                    isLoggedIn={isLoggedIn}
                    isAnon={true}
                />
                <Authed path="/" component={NavView} isLoggedIn={isLoggedIn} />
            </Switch>
        </Router>
    ) : null;
};

App.propTypes = {
    isReady: PropTypes.bool,
    isLoggedIn: PropTypes.bool
};

export default App;
