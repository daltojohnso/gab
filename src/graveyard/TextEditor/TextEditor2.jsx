import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import EditIcon from 'react-feather/dist/icons/edit';
import CloseIcon from 'react-feather/dist/icons/x-circle';
import TrashIcon from 'react-feather/dist/icons/trash-2';
import MoveIcon from 'react-feather/dist/icons/map-pin';
import FocusIcon from 'react-feather/dist/icons/crosshair';
// import BackArrowIcon from 'react-feather/dist/icons/corner-up-left';
import { Loader } from '~/components';
import Footer2 from './Footer2.jsx';
import {
    Editor,
    EditorState,
    RichUtils,
    ContentState,
    convertToRaw,
    convertFromRaw
} from 'draft-js';
import 'draft-js/dist/Draft.css';
import styled from 'styled-components';
import noop from 'lodash/noop';
import { EDITOR_STATES } from '~/util';

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

function getDefaultFooterState (isNew) {
    return isNew ? EDITOR_STATES.save : EDITOR_STATES.empty;
}

const EMPTY_EDITOR = EditorState.createEmpty();

const TextEditor = ({ note, onChange, noteStatus }) => {
    const isNewNote = !note.id;
    const [footer, setFooter] = useState({
        previous: undefined,
        current: getDefaultFooterState(isNewNote)
    });
    const [isReadOnly, setIsReadOnly] = useState(!isNewNote);
    const [isEditing, setIsEditing] = useState(false);
    const footerState = footer.override || footer.current;
    const [editorState, setEditorState] = useState(EMPTY_EDITOR);

    useEffect(() => {
        const isNewNote = !note.id;
        setEditorState(getEditorState(note));
        setFooter({
            previous: undefined,
            current: getDefaultFooterState(isNewNote)
        });
        setIsReadOnly(!isNewNote);
    }, [note]);

    const updateFooter = (newCurrent, timer) =>{
        setFooter(prevFooter => {
            const override =
                (timer ? newCurrent : undefined) || prevFooter.override;

            return  newCurrent
                ? {
                    previous: timer
                        ? prevFooter.previous
                        : prevFooter.current,
                    current: timer ? prevFooter.current : newCurrent,
                    override
                }
                : {
                    override,
                    previous: undefined,
                    current:
                              prevFooter.previous ||
                              getDefaultFooterState(isNewNote)
                };
        });

        if (timer) {
            setTimeout(() => {
                setFooter(footer => {
                    const override = footer.override;
                    return {
                        ...footer,
                        override:
                                override === newCurrent ? undefined : override
                    };
                });
            }, timer);
        }
    };

    const updateFooterWithOverride = (newOverride) => {
        setFooter(prevFooter => {
            return {
                ...prevFooter,
                override: newOverride
            };
        });
    };

    const onEditorChange = (editorState) =>{
        setEditorState(editorState);
        onChange(EDITOR_STATES.edit, {editorState});
    };

    const handleKeyCommand =(command, editorState) =>{
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            onEditorChange(newState);
            return 'handled';
        }
        return 'not-handled';
    };

    const onClick =(state) =>{
        switch (state) {
            case EDITOR_STATES.save:
                onSave();
                break;
            case EDITOR_STATES.edit:
                setIsReadOnly(false);
                updateFooter(EDITOR_STATES.save);
                break;
            case EDITOR_STATES.saveNewLocation:
                onSaveLocation();
                break;
            case EDITOR_STATES.move:
                onChange(EDITOR_STATES.move);
                updateFooterWithOverride(EDITOR_STATES.saveNewLocation);
                break;
            case EDITOR_STATES.confirmDelete:
            case EDITOR_STATES.confirmClose:
            case EDITOR_STATES.focus:
                onChange(state);
                break;
        }
    };

    const onEditorFocus = () => {
        setIsEditing(true);
        onChange(EDITOR_STATES.lock);
    };

    const onSave = () =>{
        const currentContent = editorState.getCurrentContent();
        onChange(EDITOR_STATES.save, {
            message: currentContent.getPlainText(),
            rawMessage: convertToRaw(currentContent)
        });
    };

    const onSaveLocation =  () =>{
        updateFooterWithOverride();
        if (note.id !== undefined) {
            onChange(EDITOR_STATES.save);
        }
    };

    return (
        <div className="h-inherit flex flex-col ">
            <div className="p-1 select-none flex-grow-0 flex justify-between leading-zero">
                <div
                    className={classnames(
                        { invisible: noteStatus !== 'loading' },
                        'p-1 text-grey-darkest'
                    )}>
                    <Loader className="" />
                </div>
                <div className="flex">
                    {!isNewNote && isReadOnly && (
                        <div
                            className="p-1 mr-0 text-grey-darker cursor-pointer active:text-black"
                            tabIndex="0"
                            onClick={() => onClick(EDITOR_STATES.edit)}
                        >
                            <EditIcon className="" />
                        </div>
                    )}
                    {!isNewNote && (
                        <div
                            className="p-1 mr-0 text-grey-darker cursor-pointer active:text-black"
                            tabIndex="0"
                            onClick={() =>
                                updateFooter(
                                    EDITOR_STATES.confirmDelete,
                                    3000
                                )
                            }
                        >
                            <TrashIcon className="" />
                        </div>
                    )}
                    {!isNewNote && (
                        <div
                            className="p-1 mr-0 text-grey-darker cursor-pointer active:text-black"
                            tabIndex="0"
                            onClick={() => onClick(EDITOR_STATES.move)}
                        >
                            <MoveIcon className="" />
                        </div>
                    )}
                    {false && (
                        <div
                            className="p-1 mr-0 text-grey-darker cursor-pointer active:text-black"
                            tabIndex="0"
                            onClick={() =>
                                onClick(EDITOR_STATES.focus)
                            }
                        >
                            <FocusIcon className="" />
                        </div>
                    )}
                    <div
                        className="p-1 text-grey-darker cursor-pointer active:text-black"
                        tabIndex="0"
                        onClick={() =>
                            isEditing
                                ? updateFooter(
                                    EDITOR_STATES.confirmClose,
                                    3000
                                )
                                : onClick(EDITOR_STATES.confirmClose)
                        }
                    >
                        <CloseIcon className="" />
                    </div>
                </div>
            </div>
            <EditorWrapper className="flex-1 px-4 py-2 overflow-y-auto">
                <Editor
                    className="h-full"
                    readOnly={isReadOnly}
                    editorState={editorState}
                    onChange={onEditorChange.bind(this)}
                    onFocus={onEditorFocus.bind(this)}
                    handleKeyCommand={handleKeyCommand.bind(this)}
                />
            </EditorWrapper>
            <div className="mr-4 flex-grow-0 flex justify-center">
                <div className="px-8 border border-b-0 border-l-0 border-r-0 border-grey-lighter">
                    <Footer2
                        state={footerState}
                        onClick={() => onClick(footerState)}
                    />
                </div>
            </div>
        </div>
    );
};

TextEditor.propTypes = {
    note: PropTypes.object,
    onChange: PropTypes.func,
    noteStatus: PropTypes.string
};

TextEditor.defaultProps = {
    note: {},
    onChange: noop
};

export default TextEditor;
