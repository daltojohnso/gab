import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import EditIcon from 'react-feather/dist/icons/edit';
import CloseIcon from 'react-feather/dist/icons/x-circle';
import TrashIcon from 'react-feather/dist/icons/trash-2';
import MoveIcon from 'react-feather/dist/icons/map-pin';
import FocusIcon from 'react-feather/dist/icons/crosshair';
// import BackArrowIcon from 'react-feather/dist/icons/corner-up-left';
import {Loader} from '~/components';
import {Editor, EditorState, RichUtils, ContentState, convertToRaw, convertFromRaw} from 'draft-js';
import 'draft-js/dist/Draft.css';
import styled from 'styled-components';
import noop from 'lodash/noop';
import get from 'lodash/get';
import {EDITOR_STATES} from '~/util';

const EditorWrapper = styled.div`
    > .DraftEditor-root {
        height: 100%;
    }
`;

const Footer = ({state, onClick}) => {
    switch (state) {
        case EDITOR_STATES.edit:
            return <button className="m-1 px-4 py-2 text-grey-darkest">Edit note?</button>;
        case EDITOR_STATES.delete:
            return <button className="m-1 px-4 py-2 text-grey-darkest">Delete note?</button>;
        case EDITOR_STATES.confirmDelete:
            return (
                <button className="m-1 px-4 py-2 hover:bg-grey-lighter text-grey-darkest active:bg-grey-light"
                    onClick={() => onClick(EDITOR_STATES.confirmDelete)}>
                    Click here to delete
                </button>
            );
        case EDITOR_STATES.move:
            return <button className="m-1 px-4 py-2 text-grey-darkest">Move note?</button>;
        case EDITOR_STATES.saveNewLocation:
            return (
                <button className="m-1 px-4 py-2 hover:bg-grey-lighter text-grey-darkest active:bg-grey-light"
                    onClick={() => onClick(EDITOR_STATES.saveNewLocation)}>
                    Save new location
                </button>
            );
        case EDITOR_STATES.focus:
            return <button className="m-1 px-4 py-2 text-grey-darkest">Zoom in?</button>;
        case EDITOR_STATES.close:
            return <button className="m-1 px-4 py-2 text-grey-darkest">Close note?</button>;
        case EDITOR_STATES.closeEdited:
            return <button className="m-1 px-4 py-2 text-grey-darkest">Close note without saving?</button>;
        case EDITOR_STATES.confirmClose:
            return (
                <button className="m-1 px-4 py-2 hover:bg-grey-lighter text-grey-darkest active:bg-grey-light"
                    onClick={() => onClick(EDITOR_STATES.confirmClose)}>
                    Click here to close
                </button>
            );
        case EDITOR_STATES.empty:
            return null;
        default:
            return (
                <button className="m-1 px-4 py-2 hover:bg-grey-lighter text-grey-darkest active:bg-grey-light"
                    onClick={() => onClick(EDITOR_STATES.save)}>
                    Save
                </button>
            );
    }
};

Footer.propTypes = {
    state: PropTypes.string,
    onClick: PropTypes.func
};

Footer.defaultProps = {
    onClick: noop
};

