import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import UserIcon from 'react-feather/dist/icons/user';
import styled from 'styled-components';

const DropdownTrigger = styled.div`
    height: 28px;
    width: 28px;
`;

const StyledUserIcon = styled(UserIcon)`
    height: 28px;
    width: 28px;
    border-radius: 50%;
    cursor: pointer;
    color: #363636;
    background-color: whitesmoke;
`;

class UserButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isActive: false
        };
    }

    toggle() {
        this.setState(prevState => ({
            isActive: !prevState.isActive
        }));
    }

    render() {
        const {isActive} = this.state;
        const {
            user: {displayName, email},
            onSignOut
        } = this.props;
        return (
            <div className={classNames(this.props.className)}>
                <div
                    className={classNames('dropdown', 'is-right', {
                        'is-active': isActive
                    })}
                    tabIndex="0"
                    onClick={() => this.toggle()}
                >
                    <DropdownTrigger className="dropdown-trigger">
                        <StyledUserIcon />
                    </DropdownTrigger>
                    <div className="dropdown-menu" role="menu">
                        <div className="dropdown-content">
                            <div className="dropdown-item">
                                {displayName || email}
                            </div>
                            <hr className="dropdown-divider" />
                            <a
                                className="dropdown-item"
                                tabIndex="0"
                                onClick={() => onSignOut()}
                            >
                                Sign out
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

UserButton.propTypes = {
    className: PropTypes.string,
    user: PropTypes.object,
    onSignOut: PropTypes.func
};

UserButton.defaultProps = {
    user: {}
};

export default UserButton;
