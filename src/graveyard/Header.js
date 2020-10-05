import Header from './Header.jsx';
import {connect} from 'react-redux';

const mapStateToProps = state => ({
    isLoading: state.notes.status === 'loading',
    isRejected: state.notes.status === 'rejected',
});

export default connect(
    mapStateToProps
)(Header);
