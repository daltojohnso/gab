import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import UserIcon from 'react-feather/dist/icons/user';
import { bindAll } from '~/util';

class UserButton extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            isActive: false
        };

        bindAll(this, [
            'onToggle',
            'onBlur',
            'onFocus',
            'onKeyUpToggle',
            'onKeyUpSignOut',
            { onSignOut: 'props.onSignOut' }
        ]);
    }

    onToggle () {
        this.setState(prevState => ({
            isActive: !prevState.isActive
        }));
    }

    onBlur () {
        // lets the next focus event fire before closing the dropdown
        setTimeout(() => {
            this.setState({
                isActive: false
            });
        });
    }

    onFocus () {
        // puts the focus event AFTER the state setting in `onBlur`
        // so that we can keep the dropdown open when focus is on the sign out button.
        setTimeout(() => {
            this.setState({
                isActive: true
            });
        });
    }

    onKeyUpToggle (e) {
        const key = e.key;
        this.setState(prevState => {
            if (key === 'Enter') {
                return { isActive: !prevState.isActive };
            } else if (key === 'Escape') {
                return { isActive: false };
            } else {
                return {};
            }
        });
    }

    onKeyUpSignOut (e) {
        const { key } = e;
        if (key === 'Enter') {
            this.props.onSignOut();
        } else if (key === 'Escape') {
            this.setState({
                isActive: false
            });
        }
    }

    render () {
        const { isActive } = this.state;
        const {
            user: { displayName, email }
        } = this.props;

        return (
            <div className={classnames('relative', this.props.className)}>
                <div
                    className="cursor-pointer w-10 h-10 shadow-md border border-indigo rounded-full bg-white flex justify-center items-center"
                    tabIndex="0"
                    onClick={this.onToggle}
                    onKeyUp={this.onKeyUpToggle}
                    onBlur={this.onBlur}
                >
                    <UserIcon className="h-7 w-7 text-indigo" />
                </div>
                <div
                    className={classnames(
                        { hidden: !isActive },
                        'absolute inset-auto right-0 bg-white opacity-90 shadow rounded border overflow-hidden mt-1'
                    )}
                >
                    <div className="p-4 border border-t-0 border-r-0 border-l-0 border-b-1 w-full">
                        {displayName || email}
                    </div>
                    <a
                        className="m-1 p-3 hover:bg-grey-lighter text-black block w-auto"
                        tabIndex="0"
                        onClick={this.onSignOut}
                        onFocus={this.onFocus}
                        onBlur={this.onBlur}
                        onKeyUp={this.onKeyUpSignOut}
                    >
                        Sign out
                    </a>
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
