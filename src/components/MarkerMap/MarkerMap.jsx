import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { GeoPoint } from '~/firebase';
import noop from 'lodash/noop';
import L from 'leaflet';
import MapPinBlue from '~/img/map-pin-blue.svg';
import MapPinPink from '~/img/map-pin-pink.svg';
import styled from 'styled-components';

const MapWrapper = styled.div`
    @media screen and (max-width: 767px) {
        .leaflet-left .leaflet-control-zoom {
            display: flex;
        }
    }
`;

function getPinForUser (user) {
    return user.iconColor === 'pink' ? MapPinPink : MapPinBlue;
}

const MarkerMap = ({
    notes,
    usersById,
    selectedNote,
    onMapClick: emitMapClick,
    onMarkerClick: emitMarkerClick
}) => {
    const [position, setPosition] = useState([30, -50]);
    const [zoom, setZoom] = useState(3);
    const mapRef = useRef(undefined);

    // TODO: normalize lat, lng for super-far-away map clicks
    const onClick = e => {
        const { lat, lng } = e.latlng;
        const newPosition = [lat, lng];
        emitMapClick(new GeoPoint(...newPosition));
        setTimeout(() => {
            mapRef.current.leafletElement.invalidateSize();
            setPosition(newPosition);
        });
    };

    // this doesn't work yet as of 1.4.0
    const onMarkerKeyUp = e => {
        if (e.key === 'Enter') {
            onMarkerClick(e);
        }
    };

    const onMarkerClick = e => {
        const {
            target: {
                options: { hasFakeId, realId: id, position }
            }
        } = e;
        if (hasFakeId) return;

        emitMarkerClick(id);
        setTimeout(() => {
            mapRef.current.leafletElement.invalidateSize();
            setPosition(position);
        });
    };

    const createMarker = (note, usersById, fakeId) => {
        const {
            id,
            createdBy,
            location: { latitude, longitude }
        } = note;
        const position = [latitude, longitude];
        const user = usersById[createdBy];

        const icon = new L.Icon({
            iconUrl: getPinForUser(user),
            className: 'gab--leaflet-icon text-black h-7 w-7',
            iconSize: [24, 24],
            iconAnchor: [12, 24]
        });

        return (
            <Marker
                icon={icon}
                key={id || fakeId}
                position={position}
                tabindex="0"
                realId={id}
                hasFakeId={!!fakeId}
                onClick={onMarkerClick}
                onKeyUp={onMarkerKeyUp}
            />
        );
    };

    const onViewportChange = ({ zoom }) => {
        setZoom(zoom);
    };

    const filteredNotes = selectedNote
        ? notes.filter(note => note.id !== selectedNote.id)
        : notes;
    const pendingMarker = selectedNote
        ? createMarker(
            selectedNote,
            usersById,
            selectedNote.id || 'pending-marker'
        )
        : null;

    const markers = filteredNotes.map(note => createMarker(note, usersById));

    return (
        <MapWrapper className="h-full w-full">
            <Map
                animate={true}
                style={{ height: '100%', width: '100%' }}
                center={position}
                zoom={zoom}
                worldCopyJump={true}
                ref={mapRef}
                onViewportChange={onViewportChange}
                onClick={onClick}
            >
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {pendingMarker}
                {markers}
            </Map>
        </MapWrapper>
    );
};

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
