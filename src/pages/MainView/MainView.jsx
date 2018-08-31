import React from 'react';
import PropTypes from 'prop-types';
import {MarkerMap, TextEditor} from '~/components';
import styled from 'styled-components';
import get from 'lodash/get';
import {bindAll} from '~/util';

class MainView extends React.Component {
    constructor () {
        super();
        this.state = {
            selectedNote: null,
            editorMode: null
        };

        bindAll(this, [
            'onMapClick',
            'onMarkerClick',
            'resetEditor',
            'onSave',
            'onDelete',
            'onNewMode'
        ]);
    }

    componentDidMount () {
        this.props.fetch(
            get(this.props, 'match.params.mapId')
        );
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
                selectedNote: {
                    location,
                    createdBy: this.props.user.uid
                }
            });
        }
    }

    onMarkerClick (id) {
        const {editorMode} = this.state;
        if (editorMode === 'editing' || editorMode === 'moving') return;

        this.props.resetNoteState();
        const selectedNote = this.props.notes.find(note => note.id === id);
        this.setState({selectedNote});
    }

    onNewMode (editorMode) {
        this.setState({editorMode});
    }

    onSave (messageProps = {}) {
        const {selectedNote} = this.state;

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
        this.props.deleteNote(noteId).then(() => {
            this.resetEditor();
        });
    }

    resetEditor () {
        this.props.resetNoteState();
        this.setState({
            selectedNote: null,
            editorMode: null
        });
    }

    render () {
        const {selectedNote} = this.state;
        const {notes, usersById} = this.props;
        const author = selectedNote
            ? usersById[selectedNote.uid || get(this.props.user, 'uid')]
            : null;
        const mapClass = selectedNote ? 'editor-open' : '';
        return (
            <Wrapper>
                <MapWrap
                    className={mapClass}
                >
                    <MarkerMap
                        onMapClick={this.onMapClick}
                        onMarkerClick={this.onMarkerClick}
                        selectedNote={selectedNote}
                        notes={notes}
                        usersById={usersById}
                    />
                </MapWrap>
                {selectedNote && (
                    <Floater>
                        <TextEditor
                            onNewMode={this.onNewMode}
                            onCancel={this.resetEditor}
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
    fetch: PropTypes.func,
    resetNoteState: PropTypes.func,
    selectedMapId: PropTypes.string,
    notes: PropTypes.array,
    usersById: PropTypes.object,
    user: PropTypes.object,
    saveNote: PropTypes.func,
    deleteNote: PropTypes.func
};

const Wrapper = styled.div`
    height: 100%;
    width: 100%;
`;

const MapWrap = styled.div`
    height: 100%;
    width: 100%;

    @media all and (max-width: 768px) {
        &.editor-open {
            height: 35vh;
        }
    }
`;

const FloatyWrapper = styled.div`
    position: absolute;
    z-index: 499;
    right: 2rem;
    top: calc(52px + 2rem);
    background-color: white;
    opacity: 0.9;

    min-height: 25rem;
    max-height: 25rem;
    width: 22rem;
    max-width: 45vw;

    @media all and (max-width: 768px) {
        position: relative;
        top: 0;
        right: 0;
        min-width: 100vw;
        max-width: 100vw;
        height: calc(65vh - 52px);
        min-height: unset;
        max-height: unset;
    }
`;

const FloatyInner = styled.div`
    position: relative;
    height: 25rem;
    overflow-y: auto;

    @media all and (max-width: 768px) {
        height: inherit;
    }
`;

const Floater = ({children}) => (
    <FloatyWrapper>
        <FloatyInner>{children}</FloatyInner>
    </FloatyWrapper>
);

Floater.propTypes = {
    children: PropTypes.any
};

export default MainView;
