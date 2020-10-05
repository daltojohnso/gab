import Footer from './Footer.jsx';
import {connect} from 'react-redux';

const mapStateToProps = state => ({
    status: state.notes.status
});

export default connect(
    mapStateToProps
)(Footer);
