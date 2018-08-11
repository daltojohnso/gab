import React from 'react';
import PropTypes from 'prop-types';
import EditIcon from 'react-feather/dist/icons/edit';
import XIcon from 'react-feather/dist/icons/x';
import {
    Editor,
    EditorState,
    RichUtils,
    ContentState,
    convertToRaw,
    convertFromRaw
} from 'draft-js';
import 'draft-js/dist/Draft.css';
import {FooterItem, Card, CardContent, OnIcon} from './Components.jsx';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import isBoolean from 'lodash/isBoolean';
import {bindAll} from '~/util';

function getEditorState(note) {
    let contentState;
    if (note) {
        try {
            contentState = convertFromRaw(JSON.parse(note.rawMessage));
        } catch (err) {
            contentState = ContentState.createFromText(note.message || '');
        }
    }

    return contentState
        ? EditorState.createWithContent(contentState)
        : EditorState.createEmpty();
}

const hoverEditButton = <FooterItem>Edit?</FooterItem>;
const hoverCloseButton = <FooterItem>Close note?</FooterItem>;
const hoverCancelButton = <FooterItem>Discard changes?</FooterItem>;
const DefaultFooter = <FooterItem>&nbsp;</FooterItem>;
const confirmCancel = (
    <FooterItem>Are you sure you want to discard changes?</FooterItem>
);
class TextEditor extends React.Component {
    constructor(props) {
        super(props);

        const {note} = props;
        const editorState = getEditorState(note);
        this.state = {
            editorState,
            editMode: note ? 'readOnly' : 'edit',
            buttonMode: 'default',
            hoverMode: null,

            editing: false,
            footer: DefaultFooter
        };

        this.saveButton = (
            <FooterItem link onClick={() => this.onSaveEditorContents()}>
                Save
            </FooterItem>
        );

        this.editState = {
            close_onClick: {
                footer: confirmCancel
            },
            close_onMouseOver: {
                footer: hoverCancelButton
            }
        };

        this.readOnlyState = {
            edit_onClick: {
                editing: true
            },
            edit_onMouseOver: {
                footer: hoverEditButton
            },
            close_onClick: {
                footer: confirmCancel
            },
            close_onMouseOver: {
                footer: hoverCloseButton
            }
        };

        bindAll(this, [
            'onChange',
            'handleKeyCommand',
            {
                onEdit: ['onEvent', 'edit'],
                onClose: ['onEvent', 'close']
            }
        ]);
    }

    // TODO: this sucks, do better.
    // instead of this...
    // store last event, call fn to generate footer...
    // main issue was returning to prev state after a hover
    // I could either ignore hovers when "confirming"
    // or I could separate hover states entirely
    // and then I can return to the prev "real" state
    // "hover" will just sort of sit on top of the real state
    // maybe have [defaultState, confirmState, potentialHover]
    // the other issue was doing setTimeout cleanly
    getNewState(type, eventType) {
        const combined = `${type}_${eventType}`;
        this.setState(prevState => {
            let editing = prevState.editing;
            const stateToChange = get(
                editing ? this.editState : this.readOnlyState,
                combined,
                {}
            );
            editing = isBoolean(stateToChange.editing)
                ? stateToChange.editing
                : editing;

            this.handleDoubleClick(prevState.lastState, {type, eventType});
            return Object.assign({
                editing,
                footer: editing ? this.saveButton : DefaultFooter,
                lastState: {type, eventType},
                ...stateToChange
            });
        });
    }

    handleDoubleClick(lastType, type) {
        if (isEqual(lastType, type)) {
            if (type.type === 'close') {
                this.props.onCancel();
            }
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.note !== this.props.note) {
            const {note} = this.props;
            const editorState = getEditorState(note);

            this.setState({
                editorState,
                editMode: note ? 'readOnly' : 'edit'
            });
        }
    }

    onEvent(type, eventType) {
        this.getNewState(type, eventType);
    }

    onSaveEditorContents() {
        const {editorState} = this.state;
        const currentContent = editorState.getCurrentContent();
        this.props.onSave({
            message: currentContent.getPlainText(),
            rawMessage: convertToRaw(currentContent)
        });
    }

    onChange(editorState) {
        this.setState({editorState});
    }

    handleKeyCommand(command, editorState) {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.onChange(newState);
            return 'handled';
        }
        return 'not-handled';
    }

    render() {
        const {editing, footer, editorState} = this.state;
        const {note} = this.props;

        return (
            <Card className="card">
                <div className="card-header">
                    <p className="card-header-title">
                        <em>{note ? note.title || 'Note' : 'New Note'}</em>
                    </p>
                    <OnIcon on={this.onEdit}>
                        <EditIcon />
                    </OnIcon>

                    <OnIcon
                        on={this.onClose}
                        {...(editing ? {} : {onClick: this.props.onCancel})}
                    >
                        <XIcon />
                    </OnIcon>
                </div>
                <CardContent className="card-content">
                    <Editor
                        readOnly={!editing}
                        editorState={editorState}
                        onChange={this.onChange}
                        handleKeyCommand={this.handleKeyCommand}
                    />
                </CardContent>
                <footer className="card-footer">{footer}</footer>
            </Card>
        );
    }
}

TextEditor.propTypes = {
    initialText: PropTypes.string,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
    note: PropTypes.object
};

const noop = () => {};
TextEditor.defaultProps = {
    onSave: noop,
    onCancel: noop
};

export default TextEditor;
