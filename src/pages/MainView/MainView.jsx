import React from 'react';
import {connect} from 'react-redux';
import {fetchFirstMapAndNotes} from '~/store/actions/maps';
import {saveNote, deleteNote, resetState as resetNoteState} from '~/store/actions/notes';
import PropTypes from 'prop-types';
import {MarkerMap, TextEditor} from '~/components';
import styled from 'styled-components';
import filter from 'lodash/filter';
import values from 'lodash/values';
import get from 'lodash/get';
import {bindAll} from '~/util';

const Wrapper = styled.div`
    height: 100%;
    width: 100%;
`;

const FloatyWrapper = styled.div`
    position: absolute;
    z-index: 499;
    right: 2rem;
    top: calc(52px + 2rem);
    background-color: white;
    opacity: 0.9;

    min-height: 30rem;
    max-height: 30rem;
    min-width: 30rem;
    max-width: 30rem;
`;

const FloatyInner = styled.div`
    position: relative;
    height: 30rem;
    overflow-y: auto;
`;

const Floater = ({children}) => (
    <FloatyWrapper>
        <FloatyInner>{children}</FloatyInner>
    </FloatyWrapper>
);

class MainView extends React.Component {
    constructor () {
        super();
        this.state = {
            isEditorOpen: false,
            selectedNote: null
        };

        bindAll(this, [
            'onMapClick',
            'onMarkerSelect',
            'onCancel',
            'onSave',
            'onDelete',
            'onNewEditorMode'
        ]);
    }

    componentDidMount () {
        this.props.fetchFirstMapAndNotes();
    }

    onMapClick (location) {
        const {selectedNote, editorMode} = this.state;
        if (selectedNote && editorMode === 'moving') {
            this.setState({
                selectedNote: {
                    ...selectedNote,
                    location
                }
            });
        } else if (editorMode !== 'editing' && editorMode !== 'moving') {
            this.props.resetNoteState();
            this.setState({
                isEditorOpen: true,
                selectedNote: {
                    location,
                    createdBy: this.props.user.uid
                }
            });
        }
    }

    onMarkerSelect (id) {
        const {editorMode} = this.state;
        if (editorMode === 'editing' || editorMode === 'moving') return;
        this.props.resetNoteState();
        const note = this.props.notes.find(note => note.id === id);
        this.setState({
            isEditorOpen: true,
            selectedNote: {...note}
        });
    }

    onNewEditorMode (mode) {
        this.setState({
            editorMode: mode
        });
    }

    onCancel () {
        this.resetEditor();
    }

    onSave (messageProps = {}) {
        const {selectedNote} = this.state;
        if (!selectedNote.id) return;

        this.onNewEditorMode(null);
        this.props.saveNote(this.props.selectedMapId, {
            ...selectedNote,
            ...messageProps,
            location: selectedNote.location
        }).then(() => {
            if (messageProps.message) {
                this.resetEditor();
            }
        });
    }

    onDelete (noteId) {
        this.onNewEditorMode(null);
        this.props.deleteNote(noteId).then(() => {
            this.resetEditor();
        });
    }

    resetEditor () {
        this.props.resetNoteState();
        this.setState({
            isEditorOpen: false,
            selectedNote: null,
            editorMode: null
        });
    }

    render () {
        const {isEditorOpen, selectedNote} = this.state;
        const {notes, usersById} = this.props;
        const author = selectedNote
            ? usersById[selectedNote.uid || get(this.props.user, 'uid')]
            : null;

        return (
            <Wrapper>
                <MarkerMap
                    onMapClick={this.onMapClick}
                    onMarkerSelect={this.onMarkerSelect}
                    selectedNote={selectedNote}
                    notes={notes}
                    usersById={usersById}
                />
                {isEditorOpen && (
                    <Floater>
                        <TextEditor
                            onNewMode={this.onNewEditorMode}
                            onCancel={this.onCancel}
                            onSave={this.onSave}
                            onDelete={this.onDelete}
                            note={selectedNote}
                            createdBy={author}
                        />
                    </Floater>
                )}
            </Wrapper>
        );
    }
}

MainView.propTypes = {
    selectedMapId: PropTypes.string,
    notes: PropTypes.array,
    usersById: PropTypes.object,
    saveNote: PropTypes.func,
    deleteNote: PropTypes.func
};

const mapStateToProps = state => {
    const selectedMapId = state.maps.selectedMapId;
    return {
        noteStatus: state.notes.status,
        selectedMapId,
        notes: filter(values(state.notes.byId), {mapId: selectedMapId}),
        usersById: state.users.byId,
        user: state.auth.user
    };
};

const mapDispatchToProps = dispatch => ({
    fetchFirstMapAndNotes: () => dispatch(fetchFirstMapAndNotes()),
    saveNote: (mapId, note) => dispatch(saveNote(mapId, note)),
    deleteNote: id => dispatch(deleteNote(id)),
    resetNoteState: () => dispatch(resetNoteState())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MainView);
