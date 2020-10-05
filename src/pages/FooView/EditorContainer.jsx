// import React from 'react';
// import { Editor, EditorState, RichUtils } from 'draft-js';
// import 'draft-js/dist/Draft.css';
//
// const EMPTY_EDITOR = EditorState.createEmpty();
//
// const TextEditor = ({ editorState = EMPTY_EDITOR, onChange, isReadOnly }) => {
//     const handleKeyCommand = (command, editorState) => {
//         const newState = RichUtils.handleKeyCommand(editorState, command);
//         if (newState) {
//             onChange(newState);
//             return 'handled';
//         }
//         return 'not-handled';
//     };
//
//     return (
//         <Editor
//             className="h-full"
//             readOnly={isReadOnly}
//             editorState={editorState}
//             onChange={onChange}
//             handleKeyCommand={handleKeyCommand}
//             placeholder="Write a note"
//         />
//     );
// };
//
// export default TextEditor;
