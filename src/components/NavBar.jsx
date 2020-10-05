import React from 'react';
import PropTypes from 'prop-types';
import UserButton from './UserButton.jsx';
import Loader from './Loader.jsx';
import MapIcon from 'react-feather/dist/icons/map';
import BookOpenIcon from 'react-feather/dist/icons/book-open';
import { useSelector } from 'react-redux';
import classnames from 'classnames';

function useAppStatus () {
    const mapsStatus = useSelector(state => state.maps.status);
    const notesStatus = useSelector(state => state.notes.status);
    const usersStatus = useSelector(state => state.users.status);
    const map = new Map([
        [mapsStatus, mapsStatus],
        [notesStatus, notesStatus],
        [usersStatus, usersStatus]
    ]);
    return map.get('rejected') || map.get('loading') || map.get('resolved');
}

const Header1 = ({ children }) => (
    <h1 className="text-3xl my-2 ml-4 flex items-center">{children}</h1>
);

const NavBar = ({ header }) => {
    const status = useAppStatus();
    return (
        <div
            className={classnames(
                'justify-between bg-white shadow relative w-screen h-auto z-500 flex'
            )}
        >
            <Header1>mappy-map {header ? ` / ${header}` : ''}</Header1>
            <div className="flex">
                {status === 'loading' && (
                    <div className="cursor-pointer m-3 w-10 h-10 shadow-md border border-grey-dark rounded-full bg-white flex justify-center items-center">
                        <Loader className="text-grey-dark" />
                    </div>
                )}
                {false && (
                    <div className="cursor-pointer m-3 w-10 h-10 shadow-md border border-pink rounded-full bg-white flex justify-center items-center">
                        <BookOpenIcon className="w-7 h-7 text-pink" />
                    </div>
                )}
                {false && (
                    <div className="cursor-pointer m-3 w-10 h-10 shadow-md border border-teal bg-white rounded-full flex justify-center items-center">
                        <MapIcon className="w-7 h-7 text-teal" />
                    </div>
                )}
                <UserButton className="m-3" />
            </div>
        </div>
    );
};

NavBar.propTypes = {
    children: PropTypes.object,
    header: PropTypes.string
};

export default NavBar;
