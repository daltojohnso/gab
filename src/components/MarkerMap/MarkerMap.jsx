import React from 'react';
import PropTypes from 'prop-types';
import {Map, TileLayer, Marker} from 'react-leaflet';
import random from 'lodash/random';

// https://www.npmjs.com/package/react-leaflet-div-icon
// https://www.npmjs.com/package/react-leaflet-locate-control
// https://yuzhva.github.io/react-leaflet-markercluster/
// https://github.com/smeijer/leaflet-geosearch/blob/develop/src/providers/openStreetMapProvider.js
// https://react-leaflet.js.org/docs/en/custom-components.html

// https://www.npmjs.com/package/is-mobile for disabling movement
class MarkerMap extends React.Component {
    constructor(props) {
        super(props);
        const {markers} = props;
        const marker = markers[random(0, markers.length - 1)];
        this.state = {
            position: marker ? marker.position : [0, 0],
            zoom: 3
        };
        this.mapRef = React.createRef();
    }

    // TODO: normalize lat, lng for super-far-away map clicks
    // may need to set maxBounds
    onClick(e) {
        const {lat, lng} = e.latlng;
        const position = [lat, lng];
        this.setState({
            position,
            zoom: 7,
            newMarker: this.createMarker(position)
        });

        this.props.onNewMarker(position);
    }

    createMarker(position) {
        return <Marker position={position} />;
    }

    render() {
        const {position, zoom, newMarker} = this.state;
        const {markers} = this.props;
        return (
            <Map
                style={{height: '100%', width: '100%'}}
                center={position}
                zoom={zoom}
                worldCopyJump={true}
                ref={this.mapRef}
                onClick={this.onClick.bind(this)}
            >
                <TileLayer
                    attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {newMarker}
                {markers}
            </Map>
        );
    }
}

MarkerMap.propTypes = {
    markers: PropTypes.arrayOf(PropTypes.object),
    onNewMarker: PropTypes.func
    // onClick: PropTypes.func
};

MarkerMap.defaultProps = {
    markers: [],
    onNewMarker: () => {}
    // onClick: () => {}
};

export default MarkerMap;
