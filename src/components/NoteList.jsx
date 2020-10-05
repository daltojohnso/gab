import React from 'react';
import NoteCard from './NoteCard.jsx';
import classnames from 'classnames';

const NoteList = ({ notes, className }) => {
    return (
        <div className={classnames(className)}>
            {notes.map(note => (
                <NoteCard note={note} key={note.id}></NoteCard>
            ))}
        </div>
    );
};

export default NoteList;
