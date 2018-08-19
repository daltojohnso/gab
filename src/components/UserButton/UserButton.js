import UserButton from './UserButton.jsx';
import {connect} from 'react-redux';
import {signOut} from '~/store/actions/auth';

const mapStateToProps = state => ({
    user: state.auth.user
});

const mapDispatchToProps = dispatch => ({
    onSignOut: () => dispatch(signOut())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserButton);
