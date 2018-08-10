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

    // TODO: normalize lat, lng for super-far-away map clicks
    onClick(e) {
        const {lat, lng} = e.latlng;
        const position = [lat, lng];
        this.props.onMapClick(position);
        this.setState({
            position
        });
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
            const {latitude, longitude} = note.location;
            return this.createMarker([latitude, longitude], note.id);
        });
    }

    onViewportChange({zoom}) {
        this.setState({zoom});
    }

    render() {
        const {position, zoom} = this.state;
        const {newNote} = this.props;

        const newNoteMarker = newNote
            ? this.createMarker(newNote.location, 'new-note')
            : null;

        const markers = this.convertNotesToMarkers(this.props.notes);
        return (
            <Map
                animate={true}
                style={{height: '100%', width: '100%'}}
                center={position}
                zoom={zoom}
                worldCopyJump={true}
                ref={this.mapRef}
                onViewportChange={this.onViewportChange.bind(this)}
                onClick={this.onClick.bind(this)}
            >
                <TileLayer
                    attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {newNoteMarker}
                {markers}
            </Map>
        );
    }
}

MarkerMap.propTypes = {
    notes: PropTypes.arrayOf(PropTypes.object),
    newNote: PropTypes.object,
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
