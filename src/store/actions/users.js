import { db } from '~/firebase';
import isEmpty from 'lodash/isEmpty';
import { getDataWithId } from '~/util';

function withStatusUpdates (cb) {
    return async (...args) => {
        const [dispatch] = args;
        dispatch(isLoading());
        try {
            await cb(...args);
            dispatch(isResolved());
        } catch (err) {
            dispatch(isRejected(err));
        }
    };
}

async function fetchAll (userIds) {
    const userRef = db.collection('users');
    userIds.forEach(id => {
        userRef.where('uid', '==', id);
    });
    const snapshot = await userRef.get();
    const users = getDataWithId(snapshot.docs);
    return users;
}

export const fetchUsers = userIds => {
    if (isEmpty(userIds)) return;
    return withStatusUpdates(async dispatch => {
        const users = await fetchAll(userIds);
        dispatch(addSubsetOfUsers(users));
    });
};

export const fetchUsersOfMap = mapId => {
    return (dispatch, getState) => {
        const state = getState();
        const map = state.maps.byId[mapId];
        if (!map) return;
        const sharedWith = Object.keys(map.sharedWith);
        return dispatch(fetchUsers(sharedWith));
    };
};

export const addSubsetOfUsers = users => ({
    type: 'users/addSubset',
    users
});

export const isLoading = () => ({
    type: 'users/isLoading'
});

export const isResolved = () => ({
    type: 'users/isResolved'
});

export const isRejected = () => ({
    type: 'users/isRejected'
});
