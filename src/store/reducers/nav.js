const initState = {
    status: 'resolved'
};

const nav = (state = initState, action) => {
    switch (action.type) {
        case 'nav/isLoading':
            return {
                ...state,
                status: 'loading'
            };
        case 'nav/isResolved':
            return {
                ...state,
                status: 'resolved'
            };
        case 'nav/isRejected':
            return {
                ...state,
                status: 'rejected'
            };
        default:
            return state;
    }
};

export default nav;