function getEditorState (note) {
    let contentState;
    if (note) {
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

class TextEditor extends React.Component {
    constructor (props) {
        super(props);
        const {note} = props;
        const isNew = get(note, 'id') === undefined;
        this.state = {
            editorState: getEditorState(note),
            isNew,
            isReadOnly: !isNew,
            footer: {
                previous: undefined,
                current: getDefaultFooterState(isNew)
            }
        };
    }

    componentDidUpdate ({note: oldNote}) {
        const {note} = this.props;
        if (get(oldNote, 'id') === get(note, 'id')) return;
        const isNew = get(note, 'id') === undefined;
        this.setState({
            editorState: getEditorState(note),
            isNew,
            isReadOnly: !isNew,
            footer: {
                previous: undefined,
                current: getDefaultFooterState(isNew)
            }
        });
    }

    updateFooter (newCurrent, timer) {
        this.setState(prevState => {
            const prevFooter = prevState.footer;
            const override = (timer ? newCurrent : undefined) || prevFooter.override;

            return {
                footer: newCurrent ? {
                    previous: timer ? prevFooter.previous : prevFooter.current,
                    current: timer ? prevFooter.current : newCurrent,
                    override
                } : {
                    override,
                    previous: undefined,
                    current: prevState.footer.previous || getDefaultFooterState(prevState.isNew)
                }
            };
        });

        if (timer) {
            setTimeout(() => {
                this.setState(prevState => {
                    const footer = prevState.footer;
                    const override = footer.override;
                    return {
                        footer: {
                            ...footer,
                            override: override === newCurrent ? undefined : override
                        }
                    };
                });
            }, timer);
        }
    }

    updateFooterWithOverride (newOverride) {
        this.setState(prevState => {
            return {
                footer: {
                    ...prevState.footer,
                    override: newOverride
                }
            };
        });
    }

    onEditorChange (editorState) {
        this.setState({editorState});
    }

    handleKeyCommand (command, editorState) {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.onEditorChange(newState);
            return 'handled';
        }
        return 'not-handled';
    }

    onClick (state) {
        switch (state) {
            case EDITOR_STATES.save:
                this.onSave();
                break;
            case EDITOR_STATES.edit:
                this.setState({isReadOnly: false});
                this.updateFooter(EDITOR_STATES.save);
                break;
            case EDITOR_STATES.saveNewLocation:
                this.onSaveLocation();
                break;
            case EDITOR_STATES.move:
                this.props.onChange(EDITOR_STATES.move);
                this.updateFooterWithOverride(EDITOR_STATES.saveNewLocation);
                break;
            case EDITOR_STATES.confirmDelete:
            case EDITOR_STATES.confirmClose:
            case EDITOR_STATES.focus:
                this.props.onChange(state);
                break;
        }
    }

    onEditorFocus () {
        this.setState({isEditing: true});
        this.props.onChange(EDITOR_STATES.lock);
    }

    onSave () {
        const {editorState} = this.state;
        const currentContent = editorState.getCurrentContent();
        this.props.onChange(EDITOR_STATES.save, {
            message: currentContent.getPlainText(),
            rawMessage: convertToRaw(currentContent)
        });
    }

    onSaveLocation () {
        this.updateFooterWithOverride();
        if (this.props.note.id !== undefined) {
            this.props.onChange(EDITOR_STATES.save);
        }
    }

    render () {
        const {editorState, footer, isReadOnly, isNew, isEditing} = this.state;
        const {noteStatus} = this.props;
        const footerState = footer.override || footer.current;

        return (
            <div className="h-inherit flex flex-col ">
                <div className="p-1 select-none flex-no-grow flex justify-between leading-zero">
                    <div className={classnames({invisible: noteStatus !== 'loading'}, 'p-1 text-grey-darkest')}>
                        <Loader className="" />
                    </div>
                    <div className="flex">
                        {!isNew && isReadOnly && (
                            <div className="p-1 mr-0 text-grey hover:text-grey-darker cursor-pointer active:text-black"
                                tabIndex="0"
                                onMouseOver={() => this.updateFooter(EDITOR_STATES.edit)}
                                onMouseOut={() => this.updateFooter()}
                                onClick={() => this.onClick(EDITOR_STATES.edit)}>
                                <EditIcon className="" />
                            </div>
                        )}
                        {!isNew && (
                            <div className="p-1 mr-0 text-grey hover:text-grey-darker cursor-pointer active:text-black"
                                tabIndex="0"
                                onMouseOver={() => this.updateFooter(EDITOR_STATES.delete)}
                                onMouseOut={() => this.updateFooter()}
                                onClick={() => this.updateFooter(EDITOR_STATES.confirmDelete, 3000)}>
                                <TrashIcon className="" />
                            </div>
                        )}
                        {!isNew && (
                            <div className="p-1 mr-0 text-grey hover:text-grey-darker cursor-pointer active:text-black"
                                tabIndex="0"
                                onMouseOver={() => this.updateFooter(EDITOR_STATES.move)}
                                onMouseOut={() => this.updateFooter()}
                                onClick={() => this.onClick(EDITOR_STATES.move)}>
                                <MoveIcon className="" />
                            </div>
                        )}
                        {false && (
                            <div className="p-1 mr-0 text-grey hover:text-grey-darker cursor-pointer active:text-black"
                                tabIndex="0"
                                onMouseOver={() => this.updateFooter(EDITOR_STATES.focus)}
                                onMouseOut={() => this.updateFooter()}
                                onClick={() => this.onClick(EDITOR_STATES.focus)}>
                                <FocusIcon className="" />
                            </div>
                        )}
                        <div className="p-1 text-grey hover:text-grey-darker cursor-pointer active:text-black"
                            tabIndex="0"
                            onMouseOver={() => this.updateFooter(isEditing ? EDITOR_STATES.closeEdited : EDITOR_STATES.close)}
                            onMouseOut={() => this.updateFooter()}
                            onClick={() => isEditing ? this.updateFooter(EDITOR_STATES.confirmClose, 3000) : this.onClick(EDITOR_STATES.confirmClose)}>
                            <CloseIcon className="" />
                        </div>
                    </div>
                </div>
                <EditorWrapper className="flex-1 px-4 py-2 overflow-y-auto">
                    <Editor
                        className="h-full"
                        readOnly={isReadOnly}
                        editorState={editorState}
                        onChange={this.onEditorChange.bind(this)}
                        onFocus={this.onEditorFocus.bind(this)}
                        handleKeyCommand={this.handleKeyCommand.bind(this)}
                    />
                </EditorWrapper>
                <div className="mr-4 flex-no-grow flex justify-center">
                    <div className="px-8 border border-b-0 border-l-0 border-r-0 border-grey-lighter">
                        <Footer state={footerState} onClick={() => this.onClick(footerState)} />
                    </div>
                </div>
            </div>
        );
    }
}

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
