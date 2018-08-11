import React from 'react';
import {connect} from 'react-redux';
import {fetchMaps} from '~/store/actions/maps';
import {saveNote} from '~/store/actions/notes';
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
            newNote: null,
            note: null
        };

        bindAll(this, ['onMapClick', 'onMarkerSelect', 'onCancel', 'onSave']);
    }

    componentDidMount() {
        this.props.fetchMapsAndSelectFirst();
    }

    onMapClick(location) {
        this.setState({
            isEditorOpen: true,
            note: null,
            newNote: {
                location
            }
        });
    }

    onMarkerSelect(id) {
        const note = this.props.notes.find(note => note.id === id);
        this.setState({
            isEditorOpen: true,
            note,
            newNote: null
        });
    }

    onCancel() {
        this.setState({
            isEditorOpen: false,
            newNote: null,
            note: null
        });
        // reset zoom
    }

    onSave(note) {
        const {rawMessage, message} = note;
        const [latitude, longitude] = this.state.newNote.location;
        this.props.saveNote(this.props.selectedMap.id, {
            message,
            rawMessage,
            location: {latitude, longitude}
        });
        this.setState({
            isEditorOpen: false,
            newNote: null,
            note: null
        });
    }

    render() {
        const {isEditorOpen, note, newNote} = this.state;
        const {notes} = this.props;
        const {latitude, longitude} = note ? note.location : {};
        const position = note ? [latitude, longitude] : null;

        return (
            <Wrapper>
                <MarkerMap
                    onMapClick={this.onMapClick}
                    onMarkerSelect={this.onMarkerSelect}
                    newNote={newNote}
                    notes={notes}
                />
                {isEditorOpen && (
                    <Floater>
                        <TextEditor
                            onCancel={this.onCancel}
                            onSave={this.onSave}
                            note={note}
                            position={position}
                        />
                    </Floater>
                )}
            </Wrapper>
        );
    }
}

MainView.propTypes = {
    selectedMap: PropTypes.object,
    notes: PropTypes.array,
    saveNote: PropTypes.func
};

const mapStateToProps = state => {
    const selectedMapId = state.maps.selectedMapId;
    return {
        selectedMapId,
        notes: filter(values(state.notes.byId), {mapId: selectedMapId})
    };
};

const mapDispatchToProps = dispatch => ({
    fetchMapsAndSelectFirst: () => dispatch(fetchMaps()),
    saveNote: (mapId, note) => dispatch(saveNote(mapId, note))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MainView);
