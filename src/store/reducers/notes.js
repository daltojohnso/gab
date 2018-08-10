const initState = {};
const notes = (state = initState, action) => {
    let map, notes;
    switch (action.type) {
        case 'notes/setNotes':
            map = state[action.mapId];
            return {
                ...state,
                [action.mapId]: {
                    ...map,
                    notes: action.notes
                    // worth it to convert to map?
                    // most scenarios right now I just need the list
                    // notes: keyBy(action.notes, 'id')
                }
            };
        case 'notes/setNote':
            map = state[action.mapId];
            notes = map.notes.concat(action.note);
            return {
                ...state,
                [action.mapId]: {
                    ...map,
                    notes
                }
            };
        default:
            return state;
    }
};

export default notes;
