import get from 'lodash/get';
// import keyBy from 'lodash/keyBy';

const initState = {
    maps: null,
    selectedMap: null
};

const maps = (state = initState, action) => {
    let map;
    switch (action.type) {
        case 'maps/setMaps':
            return {
                ...state,
                maps: action.maps
            };
        case 'maps/selectMap':
            map = get(state.maps, ['0']);
            return {
                ...state,
                selectedMap: map
            };
        default:
            return state;
    }
};

export default maps;
