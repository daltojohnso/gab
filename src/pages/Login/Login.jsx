import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {loginWithEmailAndPassword, loginAnonymously} from '~/store/actions/auth';
import {bindAll} from '~/util';

class LoginForm extends React.Component {
    constructor (props) {
        super(props);

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

    async onSubmit (e) {
        e.preventDefault();
        this.setState({
            error: ''
        });

        try {
            await this.props.onFormSubmit(this.state.email, this.state.password);
        } catch (e) {
            this.setState({
                error: e.message
            });
        }
    }

    onChange (prop, e) {
        this.setState({
            [prop]: e.target.value
        });
    }

    render () {
        const error = this.state.error;
        return (
            <div className="w-full max-w-xs">
                <form className="bg-white sm:shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={this.onSubmit} action="login" method="post">
                    <div className="mb-4">
                        <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="email">
                                Email
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline"
                            id="email"
                            type="text"
                            placeholder="Email"
                            value={this.state.email}
                            onChange={this.onEmailChange} />
                    </div>
                    <div className="mb-6">
                        <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="password">
                                Password
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            id="password"
                            type="password"
                            placeholder="******************"
                            value={this.state.password}
                            onChange={this.onPasswordChange} />
                        <p className="text-red text-xs italic">{error}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <button className="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                                Sign In
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}
LoginForm.propTypes = {
    onFormSubmit: PropTypes.func
};

class Login extends React.Component {
    constructor (props) {
        super(props);

        if (props.isAnon) {
            props.loginAnonymously();
        }
    }

    render () {
        return (
            <main className="w-screen flex justify-center py-16">
                <LoginForm
                    onFormSubmit={this.props.loginWithEmailAndPassword.bind(
                        this
                    )}
                />
            </main>
        );
    }
}

Login.propTypes = {
    loginWithEmailAndPassword: PropTypes.func,
    loginAnonymously: PropTypes.func,
    isLoggedIn: PropTypes.bool,
    isAnon: PropTypes.bool
};

const mapStateToProps = state => ({
    isLoggedIn: !!state.auth.user
});

const mapDispatchToProps = dispatch => ({
    loginWithEmailAndPassword: (email, password) =>
        dispatch(loginWithEmailAndPassword(email, password)),
    loginAnonymously: () => {
        dispatch(loginAnonymously());
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);
