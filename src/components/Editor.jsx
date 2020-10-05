import React from 'react';
import { Editor, RichUtils } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { EMPTY_EDITOR_STATE } from '~/util';
import styled from 'styled-components';

const EditorWrapper = styled.div`
    height: 100%;

    .DraftEditor-root {
        padding: 1rem;
        height: 100%;
    }
`;

// "TextEditor wrapper" lives here?
// all TextEditor does is trigger onChange to set text/note
// no need to shove things into anotehr component, maybe.

const TextEditor = ({
    editorState = EMPTY_EDITOR_STATE,
    onChange,
    ...editorProps
}) => {
    const handleKeyCommand = (command, editorState) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            onChange(newState);
            return 'handled';
        }
        return 'not-handled';
    };

    return (
        <EditorWrapper>
            <Editor
                editorState={editorState}
                onChange={onChange}
                handleKeyCommand={handleKeyCommand}
                placeholder="Write a note"
                {...editorProps}
            />
        </EditorWrapper>
    );
};

export default TextEditor;
