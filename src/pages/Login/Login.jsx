import React from 'react';
import {Hero} from '~/components';
import MailIcon from 'react-feather/dist/icons/mail';
import LockIcon from 'react-feather/dist/icons/lock';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {loginWithEmailAndPassword} from '~/store/actions/auth';
import {bindAll} from '~/util';

class LoginForm extends React.Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: ''
        };

        bindAll(this, [
            'onSubmit',
            {
                onEmailChange: ['onChange', 'email'],
                onPasswordChange: ['onChange', 'password']
            }
        ]);
    }

    onSubmit(e) {
        e.preventDefault();
        this.props.onFormSubmit(this.state.email, this.state.password);
    }

    onChange(prop, e) {
        this.setState({
            [prop]: e.target.value
        });
    }

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <div className="field">
                    <p className="control has-icons-left has-icons-right">
                        <input
                            className="input"
                            type="email"
                            placeholder="Email"
                            value={this.state.email}
                            onChange={this.onEmailChange}
                        />
                        <span className="icon is-small is-left">
                            <MailIcon />
                        </span>
                    </p>
                </div>
                <div className="field">
                    <p className="control has-icons-left">
                        <input
                            className="input"
                            type="password"
                            placeholder="Password"
                            value={this.state.password}
                            onChange={this.onPasswordChange}
                        />
                        <span className="icon is-small is-left">
                            <LockIcon />
                        </span>
                    </p>
                </div>
                <div className="field">
                    <p className="control">
                        <button className="button is-success">Login</button>
                    </p>
                </div>
            </form>
        );
    }
}
LoginForm.propTypes = {
    onFormSubmit: PropTypes.func
};

class Login extends React.Component {
    render() {
        return (
            <main>
                <Hero title="gabgab" />
                <section className="section">
                    <div className="columns is-centered">
                        <div className="column is-5">
                            <LoginForm
                                onFormSubmit={this.props.loginWithEmailAndPassword.bind(
                                    this
                                )}
                            />
                        </div>
                    </div>
                </section>
            </main>
        );
    }
}

Login.propTypes = {
    loginWithEmailAndPassword: PropTypes.func,
    isLoggedIn: PropTypes.bool
};

const mapStateToProps = state => ({
    isLoggedIn: !!state.auth.user
});

const mapDispatchToProps = dispatch => ({
    loginWithEmailAndPassword: (email, password) =>
        dispatch(loginWithEmailAndPassword(email, password))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);
