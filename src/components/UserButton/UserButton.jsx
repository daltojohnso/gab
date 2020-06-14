import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import UserIcon from 'react-feather/dist/icons/user';
import { useSelector, useDispatch } from 'react-redux';
import { signOut } from '~/store/actions/auth';

const UserButton = ({ className }) => {
    const [isActive, setIsActive] = useState(false);
    const user = useSelector(state => state.auth.user);
    const dispatch = useDispatch();

    const onSignOut = () => {
        dispatch(signOut());
    };

    const onToggle = () => {
        setIsActive(isActive => !isActive);
    };

    const onBlur = () => {
        // lets the next focus event fire before closing the dropdown
        setTimeout(() => {
            setIsActive(() => false);
        });
    };

    const onFocus = () => {
        // puts the focus event AFTER the state setting in `onBlur`
        // so that we can keep the dropdown open when focus is on the sign out button.
        setTimeout(() => {
            setIsActive(() => true);
        });
    };

    const onKeyUpToggle = e => {
        const key = e.key;
        setIsActive(isActive => {
            switch (key) {
                case 'Enter':
                    return !isActive;
                case 'Escape':
                    return false;
                default:
                    return isActive;
            }
        });
    };

    const onKeyUpSignOut = e => {
        const { key } = e;
        if (key === 'Enter') {
            onSignOut();
        } else if (key === 'Escape') {
            setIsActive(false);
        }
    };

    return (
        <div className={classnames('relative', className)}>
            <div
                className="cursor-pointer w-10 h-10 shadow-md border border-indigo rounded-full bg-white flex justify-center items-center"
                tabIndex="0"
                onClick={onToggle}
                onKeyUp={onKeyUpToggle}
                onBlur={onBlur}
            >
                <UserIcon className="h-7 w-7 text-indigo" />
            </div>
            <div
                className={classnames(
                    { hidden: !isActive },
                    'absolute inset-auto right-0 bg-white opacity-90 shadow rounded border overflow-hidden mt-1'
                )}
            >
                <div className="p-4 border border-t-0 border-r-0 border-l-0 border-b-1 w-full">
                    {user.displayName || user.email}
                </div>
                <a
                    className="m-1 p-3 hover:bg-grey-lighter text-black block w-auto"
                    tabIndex="0"
                    onClick={onSignOut}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onKeyUp={onKeyUpSignOut}
                >
                    Sign out
                </a>
            </div>
        </div>
    );
};

UserButton.propTypes = {
    className: PropTypes.string
};

export default UserButton;
