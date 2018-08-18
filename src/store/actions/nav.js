export const isLoading = () => ({
    type: 'nav/isLoading'
});

export const isResolved = () => ({
    type: 'nav/isResolved'
});

export const isRejected = () => ({
    type: 'nav/isRejected'
});

export default {
    isLoading,
    isResolved,
    isRejected
};
