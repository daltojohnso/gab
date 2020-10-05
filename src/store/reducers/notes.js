import keyBy from 'lodash/keyBy';
import omitBy from 'lodash/omitBy';
const initState = {
    byId: {},
    status: 'resolved',
    error: undefined
};
const notes = (state = initState, action) => {
    let noteId;
    switch (action.type) {
        case 'notes/addSubset':
            return {
                ...state,
                byId: {
                    ...state.byId,
                    ...keyBy(action.notes, 'id')
                }
            };
        case 'notes/set':
            noteId = action.note.id;
            return {
                ...state,
                byId: {
                    ...state.byId,
                    [noteId]:
                        noteId in state.byId
                            ? {
                                ...state.byId[noteId],
                                ...action.note
                            }
                            : action.note
                }
            };
        case 'notes/remove':
            noteId = action.noteId;
            delete state.byId[noteId];
            return {
                ...state,
                byId: {
                    ...state.byId
                }
            };
        case 'notes/removeByMapId':
            return {
                ...state,
                byId: omitBy(state.byId, note => note.mapId === action.mapId)
            };
        case 'notes/isLoading':
            return {
                ...state,
                status: 'loading',
                error: undefined
            };
        case 'notes/isResolved':
            return {
                ...state,
                status: 'resolved',
                error: undefined
            };
        case 'notes/isRejected':
            return {
                ...state,
                status: 'rejected',
                error: action.error
            };
        default:
            return state;
    }
};

export default notes;
