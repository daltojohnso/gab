import MapListView from './MapListView.jsx';
import {connect} from 'react-redux';
import {fetchMaps} from '~/store/actions/maps';
import values from 'lodash/values';

const mapStateToProps = state => {
    return {
        maps: values(state.maps.byId),
        usersById: state.users.byId
    };
};

const mapDispatchToProps = dispatch => ({
    fetchMaps: () => dispatch(fetchMaps())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MapListView);
