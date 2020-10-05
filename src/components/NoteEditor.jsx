import React, { useMemo } from 'react';
import Editor from './Editor.jsx';
import 'draft-js/dist/Draft.css';
import { getEditorStateFromNote } from '~/util';

const NoteEditor = ({ note, ...editorProps }) => {
    const editorState = useMemo(() => {
        return getEditorStateFromNote(note);
    }, [note]);

    return <Editor editorState={editorState} {...editorProps} />;
};

export default NoteEditor;
