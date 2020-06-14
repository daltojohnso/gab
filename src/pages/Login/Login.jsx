import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { loginWithEmailAndPassword } from '~/store/actions/auth';

const LoginForm = ({ onFormSubmit }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const onSubmit = async e => {
        e.preventDefault();
        setError('');

        try {
            await onFormSubmit(email, password);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="w-full max-w-xs">
            <form
                className="bg-white sm:shadow-md rounded px-8 pt-6 pb-8 mb-4"
                onSubmit={onSubmit}
                action="login"
                method="post"
            >
                <div className="mb-4">
                    <label
                        className="block text-grey-darker text-sm font-bold mb-2"
                        htmlFor="email"
                    >
                        Email
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline"
                        id="email"
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <div className="mb-6">
                    <label
                        className="block text-grey-darker text-sm font-bold mb-2"
                        htmlFor="password"
                    >
                        Password
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        id="password"
                        type="password"
                        placeholder="******************"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <p className="text-red text-xs italic">{error}</p>
                </div>
                <div className="flex items-center justify-between">
                    <button
                        className="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        Sign In
                    </button>
                </div>
            </form>
        </div>
    );
};
LoginForm.propTypes = {
    onFormSubmit: PropTypes.func
};

const Login = () => {
    const dispatch = useDispatch();
    const login = useCallback(
        (email, password) => {
            dispatch(loginWithEmailAndPassword(email, password));
        },
        [dispatch]
    );
    return (
        <main className="w-screen flex justify-center py-16">
            <LoginForm onFormSubmit={login} />
        </main>
    );
};

export default Login;
