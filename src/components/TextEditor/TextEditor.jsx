import React from 'react';
import PropTypes from 'prop-types';
import EditIcon from 'react-feather/dist/icons/edit';
import XIcon from 'react-feather/dist/icons/x';
import TrashIcon from 'react-feather/dist/icons/trash-2';
import {
    Editor,
    EditorState,
    RichUtils,
    ContentState,
    convertToRaw,
    convertFromRaw
} from 'draft-js';
import 'draft-js/dist/Draft.css';
import {FooterItem, Card, CardContent, Icon} from './Components.jsx';
import head from 'lodash/head';
import last from 'lodash/last';
import get from 'lodash/get';
import {bindAll} from '~/util';

function getEditorState(note) {
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

const hoverEditButton = <FooterItem>Edit?</FooterItem>;
const hoverCloseButton = <FooterItem>Close note?</FooterItem>;
const hoverCancelButton = <FooterItem>Discard changes?</FooterItem>;
const hoverDeleteButton = <FooterItem>Delete note?</FooterItem>;

class TextEditor extends React.Component {
    constructor(props) {
        super(props);

        const {note} = props;
        const editorState = getEditorState(note);
        this.state = {
            editorState,
            baseFooter: note && note.id ? ['readOnly'] : ['editing'],
            hoverLayer: null
        };

        const saveButton = (
            <FooterItem link onClick={() => this.accept('editing')}>
                Save
            </FooterItem>
        );

        const confirmCancel = (
            <FooterItem link onClick={() => this.accept('cancel')}>
                Are you sure you want to discard changes?
            </FooterItem>
        );

        const confirmDelete = (
            <FooterItem link onClick={() => this.accept('delete')}>
                Are you sure you want to delete this note?
            </FooterItem>
        );

        this.baseStates = {
            readOnly: null,
            editing: saveButton,
            cancel: confirmCancel,
            delete: confirmDelete
        };

        this.hoverStates = {
            editing: hoverEditButton,
            cancel: hoverCancelButton,
            close: hoverCloseButton,
            delete: hoverDeleteButton
        };

        bindAll(this, ['onChange', 'handleKeyCommand']);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.note !== this.props.note) {
            const {note} = this.props;
            const editorState = getEditorState(note);

            this.setState({
                editorState,
                baseFooter: note && note.id ? ['readOnly'] : ['editing'],
                hoverLayer: null
            });
        }
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

    start(mode) {
        this.setState({
            baseFooter: [mode],
            hoverLayer: null
        });
    }

    confirm(mode) {
        this.setState(prevState => {
            const baseMode = head(prevState.baseFooter);

            clearTimeout(this.timeoutId);
            this.timeoutId = setTimeout(() => {
                this.setState({
                    baseFooter: [baseMode]
                });
            }, 3000);

            return {
                baseFooter: [baseMode, mode],
                hoverLayer: null
            };
        });
    }

    accept(mode) {
        clearTimeout(this.timeoutId);
        switch (mode) {
            case 'editing':
                this.onSaveEditorContents();
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

    hover(mode) {
        this.setState(prevState => {
            return prevState.baseFooter.find(base => base === mode)
                ? {}
                : {
                    hoverLayer: mode
                };
        });
    }

    clearHover(mode) {
        this.setState(prevState => {
            return prevState.hoverLayer === mode
                ? {
                    hoverLayer: null
                }
                : {};
        });
    }

    buildFooter(baseFooter, hoverLayer) {
        const base = last(baseFooter);
        const footer = hoverLayer
            ? this.hoverStates[hoverLayer]
            : this.baseStates[base];
        return footer || this.baseStates.readOnly;
    }

    render() {
        const {editorState, baseFooter, hoverLayer} = this.state;
        const {note, createdBy} = this.props;

        const editing = head(baseFooter) === 'editing';
        const name = get(createdBy, 'displayName') || get(createdBy, 'email');
        const defaultFooter = name ? (
            <FooterItem>{name && <i>from {name}</i>}</FooterItem>
        ) : (
            <FooterItem>&nbsp;</FooterItem>
        );
        const footer =
            this.buildFooter(baseFooter, hoverLayer) || defaultFooter;

        return (
            <Card className="card">
                <div className="card-header">
                    <p className="card-header-title">
                        <em>{note ? note.title || 'Note' : 'New Note'}</em>
                    </p>
                    <Icon
                        onClick={() => this.start('editing')}
                        onMouseOver={() => this.hover('editing')}
                        onMouseOut={() => this.clearHover('editing')}
                    >
                        <EditIcon />
                    </Icon>
                    {get(note, 'id') && (
                        <Icon
                            onClick={() => this.confirm('delete')}
                            onMouseOver={() => this.hover('delete')}
                            onMouseOut={() => this.clearHover('delete')}
                        >
                            <TrashIcon />
                        </Icon>
                    )}
                    {editing && (
                        <Icon
                            onClick={() => this.confirm('cancel')}
                            onMouseOver={() => this.hover('cancel')}
                            onMouseOut={() => this.clearHover('cancel')}
                        >
                            <XIcon />
                        </Icon>
                    )}
                    {!editing && (
                        <Icon
                            onClick={() => this.accept('close')}
                            onMouseOver={() => this.hover('close')}
                            onMouseOut={() => this.clearHover('close')}
                        >
                            <XIcon />
                        </Icon>
                    )}
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
    onDelete: PropTypes.func,
    note: PropTypes.object,
    createdBy: PropTypes.object
};

const noop = () => {};
TextEditor.defaultProps = {
    onSave: noop,
    onCancel: noop,
    onDelete: noop
};

export default TextEditor;
