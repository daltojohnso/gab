import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';

const NotesList = ({notes}) => (
    <div />
);

NotesList.propTypes = {
    notes: PropTypes.array,
    onNoteClick: PropTypes.func
};

NotesList.defaultProps = {
    notes: [],
    onNoteClick: noop
};

export default NotesList;
