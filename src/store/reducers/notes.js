import keyBy from 'lodash/keyBy';
const initState = {
    byId: {},
    status: 'resolved'
};
const notes = (state = initState, action) => {
    let noteId;
    switch (action.type) {
        // will I ever need this?
        // clobber the entire store of notes
        // with, presumably, "all" notes, but
        // what is "all" when notes can be shared?
        case 'notes/setAll':
            return {
                ...state,
                byId: keyBy(action.notes, 'id')
            };
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
                ...state
            };
        case 'notes/isLoading':
            return {
                ...state,
                status: 'loading'
            };
        case 'notes/isResolved':
            return {
                ...state,
                status: 'resolved'
            };
        case 'notes/isRejected':
            return {
                ...state,
                status: 'rejected'
            };
        case 'notes/resetState':
            return {
                ...state,
                status: 'resolved'
            };
        default:
            return state;
    }
};

export default notes;
