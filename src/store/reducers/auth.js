const initState = {
    isReady: false,
    user: null
};
const auth = (state = initState, action) => {
    switch (action.type) {
        case 'auth/isReady':
            return {
                ...state,
                isReady: true
            };
        case 'auth/userChanged':
            return {
                ...state,
                user: action.user
            };
        default:
            return state;
    }
};

export default auth;
