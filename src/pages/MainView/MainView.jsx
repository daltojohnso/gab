import React from 'react';
import {connect} from 'react-redux';
import {fetchMaps} from '~/store/actions/maps';
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
            selectedMarker: null,
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
            selectedMarker: {
                location
            }
        });
    }

    onMarkerSelect(id) {
        const note = this.props.notes.find(note => note.id === id);
        this.setState({
            isEditorOpen: true,
            note
        });
    }

    onCancel() {
        this.setState({
            isEditorOpen: false,
            selectedMarker: null
        });
        // reset zoom
    }

    onSave(note) {
        // dispatch action to save Note
        this.setState({
            isEditorOpen: false
        });
    }

    render() {
        const {isEditorOpen, note, selectedMarker} = this.state;
        const {notes} = this.props;
        return (
            <Wrapper>
                <MarkerMap
                    onMapClick={this.onMapClick.bind(this)}
                    onMarkerSelect={this.onMarkerSelect.bind(this)}
                    selectedMarker={selectedMarker}
                    notes={notes}
                />
                {isEditorOpen && (
                    <Floater>
                        <TextEditor
                            onCancel={this.onCancel.bind(this)}
                            onSave={this.onSave.bind(this)}
                            note={note}
                        />
                    </Floater>
                )}
            </Wrapper>
        );
    }
}

const mapStateToProps = state => {
    const selectedMap = state.maps.selectedMap;
    return {
        selectedMap,
        notes: get(state.notes, [get(selectedMap, 'id'), 'notes'])
    };
};

const mapDispatchToProps = dispatch => ({
    fetchMapsAndSelectFirst: () => dispatch(fetchMaps())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MainView);
