import React from 'react';
import PropTypes from 'prop-types';
import EditIcon from 'react-feather/dist/icons/edit';
import XIcon from 'react-feather/dist/icons/x';
import TrashIcon from 'react-feather/dist/icons/trash-2';
import MapPinIcon from 'react-feather/dist/icons/map-pin';
import {Icon} from './Components.jsx';
import get from 'lodash/get';
import head from 'lodash/head';
import Spinner from '../Spinner/Spinner.jsx';
import styled from 'styled-components';

const HeaderSpinner = styled(Spinner)`
    margin: 0 0.75rem;
`;

const HeaderError = styled.span`
    font-weight: normal;
    font-style: oblique;
    font-size: 0.7rem;
    color: red;
    margin: 0 0.75rem;
`;

class Header extends React.PureComponent {
    constructor (props) {
        super(props);
    }

    componentWillUnmount () {
        clearTimeout(this.timeoutId);
    }

    start (base) {
        this.props.onNewEditorMode(base);
        this.props.onModeChange({
            base: [base],
            hover: null
        });
    }

    confirm (mode) {
        const initialBase = head(this.props.mode.base);
        this.props.onModeChange({
            base: [initialBase, mode],
            hover: null
        });

        clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(() => {
            this.props.onModeChange({
                base: [initialBase]
            });
        }, 3000);
    }

    hover (mode) {
        if (this.props.mode.base.find(base => base === mode)) return;
        this.props.onModeChange({
            hover: mode
        });
    }

    clearHover (mode) {
        if (this.props.mode.hover === mode) {
            this.props.onModeChange({
                hover: null
            });
        }
    }

    tryToClose () {
        if (this.props.canCloseImmediately()) {
            this.props.onCancel();
        } else {
            this.confirm('cancel');
        }
    }

    render () {
        const {
            note,
            mode,
            isLoading,
            isRejected
        } = this.props;
        const editing = head(mode.base) === 'editing';
        const canCloseImmediately = this.props.canCloseImmediately();
        const header = note && note.id ? note.title || 'Note' : 'New Note';
        return (
            <div className="card-header">
                <p className="card-header-title">
                    <i>
                        {header + (canCloseImmediately ? '' : '*')}
                    </i>
                    {isLoading && (
                        <HeaderSpinner size="15px" border="2px solid #000"></HeaderSpinner>
                    )}
                    {isRejected && (
                        <HeaderError>That didn{'\''}t work. Try again?</HeaderError>
                    )}
                </p>
                {!editing && (
                    <Icon
                        onClick={() => this.start('editing')}
                        onMouseOver={() => this.hover('editing')}
                        onMouseOut={() => this.clearHover('editing')}
                    >
                        <EditIcon />
                    </Icon>
                )}
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
                        onClick={() => this.tryToClose()}
                        onMouseOver={() => this.hover('cancel')}
                        onMouseOut={() => this.clearHover('cancel')}
                    >
                        <XIcon />
                    </Icon>
                )}
                {!editing && (
                    <Icon
                        onClick={() => this.tryToClose()}
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
    isLoading: PropTypes.bool,
    isRejected: PropTypes.bool,
    note: PropTypes.object,
    mode: PropTypes.object,
    canCloseImmediately: PropTypes.func,
    onCancel: PropTypes.func,
    onNewEditorMode: PropTypes.func,
    onModeChange: PropTypes.func
};

export default Header;
