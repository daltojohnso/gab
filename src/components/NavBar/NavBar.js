import NavBar from './NavBar.jsx';
import {connect} from 'react-redux';

const mapStateToProps = state => ({
    isLoading: state.nav.status === 'loading',
    isRejected: state.nav.status === 'rejected'
});

export default connect(
    mapStateToProps,
)(NavBar);
