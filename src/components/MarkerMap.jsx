import React, {
    useState,
    useRef,
    useEffect,
    useCallback,
    useMemo
} from 'react';
import PropTypes from 'prop-types';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { GeoPoint } from '~/firebase';
import noop from 'lodash/noop';
import get from 'lodash/get';
import L from 'leaflet';
import MapPinBlue from '~/img/map-pin-blue.svg';
import MapPinPink from '~/img/map-pin-pink.svg';
import styled from 'styled-components';
import CenterButton from './CenterButton.jsx';

function useCurrentLocation () {
    const [currentLocation, setCurrentLocation] = useState();
    useEffect(() => {
        let alive = true;
        navigator.geolocation.getCurrentPosition(pos => {
            if (alive)
                setCurrentLocation([pos.coords.latitude, pos.coords.longitude]);
        });

        return () => {
            alive = false;
        };
    }, []);
    return currentLocation;
}

const MapWrapper = styled.div`
    @media screen and (max-width: 767px) {
        .leaflet-left .leaflet-control-zoom {
            display: flex;
        }
    }
`;

function getPin (note) {
    return note.iconColor === 'pink' ? MapPinPink : MapPinBlue;
}

function createIconedMarkers (note, id, onMarkerClick, setPosition) {
    const {
        location: { latitude, longitude }
    } = note;
    const position = [latitude, longitude];

    const icon = new L.Icon({
        iconUrl: getPin(note),
        className: 'text-black h-7 w-7',
        iconSize: [24, 24],
        iconAnchor: [12, 24]
    });

    const onKeyDown = e => {
        const code = get(e, 'originalEvent.code');
        if (code === 'Enter') {
            onMarkerClick(e);
        } else if (code === 'Tab') {
            setPosition(position);
        }
    };

    return (
        <Marker
            keyboard={true}
            icon={icon}
            key={id}
            position={position}
            markerId={id}
            onClick={onMarkerClick}
            onKeyDown={onKeyDown}
        />
    );
}

function useLocalStorageItem (key) {
    const ref = useRef();

    useMemo(() => {
        const jsonItem = localStorage.getItem(key);
        ref.current = jsonItem ? JSON.parse(jsonItem) : undefined;
    }, [key]);

    const setItem = useCallback(
        newItem => {
            ref.current = newItem;
            const jsonItem = newItem ? JSON.stringify(newItem) : '';
            localStorage.setItem(key, jsonItem);
        },
        [key]
    );

    return [ref.current, setItem];
}

function usePosition (selectedMarker) {
    const currentLocation = useCurrentLocation();
    const [savedCoords, saveCoords] = useLocalStorageItem(
        'MappyMap:MarkerMap:Coords'
    );
    // const ref = useRef(savedCoords);
    const [position, setPosition] = useState(savedCoords);

    useEffect(() => {
        if (!selectedMarker) return;
        const {
            location: { latitude, longitude }
        } = selectedMarker;
        const pos = [latitude, longitude];
        setPosition(pos);
    }, [selectedMarker]);

    const setAndSavePosition = useCallback(
        pos => {
            setPosition(pos);
            saveCoords(pos);
        },
        [saveCoords]
    );

    useEffect(() => {
        if (!position) {
            setPosition(currentLocation);
        }
    }, [position, currentLocation]);

    return [position, setAndSavePosition];
}

const MarkerMap = ({
    markers,
    selectedMarker,
    onMapClick: emitMapClick,
    onMarkerClick: emitMarkerClick
}) => {
    const [position, setPosition] = usePosition(selectedMarker);
    const [zoom, setZoom] = useState(18);

    const centerAndZoomIn = pos => {
        // position isn't totally controlled so need to make sure it is not already at center
        setPosition([0, 0]);
        setPosition(pos);
        setZoom(18);
    };

    const onClick = useCallback(
        e => {
            const { lat, lng } = e.latlng;
            const newPosition = [lat, lng];
            setPosition(newPosition);
            emitMapClick(new GeoPoint(...newPosition));
            // setTimeout(() => {
            // mapRef.current.leafletElement.invalidateSize();
            // });
        },
        [emitMapClick, setPosition]
    );

    const onMarkerClick = useCallback(
        e => {
            const {
                target: {
                    options: { markerId, position }
                }
            } = e;
            if (markerId === 'SELECTED_MARKER') return;

            setPosition(position);
            emitMarkerClick(markerId);
            // setTimeout(() => {
            //     mapRef.current.leafletElement.invalidateSize();
            // });
        },
        [emitMarkerClick, setPosition]
    );

    const onViewportChange = useCallback(({ zoom }) => {
        setZoom(zoom);
    }, []);

    // const {
    //     iconedSelectedMarker,
    //     iconedMarkers
    // } = useMemo(() => {
    //     const markersSansSelected = selectedMarker && selectedMarker.id
    //         ? markers.filter(note => note.id !== selectedMarker.id)
    //         : markers;
    //     const iconedSelectedMarker = selectedMarker
    //         ? createIconedMarkers(selectedMarker, 'SELECTED_MARKER', onMarkerClick, setPosition)
    //         : null;
    //     const iconedMarkers = markersSansSelected.map(note => createIconedMarkers(note, note.id, onMarkerClick, setPosition));
    //     return {iconedSelectedMarker, iconedMarkers};
    // }, [selectedMarker, markers, onMarkerClick, setPosition]);

    const markersSansSelected =
        selectedMarker && selectedMarker.id
            ? markers.filter(note => note.id !== selectedMarker.id)
            : markers;
    const iconedSelectedMarker = selectedMarker
        ? createIconedMarkers(
            selectedMarker,
            'SELECTED_MARKER',
            onMarkerClick,
            setPosition
        )
        : null;
    const iconedMarkers = markersSansSelected.map(note =>
        createIconedMarkers(note, note.id, onMarkerClick, setPosition)
    );

    return (
        <MapWrapper className="h-full w-full">
            <Map
                keyboard={true}
                animate={true}
                style={{ height: '100%', width: '100%' }}
                center={position || [0, 0]}
                zoom={zoom}
                worldCopyJump={true}
                onViewportChange={onViewportChange}
                onClick={onClick}
            >
                <CenterButton onClick={centerAndZoomIn}></CenterButton>
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {iconedSelectedMarker}
                {iconedMarkers}
            </Map>
        </MapWrapper>
    );
};

MarkerMap.propTypes = {
    markers: PropTypes.arrayOf(PropTypes.object),
    selectedMarker: PropTypes.object,
    onMapClick: PropTypes.func,
    onMarkerClick: PropTypes.func
};

MarkerMap.defaultProps = {
    markers: [],
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
