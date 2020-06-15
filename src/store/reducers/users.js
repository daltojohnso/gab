import keyBy from 'lodash/keyBy';
const initState = {
    byId: {},
    state: 'resolved'
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

        case 'users/isLoading':
            return {
                ...state,
                status: 'loading'
            };
        case 'users/isResolved':
            return {
                ...state,
                status: 'resolved'
            };
        case 'users/isRejected':
            return {
                ...state,
                status: 'rejected'
            };
        default:
            return state;
    }
};

export default users;
