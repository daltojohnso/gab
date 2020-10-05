import React, { useMemo } from 'react';
import { Timestamp } from '~/firebase';
import { useSelector } from 'react-redux';
import format from 'date-fns/format';
import Editor from './Editor.jsx';
import Maximize2Icon from 'react-feather/dist/icons/maximize-2';
import UserIcon from 'react-feather/dist/icons/user';
import CrosshairIcon from 'react-feather/dist/icons/crosshair';
import { getEditorStateFromNote } from '~/util';

const NoteCard = ({ note }) => {
    const { createdAt, createdBy } = note;
    const date = new Timestamp(
        createdAt.seconds,
        createdAt.nanoseconds
    ).toDate();
    const formattedDate = format(date, 'PP');
    const user = useSelector(state => state.users.byId[createdBy]);

    const editorState = useMemo(() => {
        return getEditorStateFromNote(note);
    }, [note]);

    return (
        <div
            style={{ minWidth: '300px' }}
            className="note flex-1 truncate m-2 rounded border border-1 border-grey"
        >
            <div className="m-2">
                <div
                    tabIndex="0"
                    className="p-2 mb-2 h-64 relative max-h-full overflow-auto"
                >
                    <Editor editorState={editorState} readOnly />
                </div>
                <div className="border-t border-1 pt-2 px-1 flex justify-between">
                    <div className="flex items-center">
                        <UserIcon className="h-5 mr-1" />
                        <span className="flex-1">
                            {user ? `${user.displayName},` : ''} {formattedDate}
                        </span>
                    </div>
                    <div className="flex items-center">
                        <button className="mr-1">
                            <CrosshairIcon className="h-5" />
                        </button>
                        <button>
                            <Maximize2Icon className="h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoteCard;
