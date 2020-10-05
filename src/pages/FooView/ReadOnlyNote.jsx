
import React, {useState, useEffect} from 'react';
// import classnames from 'classnames';
// import EditIcon from 'react-feather/dist/icons/edit';
// import CloseIcon from 'react-feather/dist/icons/x-circle';
// import TrashIcon from 'react-feather/dist/icons/trash-2';
// import MoveIcon from 'react-feather/dist/icons/map-pin';
// import FocusIcon from 'react-feather/dist/icons/crosshair';
import {
    Editor,
    EditorState,
    ContentState,
    convertFromRaw
} from 'draft-js';
import 'draft-js/dist/Draft.css';
import styled from 'styled-components';

const EditorWrapper = styled.div`
    > .DraftEditor-root {
        height: 100%;
    }
`;

function getEditorState (note) {
    let contentState;
    if (note) {
        if (note.editorState) return note.editorState;

        try {
            contentState = convertFromRaw(note.rawMessage);
        } catch (err) {
            contentState = ContentState.createFromText(note.message || '');
        }
    }

    return contentState
        ? EditorState.createWithContent(contentState)
        : EditorState.createEmpty();
}

const EMPTY_EDITOR = EditorState.createEmpty();

const ReadOnlyNote = ({ note }) => {
    const [editorState, setEditorState] = useState(EMPTY_EDITOR);

    useEffect(() => {
        setEditorState(getEditorState(note));
    }, [note]);

    return (
        <Editor
            className="h-full"
            readOnly
            editorState={editorState}
        />
    );
};

export default ReadOnlyNote;
