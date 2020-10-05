import React from 'react';
import { EDITOR_STATES } from '~/util';

const Footer = ({ state, onClick }) => {
    switch (state) {
        case EDITOR_STATES.edit:
            return (
                <button className="m-1 px-4 py-2 text-grey-darkest">
                    Edit note?
                </button>
            );
        case EDITOR_STATES.delete:
            return (
                <button className="m-1 px-4 py-2 text-grey-darkest">
                    Delete note?
                </button>
            );
        case EDITOR_STATES.confirmDelete:
            return (
                <button
                    className="m-1 px-4 py-2 hover:bg-grey-lighter text-grey-darkest active:bg-grey-light"
                    onClick={() => onClick(EDITOR_STATES.confirmDelete)}
                >
                    Click here to delete
                </button>
            );
        case EDITOR_STATES.move:
            return (
                <button className="m-1 px-4 py-2 text-grey-darkest">
                    Move note?
                </button>
            );
        case EDITOR_STATES.saveNewLocation:
            return (
                <button
                    className="m-1 px-4 py-2 hover:bg-grey-lighter text-grey-darkest active:bg-grey-light"
                    onClick={() => onClick(EDITOR_STATES.saveNewLocation)}
                >
                    Save new location
                </button>
            );
        case EDITOR_STATES.focus:
            return (
                <button className="m-1 px-4 py-2 text-grey-darkest">
                    Zoom in?
                </button>
            );
        case EDITOR_STATES.close:
            return (
                <button className="m-1 px-4 py-2 text-grey-darkest">
                    Close note?
                </button>
            );
        case EDITOR_STATES.closeEdited:
            return (
                <button className="m-1 px-4 py-2 text-grey-darkest">
                    Close note without saving?
                </button>
            );
        case EDITOR_STATES.confirmClose:
            return (
                <button
                    className="m-1 px-4 py-2 hover:bg-grey-lighter text-grey-darkest active:bg-grey-light"
                    onClick={() => onClick(EDITOR_STATES.confirmClose)}
                >
                    Click here to close
                </button>
            );
        case EDITOR_STATES.empty:
            return null;
        default:
            return (
                <button
                    className="m-1 px-4 py-2 hover:bg-grey-lighter text-grey-darkest active:bg-grey-light"
                    onClick={() => onClick(EDITOR_STATES.save)}
                >
                    Save
                </button>
            );
    }
};

export default Footer;
