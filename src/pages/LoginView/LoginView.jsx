import React, { useCallback } from 'react';
import LoginForm from './LoginForm.jsx';
import { useDispatch } from 'react-redux';
import { loginWithEmailAndPassword } from '~/store/actions/auth';

const Login = () => {
    const dispatch = useDispatch();
    const login = useCallback(
        (email, password) => {
            return dispatch(loginWithEmailAndPassword(email, password));
        },
        [dispatch]
    );
    return (
        <main className="w-screen flex justify-center py-16">
            <div className="w-full max-w-xs">
                <LoginForm onFormSubmit={login} />
            </div>
        </main>
    );
};

export default Login;
