import MainView from './MainView.jsx';
import {connect} from 'react-redux';
import {fetchMap, fetchFirstMapAndNotes, setSelectedMap} from '~/store/actions/maps';
import {fetchNotes, saveNote, deleteNote, resetState as resetNoteState} from '~/store/actions/notes';
import {fetchUsersOfMap} from '~/store/actions/users';
import filter from 'lodash/filter';
import values from 'lodash/values';

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
    saveNote: (mapId, note) => dispatch(saveNote(mapId, note)),
    deleteNote: id => dispatch(deleteNote(id)),
    resetNoteState: () => dispatch(resetNoteState()),
    fetchNotes: mapId => dispatch(fetchNotes(mapId)),
    fetch: mapId => {
        if (!mapId) return dispatch(fetchFirstMapAndNotes());
        dispatch(setSelectedMap(mapId));
        dispatch(fetchMap(mapId)).then(() => {
            dispatch(fetchUsersOfMap(mapId));
            dispatch(fetchNotes(mapId));
        });
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MainView);
