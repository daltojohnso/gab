import React from 'react';
import PropTypes from 'prop-types';
import {Map, TileLayer, Marker} from 'react-leaflet';
import {bindAll} from '~/util';
import {GeoPoint} from '~/firebase';
import noop from 'lodash/noop';
import L from 'leaflet';
import MapPinBlue from '~/img/map-pin-blue.svg';
import MapPinPink from '~/img/map-pin-pink.svg';

function getPinForUser (user) {
    return user.iconColor === 'pink' ? MapPinPink : MapPinBlue;
}

class MarkerMap extends React.Component {
    constructor (props) {
        super(props);
        // var corner1 = L.latLng(30.8077094,-83.2552247),
        //     corner2 = L.latLng(30.8712524,-83.3765805),
        //     bounds = L.latLngBounds(corner1, corner2);

        this.state = {
            position: [30, -50],
            zoom: 3,
            bounds: undefined
        };

        this.mapRef = React.createRef();
        bindAll(this, ['onViewportChange', 'onClick']);
    }

    // TODO: normalize lat, lng for super-far-away map clicks
    onClick (e) {
        const {lat, lng} = e.latlng;
        const position = [lat, lng];
        this.props.onMapClick(new GeoPoint(...position));
        setTimeout(() => {
            this.mapRef.current.leafletElement.invalidateSize();
            this.setState({position});
        });
    }

    onMarkerClick (id, position) {
        this.props.onMarkerClick(id);
        setTimeout(() => {
            this.mapRef.current.leafletElement.invalidateSize();
            this.setState({position});
        });
    }

    createMarker (note, usersById, fakeId) {
        const {
            id,
            createdBy,
            location: {latitude, longitude}
        } = note;
        const position = [latitude, longitude];
        const user = usersById[createdBy];

        const icon = new L.Icon({
            iconUrl: getPinForUser(user),
            className: 'gab--leaflet-icon text-black h-7 w-7'
        });

        return (
            <Marker
                icon={icon}
                key={id || fakeId}
                position={position}
                tabindex="0"
                onClick={() =>
                    fakeId ? null : this.onMarkerClick(id, position)
                }
            />
        );
    }

    onViewportChange ({zoom}) {
        this.setState({zoom});
    }

    render () {
        const {position, zoom, bounds} = this.state;
        const {selectedNote, notes, usersById} = this.props;

        const filteredNotes = selectedNote
            ? notes.filter(note => note.id !== selectedNote.id)
            : notes;
        const pendingMarker = selectedNote
            ? this.createMarker(
                selectedNote,
                usersById,
                selectedNote.id || 'pending-marker'
            )
            : null;

        const markers = filteredNotes.map(note =>
            this.createMarker(note, usersById)
        );

        return (
            <Map
                animate={true}
                style={{height: '100%', width: '100%'}}
                center={position}
                zoom={zoom}
                worldCopyJump={true}
                ref={this.mapRef}
                onViewportChange={this.onViewportChange}
                onClick={this.onClick}
                bounds={bounds}
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
    usersById: PropTypes.object,
    selectedNote: PropTypes.object,
    onMapClick: PropTypes.func,
    onMarkerClick: PropTypes.func,
    position: PropTypes.array
};

MarkerMap.defaultProps = {
    notes: [],
    usersById: {},
    onMapClick: noop,
    onMarkerClick: noop
};

// https://www.npmjs.com/package/react-leaflet-div-icon
// https://www.npmjs.com/package/react-leaflet-locate-control
// https://yuzhva.github.io/react-leaflet-markercluster/
// https://github.com/smeijer/leaflet-geosearch/blob/develop/src/providers/openStreetMapProvider.js
// https://react-leaflet.js.org/docs/en/custom-components.html
// https://www.npmjs.com/package/is-mobile for disabling movement

export default MarkerMap;
