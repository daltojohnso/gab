import React from 'react';
import {connect} from 'react-redux';
import {fetchMaps} from '~/store/actions/maps';
import {saveNote, deleteNote} from '~/store/actions/notes';
import PropTypes from 'prop-types';
import {MarkerMap, TextEditor} from '~/components';
import styled from 'styled-components';
import filter from 'lodash/filter';
import values from 'lodash/values';
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
    constructor() {
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
            'onDelete'
        ]);
    }

    componentDidMount() {
        this.props.fetchMapsAndSelectFirst();
    }

    onMapClick(location) {
        this.setState({
            isEditorOpen: true,
            selectedNote: {
                location,
                createdBy: this.props.user.uid
            }
        });
    }

    onMarkerSelect(id) {
        const note = this.props.notes.find(note => note.id === id);
        this.setState({
            isEditorOpen: true,
            selectedNote: note
        });
    }

    onCancel() {
        this.setState({
            isEditorOpen: false,
            selectedNote: null
        });
    }

    onSave({message, rawMessage}) {
        const {selectedNote} = this.state;

        this.props.saveNote(this.props.selectedMapId, {
            ...selectedNote,
            message,
            rawMessage,
            location: selectedNote.location
        });

        this.setState({
            isEditorOpen: false,
            selectedNote: null
        });
    }

    onDelete(noteId) {
        this.props.deleteNote(noteId);
        this.setState({
            isEditorOpen: false,
            selectedNote: null
        });
    }

    render() {
        const {isEditorOpen, selectedNote} = this.state;
        const {notes, usersById} = this.props;

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
                            onCancel={this.onCancel}
                            onSave={this.onSave}
                            onDelete={this.onDelete}
                            note={selectedNote}
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
        selectedMapId,
        notes: filter(values(state.notes.byId), {mapId: selectedMapId}),
        usersById: state.users.byId,
        user: state.auth.user
    };
};

const mapDispatchToProps = dispatch => ({
    fetchMapsAndSelectFirst: () => dispatch(fetchMaps()),
    saveNote: (mapId, note) => dispatch(saveNote(mapId, note)),
    deleteNote: id => dispatch(deleteNote(id))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MainView);
