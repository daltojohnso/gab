import React from 'react';
import PropTypes from 'prop-types';
import {NavBar, MarkerMap, FloatingTextEditor2} from '~/components';
import get from 'lodash/get';
import {EDITOR_STATES} from '~/util';

const STATES = {
    open: 'open',
    editing: 'editing',
    moving: 'moving'
};

class MainView extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            selectedNote: undefined,
            editorState: undefined
        };

        props.fetch();

        this.onMapClick = this.onMapClick.bind(this);
        this.onMarkerClick = this.onMarkerClick.bind(this);
        this.onNoteChange = this.onNoteChange.bind(this);
        this.openMapsList = this.openMapsList.bind(this);
        this.openNotesList = this.openNotesList.bind(this);
    }

    onMapClick (location) {
        const {selectedNote, editorState} = this.state;
        if (editorState === STATES.moving) {
            this.setState({
                selectedNote: {
                    ...selectedNote,
                    location
                }
            });
        } else if (editorState !== STATES.editing) {
            const newNote = {
                location,
                createdBy: this.props.user.uid
            };
            this.setState({
                selectedNote: newNote,
                editorState: STATES.open
            });
        }
    }

    onMarkerClick (id) {
        const {editorState} = this.state;
        if (editorState === STATES.editing || editorState === STATES.moving) return;

        const selectedNote = this.props.notes.find(note => note.id === id);
        this.setState({
            selectedNote,
            editorState: STATES.open
        });
    }

    onNoteChange (state, messageProps = {}) {
        switch (state) {
            case EDITOR_STATES.save:
                this.onSave(messageProps);
                break;
            case EDITOR_STATES.move:
                this.setState({
                    editorState: STATES.moving
                });
                break;
            case EDITOR_STATES.confirmDelete:
                this.onDelete();
                break;
            case EDITOR_STATES.confirmClose:
                this.closeEditor();
                break;
            case EDITOR_STATES.focus:
                break;
        }
    }

    async onSave (messageProps) {
        const {selectedNote, editorState} = this.state;
        await this.props.saveNote(this.props.selectedMapId, {
            ...selectedNote,
            ...messageProps
        });

        if (editorState !== STATES.moving) {
            this.closeEditor();
        }
    }

    async onDelete () {
        const {selectedNote} = this.state;
        await this.props.deleteNote(selectedNote.id);
        this.closeEditor();
    }

    closeEditor () {
        this.setState({
            selectedNote: undefined,
            editorState: undefined
        });
    }

    openMapsList () {}

    openNotesList () {

    }

    render () {
        const {selectedNote} = this.state;
        const {notes, usersById, pinMap} = this.props;
        return (
            <React.Fragment>
                <NavBar
                    onMapsClick={this.openMapsList}
                    onNotesClick={this.openNotesList}
                />
                <main className="w-full h-full">
                    <MarkerMap
                        onMapClick={this.onMapClick}
                        onMarkerClick={this.onMarkerClick}
                        selectedNote={selectedNote}
                        notes={notes}
                        usersById={usersById}
                        pinMap={pinMap}
                    />
                    {selectedNote && (
                        <FloatingTextEditor2
                            onChange={this.onNoteChange}
                            note={selectedNote}
                        />
                    )}
                </main>
            </React.Fragment>
        );
    }
}

MainView.propTypes = {
    fetch: PropTypes.func,
    selectedMapId: PropTypes.string,
    notes: PropTypes.array,
    usersById: PropTypes.object,
    user: PropTypes.object,
    saveNote: PropTypes.func,
    deleteNote: PropTypes.func,
    notesStatus: PropTypes.bool
};

export default MainView;
