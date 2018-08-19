import React from 'react';
import PropTypes from 'prop-types';
import {
    Editor,
    EditorState,
    RichUtils,
    ContentState,
    convertToRaw,
    convertFromRaw
} from 'draft-js';
import 'draft-js/dist/Draft.css';
import {Card, CardContent} from './Components.jsx';
import head from 'lodash/head';
import last from 'lodash/last';
import get from 'lodash/get';
import {bindAll} from '~/util';
import Footer from './Footer';
import Header from './Header';

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

class TextEditor extends React.Component {
    constructor (props) {
        super(props);

        const {note} = props;
        const editorState = getEditorState(note);
        this.state = {
            editorState,
            base: note && note.id ? ['readOnly'] : ['editing'],
            hover: null
        };

        bindAll(this, [
            'onChange',
            'onFocus',
            'handleKeyCommand',
            'accept',
            'onModeChange',
            'isNoteUnchanged'
        ]);
    }

    isNewNote (prevNote, newNote) {
        return get(prevNote, 'id') !== get(newNote, 'id');
    }

    componentDidUpdate (prevProps) {
        if (this.isNewNote(prevProps.note, this.props.note)) {
            const {note} = this.props;
            const editorState = getEditorState(note);

            this.setState({
                editorState,
                base: note && note.id ? ['readOnly'] : ['editing'],
                hover: null
            });
        }
    }

    onSaveEditorContents () {
        const {editorState} = this.state;
        const currentContent = editorState.getCurrentContent();
        this.props.onSave({
            message: currentContent.getPlainText(),
            rawMessage: convertToRaw(currentContent)
        });
    }

    onSaveLocation () {
        this.onModeChange({
            base: this.isNoteUnchanged() ? ['readOnly'] : ['editing']
        });
        if (this.props.note.id) {
            this.props.onSave();
        }
    }

    onChange (editorState) {
        this.setState({editorState});
    }

    onFocus () {
        // not ideal, but I want to clobber empty new notes.
        this.props.onNewMode('editing');
    }

    handleKeyCommand (command, editorState) {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.onChange(newState);
            return 'handled';
        }
        return 'not-handled';
    }

    isNoteUnchanged () {
        const {editorState} = this.state;
        const currentContent = editorState.getCurrentContent();
        const text = currentContent.getPlainText();
        return text === get(this.props, ['note', 'message'], '');
    }

    accept (mode) {
        clearTimeout(this.timeoutId);
        switch (mode) {
            case 'editing':
                this.onSaveEditorContents();
                break;
            case 'moving':
                this.onSaveLocation();
                break;
            case 'cancel':
            case 'close':
                this.props.onCancel();
                break;
            case 'delete':
                this.props.onDelete(get(this.props, ['note', 'id']));
                break;
        }
    }

    onModeChange (params) {
        this.setState(params);
    }

    render () {
        const {editorState, base, hover} = this.state;
        const {note, createdBy} = this.props;
        const editing = head(base) === 'editing';
        return (
            <Card className="card">
                <Header
                    note={note}
                    mode={{base, hover}}
                    onModeChange={this.onModeChange}
                    onNewEditorMode={this.props.onNewMode}
                    onCancel={this.props.onCancel}
                    canCloseImmediately={this.isNoteUnchanged}
                />
                <CardContent className="card-content">
                    <Editor
                        readOnly={!editing}
                        editorState={editorState}
                        onChange={this.onChange}
                        onFocus={this.onFocus}
                        handleKeyCommand={this.handleKeyCommand}
                    />
                </CardContent>
                <Footer
                    base={last(base)}
                    override={hover}
                    createdBy={createdBy}
                    onClick={this.accept}
                />
            </Card>
        );
    }
}

TextEditor.propTypes = {
    initialText: PropTypes.string,
    onNewMode: PropTypes.func,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
    onDelete: PropTypes.func,
    note: PropTypes.object,
    createdBy: PropTypes.object
};

const noop = () => {};
TextEditor.defaultProps = {
    onNewMode: noop,
    onSave: noop,
    onCancel: noop,
    onDelete: noop
};

export default TextEditor;
