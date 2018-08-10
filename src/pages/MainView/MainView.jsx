import React from 'react';
import {connect} from 'react-redux';
import {fetchMaps} from '~/store/actions/maps';
import {saveNote} from '~/store/actions/notes';
import PropTypes from 'prop-types';
import {MarkerMap, TextEditor} from '~/components';
import styled from 'styled-components';
import get from 'lodash/get';

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
                    onMapClick={this.onMapClick.bind(this)}
                    onMarkerSelect={this.onMarkerSelect.bind(this)}
                    newNote={newNote}
                    notes={notes}
                />
                {isEditorOpen && (
                    <Floater>
                        <TextEditor
                            onCancel={this.onCancel.bind(this)}
                            onSave={this.onSave.bind(this)}
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
    notes: PropTypes.array
};

const mapStateToProps = state => {
    const selectedMap = state.maps.selectedMap;
    return {
        selectedMap,
        notes: get(state.notes, [get(selectedMap, 'id'), 'notes'])
    };
};

const mapDispatchToProps = dispatch => ({
    fetchMapsAndSelectFirst: () => dispatch(fetchMaps()),
    saveNote: (map, note) => dispatch(saveNote(map, note))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MainView);
