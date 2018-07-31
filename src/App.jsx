import React from 'react';
import {connect} from 'react-redux';
import {Login, NavView} from '~/pages';
import PropTypes from 'prop-types';
import {
    BrowserRouter as Router,
    Route,
    Redirect,
    Switch
} from 'react-router-dom';

const Authed = ({component: Component, isLoggedIn, ...rest}) => (
    <Route
        {...rest}
        render={p =>
            isLoggedIn ? (
                <Component {...p} />
            ) : (
                <Redirect
                    to={{pathname: '/login', state: {from: p.location}}}
                />
            )
        }
    />
);
Authed.propTypes = {
    component: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    isLoggedIn: PropTypes.bool
};

const Unauthed = ({component: Component, isLoggedIn, ...rest}) => (
    <Route
        {...rest}
        render={p =>
            isLoggedIn ? (
                <Redirect to={{pathname: '/', state: {from: p.location}}} />
            ) : (
                <Component {...p} />
            )
        }
    />
);
Unauthed.propTypes = {
    component: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    isLoggedIn: PropTypes.bool
};

class App extends React.Component {
    render() {
        return this.props.isReady ? (
            <Router>
                <div>
                    <Switch>
                        <Unauthed
                            exact
                            path="/login"
                            component={Login}
                            isLoggedIn={this.props.isLoggedIn}
                        />
                        <Authed
                            path="/"
                            component={NavView}
                            isLoggedIn={this.props.isLoggedIn}
                        />
                    </Switch>
                </div>
            </Router>
        ) : null;
    }
}

App.propTypes = {
    isReady: PropTypes.bool,
    isLoggedIn: PropTypes.bool
};

const mapStateToProps = state => ({
    isReady: state.auth.isReady,
    isLoggedIn: !!state.auth.user
});

export default connect(mapStateToProps)(App);
