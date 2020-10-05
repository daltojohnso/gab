import keyBy from 'lodash/keyBy';

const initState = {
    byId: {},
    state: 'resolved',
    error: undefined
};

const maps = (state = initState, action) => {
    let mapId;
    switch (action.type) {
        case 'maps/setSubset':
            return {
                ...state,
                byId: {
                    ...state.byId,
                    ...keyBy(action.maps, 'id')
                }
            };
        case 'maps/remove':
            mapId = action.mapId;
            delete state.byId[mapId];
            return {
                ...state,
                byId: {
                    ...state.byId
                }
            };
        case 'maps/isLoading':
            return {
                ...state,
                status: 'loading',
                error: undefined
            };
        case 'maps/isResolved':
            return {
                ...state,
                status: 'resolved',
                error: undefined
            };
        case 'maps/isRejected':
            return {
                ...state,
                status: 'rejected',
                error: action.error
            };
        default:
            return state;
    }
};

export default maps;
