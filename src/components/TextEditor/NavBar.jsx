import React from 'react';
import PropTypes from 'prop-types';
import {UserButton, Loader} from '~/components';
import MapIcon from 'react-feather/dist/icons/map';
import BookOpenIcon from 'react-feather/dist/icons/book-open';

const NavBar = ({isLoading}) => (
    <div className="bg-transparent fixed w-screen h-auto z-500 flex justify-end">
        {isLoading && (
            <div className="cursor-pointer m-3 w-10 h-10 shadow-md border border-grey-dark rounded-full bg-white flex justify-center items-center">
                <Loader className="text-grey-dark"/>
            </div>
        )}
        <div className="cursor-pointer m-3 w-10 h-10 shadow-md border border-pink rounded-full bg-white flex justify-center items-center">
            <BookOpenIcon className="w-7 h-7 text-pink" />
        </div>
        <div className="cursor-pointer m-3 w-10 h-10 shadow-md border border-teal bg-white rounded-full flex justify-center items-center">
            <MapIcon className="w-7 h-7 text-teal" />
        </div>
        <UserButton className="m-3" />
    </div>
);

NavBar.propTypes = {
    isLoading: PropTypes.bool,
    isRejected: PropTypes.bool
};

export default NavBar;
