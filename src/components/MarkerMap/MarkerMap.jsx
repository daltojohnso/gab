import React from 'react';
import PropTypes from 'prop-types';
import {Map, TileLayer, Marker} from 'react-leaflet';
import {bindAll} from '~/util';
import {GeoPoint} from '~/firebase';
// https://www.npmjs.com/package/react-leaflet-div-icon
// https://www.npmjs.com/package/react-leaflet-locate-control
// https://yuzhva.github.io/react-leaflet-markercluster/
// https://github.com/smeijer/leaflet-geosearch/blob/develop/src/providers/openStreetMapProvider.js
// https://react-leaflet.js.org/docs/en/custom-components.html

// https://www.npmjs.com/package/is-mobile for disabling movement
class MarkerMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            position: [0, 0],
            zoom: 3
        };

        this.mapRef = React.createRef();
        bindAll(this, ['onViewportChange', 'onClick']);
    }

    // TODO: normalize lat, lng for super-far-away map clicks
    onClick(e) {
        const {lat, lng} = e.latlng;
        const position = [lat, lng];
        this.props.onMapClick(new GeoPoint(...position));
        this.setState({
            position
        });
    }

    onMarkerClick(id, position) {
        this.props.onMarkerSelect(id);
        this.setState({position});
    }

    createMarker(note, fakeId) {
        const {
            id,
            location: {latitude, longitude}
        } = note;
        const position = [latitude, longitude];
        return (
            <Marker
                key={id || fakeId}
                position={position}
                onClick={() => this.onMarkerClick(id, position)}
            />
        );
    }

    onViewportChange({zoom}) {
        this.setState({zoom});
    }

    render() {
        const {position, zoom} = this.state;
        const {selectedNote, notes} = this.props;

        const pendingMarker =
            selectedNote && !selectedNote.id
                ? this.createMarker(selectedNote, 'pending-marker')
                : null;

        const markers = notes.map(note => this.createMarker(note));
        return (
            // no -- you can't use styled(Map).
            <Map
                animate={true}
                style={{height: '100%', width: '100%'}}
                center={position}
                zoom={zoom}
                worldCopyJump={true}
                ref={this.mapRef}
                onViewportChange={this.onViewportChange}
                onClick={this.onClick}
            >
                <TileLayer
                    attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {pendingMarker}
                {markers}
            </Map>
        );
    }
}

MarkerMap.propTypes = {
    notes: PropTypes.arrayOf(PropTypes.object),
    selectedNote: PropTypes.object,
    onMapClick: PropTypes.func,
    onMarkerSelect: PropTypes.func,
    position: PropTypes.array
};

const noop = () => {};
MarkerMap.defaultProps = {
    notes: [],
    onMapClick: noop,
    onMarkerSelect: noop
};

export default MarkerMap;
