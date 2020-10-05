import keyBy from 'lodash/keyBy';
const initState = {
    byId: {},
    state: 'resolved',
    error: undefined
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
                status: 'loading',
                error: undefined
            };
        case 'users/isResolved':
            return {
                ...state,
                status: 'resolved',
                error: undefined
            };
        case 'users/isRejected':
            return {
                ...state,
                status: 'rejected',
                error: action.error
            };
        default:
            return state;
    }
};

export default users;
