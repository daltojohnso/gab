import keyBy from 'lodash/keyBy';
const initState = {
    byId: {}
};
const users = (state = initState, action) => {
    switch (action.type) {
        case 'users/addSubset':
            return {
                ...state,
                byId: {
                    ...state.byId,
                    ...keyBy(action.users, 'id')
                }
            };
        default:
            return state;
    }
};

export default users;
