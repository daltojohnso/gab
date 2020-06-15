import keyBy from 'lodash/keyBy';

const initState = {
    byId: {},
    selectedMapId: undefined,
    state: 'resolved'
};

const maps = (state = initState, action) => {
    switch (action.type) {
        case 'maps/setSubset':
            return {
                ...state,
                byId: {
                    ...state.byId,
                    ...keyBy(action.maps, 'id')
                }
            };
        case 'maps/setSelectedMap':
            return {
                ...state,
                selectedMapId: action.selectedMapId
            };

        case 'maps/isLoading':
            return {
                ...state,
                status: 'loading'
            };
        case 'maps/isResolved':
            return {
                ...state,
                status: 'resolved'
            };
        case 'maps/isRejected':
            return {
                ...state,
                status: 'rejected'
            };
        default:
            return state;
    }
};

export default maps;
