import React from 'react';
import PropTypes from 'prop-types';
import {Map, TileLayer, Marker} from 'react-leaflet';

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
    }

    // TODO: normalize lat, lng for super-far-away map clicks -- may need to set maxBounds
    onClick(e) {
        const {lat, lng} = e.latlng;
        const position = [lat, lng];
        // this.setState({
        //     position,
        //     zoom: 7,
        //     newMarker: this.createMarker(position)
        // });

        this.props.onMapClick(position);
    }

    onMarkerClick(id) {
        this.props.onMarkerSelect(id);
    }

    createMarker(position, id) {
        return id ? (
            <Marker
                key={id}
                position={position}
                onClick={this.onMarkerClick.bind(this, id)}
            />
        ) : (
            <Marker key={id} position={location} />
        );
    }

    convertNotesToMarkers(notes) {
        return notes.map(note => {
            // value: `[${value.latitude}, ${value.longitude}]`
            const {latitude, longitude} = note.location;
            const position = [latitude, longitude];
            return this.createMarker(position, note.id);
        });
    }

    getPosition(position, selectedMarker) {
        if (selectedMarker) {
            return selectedMarker.location;
        }
        return position;
    }

    render() {
        const {position, zoom} = this.state;
        const {selectedMarker} = this.props;

        const focusedMarker = selectedMarker
            ? this.createMarker(selectedMarker.location, 'new-marker')
            : null;

        const markers = this.convertNotesToMarkers(this.props.notes);
        return (
            <Map
                style={{height: '100%', width: '100%'}}
                center={selectedMarker ? selectedMarker.location : position}
                zoom={selectedMarker ? 8 : zoom}
                worldCopyJump={true}
                ref={this.mapRef}
                onClick={this.onClick.bind(this)}
            >
                <TileLayer
                    attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {focusedMarker}
                {markers}
            </Map>
        );
    }
}

MarkerMap.propTypes = {
    notes: PropTypes.arrayOf(PropTypes.object),
    selectedMarker: PropTypes.object,
    onMapClick: PropTypes.func,
    onMarkerSelect: PropTypes.func
    // onClick: PropTypes.func
};

const noop = () => {};
MarkerMap.defaultProps = {
    notes: [],
    onMapClick: noop,
    onMarkerSelect: noop
    // onClick: () => {}
};

export default MarkerMap;
