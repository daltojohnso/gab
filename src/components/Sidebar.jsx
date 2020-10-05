import React from 'react';
import classnames from 'classnames';
import NoteList from './NoteList.jsx';

const Sidebar = ({ className }) => {
    return (
        <div
            className={classnames(
                className,
                'shadow bg-white h-full overflow-auto'
            )}
        >
            <NoteList />
        </div>
    );
};

export default Sidebar;
