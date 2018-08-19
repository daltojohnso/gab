import MainView from './MainView.jsx';
import {connect} from 'react-redux';
import {fetchFirstMapAndNotes} from '~/store/actions/maps';
import {saveNote, deleteNote, resetState as resetNoteState} from '~/store/actions/notes';
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
    fetchFirstMapAndNotes: () => dispatch(fetchFirstMapAndNotes()),
    saveNote: (mapId, note) => dispatch(saveNote(mapId, note)),
    deleteNote: id => dispatch(deleteNote(id)),
    resetNoteState: () => dispatch(resetNoteState())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MainView);
