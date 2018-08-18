import React from 'react';
import PropTypes from 'prop-types';
import EditIcon from 'react-feather/dist/icons/edit';
import XIcon from 'react-feather/dist/icons/x';
import TrashIcon from 'react-feather/dist/icons/trash-2';
import MapPinIcon from 'react-feather/dist/icons/map-pin';
import {Icon} from './Components.jsx';
import get from 'lodash/get';
import head from 'lodash/head';

class Header extends React.PureComponent {
    constructor (props) {
        super(props);
    }

    start (base) {
        this.props.onNewBase(base);
        this.props.onNewMode({
            base: [base],
            hover: null
        });
    }

    confirm (mode) {
        const initialBase = head(this.props.mode.base);
        this.props.onNewMode({
            base: [initialBase, mode],
            hover: null
        });

        clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(() => {
            this.props.onNewMode({
                base: [initialBase]
            });
        }, 3000);
    }

    hover (mode) {
        if (this.props.mode.base.find(base => base === mode)) return;
        this.props.onNewMode({
            hover: mode
        });
    }

    clearHover (mode) {
        if (this.props.mode.hover === mode) {
            this.props.onNewMode({
                hover: null
            });
        }
    }

    render () {
        const {
            note,
            mode,
            onClose
        } = this.props;
        const editing = head(mode.base) === 'editing';

        return (
            <div className="card-header">
                <p className="card-header-title">
                    <em>
                        {note && note.id ? note.title || 'Note' : 'New Note'}
                    </em>
                </p>
                <Icon
                    onClick={() => this.start('editing')}
                    onMouseOver={() => this.hover('editing')}
                    onMouseOut={() => this.clearHover('editing')}
                >
                    <EditIcon />
                </Icon>
                <Icon
                    onClick={() => this.start('moving')}
                    onMouseOver={() => this.hover('moving')}
                    onMouseOut={() => this.clearHover('moving')}
                >
                    <MapPinIcon />
                </Icon>
                {get(note, 'id') && (
                    <Icon
                        onClick={() => this.confirm('delete')}
                        onMouseOver={() => this.hover('delete')}
                        onMouseOut={() => this.clearHover('delete')}
                    >
                        <TrashIcon />
                    </Icon>
                )}
                {editing && (
                    <Icon
                        onClick={() => onClose()}
                        onMouseOver={() => this.hover('cancel')}
                        onMouseOut={() => this.clearHover('cancel')}
                    >
                        <XIcon />
                    </Icon>
                )}
                {!editing && (
                    <Icon
                        onClick={() => onClose()}
                        onMouseOver={() => this.hover('close')}
                        onMouseOut={() => this.clearHover('close')}
                    >
                        <XIcon />
                    </Icon>
                )}
            </div>
        );
    }
}

Header.propTypes = {
    note: PropTypes.object,
    mode: PropTypes.object,
    onClose: PropTypes.func,
    onNewBase: PropTypes.func,
    onNewMode: PropTypes.func
};

export default Header;
