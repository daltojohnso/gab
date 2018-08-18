import NavBar from './NavBar.jsx';
import {connect} from 'react-redux';

const mapStateToProps = state => ({
    isLoading: state.nav.status === 'loading'
});

export default connect(
    mapStateToProps,
)(NavBar);
