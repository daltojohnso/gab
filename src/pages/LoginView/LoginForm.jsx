import React, { useState } from 'react';
import PropTypes from 'prop-types';

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
        <form
            className="bg-white sm:shadow-md rounded px-8 pt-4 pb-8 mb-4 text-grey-darker border border-1 border-grey-light"
            onSubmit={onSubmit}
            action="login"
            method="post"
        >
            <h2 className="text-2xl mb-2">mappy-map login</h2>
            <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="email">
                    Email
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                    id="email"
                    type="text"
                    placeholder="Email"
                    value={email}
                    autoComplete="email"
                    onChange={e => setEmail(e.target.value)}
                />
            </div>
            <div className="mb-6">
                <label
                    className="block text-sm font-bold mb-2"
                    htmlFor="password"
                >
                    Password
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    id="password"
                    type="password"
                    placeholder="******************"
                    value={password}
                    autoComplete="current-password"
                    onChange={e => setPassword(e.target.value)}
                />
                <p className="text-red text-xs italic">{error}</p>
            </div>
            <button
                className="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
            >
                Sign In
            </button>
        </form>
    );
};
LoginForm.propTypes = {
    onFormSubmit: PropTypes.func
};

export default LoginForm;
