import keyBy from 'lodash/keyBy';

const initState = {};
const notes = (state = initState, action) => {
    let map;
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
        default:
            return state;
    }
};

export default notes;
