import keyBy from 'lodash/keyBy';

const initState = {
    byId: {},
    selectedMapId: null
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
        default:
            return state;
    }
};

export default maps;
