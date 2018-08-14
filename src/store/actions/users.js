import {db} from '~/firebase';
import isEmpty from 'lodash/isEmpty';

export const fetchUsers = userIds => {
    return dispatch => {
        if (isEmpty(userIds)) return;

        const userRef = db.collection('users');
        userIds.forEach(id => {
            userRef.where('uid', '==', id);
        });
        userRef.get().then(userSnapshot => {
            const users = userSnapshot.docs.map(doc => {
                const data = doc.data();
                data.id = doc.id;
                return data;
            });

            dispatch(addSubsetOfUsers(users));
        });
    };
};

export const addSubsetOfUsers = users => ({
    type: 'users/addSubset',
    users
});
