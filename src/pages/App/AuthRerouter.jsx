import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

export const AuthedRerouter = ({
    component: Component,
    isLoggedIn,
    ...rest
}) => (
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
AuthedRerouter.propTypes = {
    component: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    isLoggedIn: PropTypes.bool
};

export const UnauthedRerouter = ({
    component: Component,
    isLoggedIn,
    isAnon,
    ...rest
}) => (
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
UnauthedRerouter.propTypes = {
    component: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    isLoggedIn: PropTypes.bool,
    isAnon: PropTypes.bool
};
