import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import values from 'lodash/values';
import { fetchMaps, addMap } from '~/store/actions/maps';
import NavBar from '~/components/NavBar.jsx';
import classnames from 'classnames';
import mapImg from '~/img/map.png';
import MapIcon from 'react-feather/dist/icons/map';
import PlusIcon from 'react-feather/dist/icons/plus';
import TrashIcon from 'react-feather/dist/icons/trash-2';
import { Link, useHistory } from 'react-router-dom';

function useMaps () {
    const byId = useSelector(state => state.maps.byId);
    const dispatch = useDispatch();
    const fetchAll = useCallback(() => {
        dispatch(fetchMaps());
    }, [dispatch]);
    const list = useMemo(() => values(byId), [byId]);
    const [isCreating, setIsCreating] = useState(false);

    const create = useCallback(async () => {
        if (isCreating) return;
        setIsCreating(true);

        try {
            await dispatch(addMap());
            // eslint-disable-next-line no-empty
        } catch (err) {}

        setIsCreating(false);
    }, [dispatch, isCreating]);

    return {
        byId,
        list,
        fetchAll,
        create
    };
}

// <div className="flex flex-col justify-between cursor-pointer bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200 ease-in-out h-64 w-64 border border-1 border-grey-lighter">
//     <h2 className="text-2xl px-2 py-1 flex justify-start items-center border-b">
//         <MapIcon className="mr-2 flex-shrink-0" />
//         {map.name}
//     </h2>
//     <div className="overflow-hidden">
//         <img
//             src={mapImg}
//             className=""
//             style={{ transform: 'scale(1.75)' }}
//         />
//     </div>
// </div>

const MapLink = ({ map }) => {
    return (
        <Link
            class="pb-1 flex justify-start items-center hover:underline"
            to={`/map/${map.id}`}
        >
            <MapIcon className="mr-2 flex-shrink-0" />
            <span>{map.name}</span>
        </Link>
    );
};

const MapCardView = () => {
    const { list, fetchAll, create } = useMaps();
    const history = useHistory();

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    const onClick = e => {
        const mapId = e.currentTarget.dataset.id;
        history.push(`/map/${mapId}`);
    };

    return (
        <>
            <NavBar header="maps"></NavBar>
            <main className="w-full h-auto relative pt-8 px-8">
                <div className="text-xl">
                    {list.map(map => (
                        <MapLink map={map} key={map.id} onClick={onClick} />
                    ))}
                    <a
                        tabIndex="0 "
                        onClick={create}
                        className="cursor-pointer flex justify-start items-center hover:underline"
                    >
                        <PlusIcon className="mr-2 flex-shrink-0" />
                        <span>Create map</span>
                    </a>
                </div>
            </main>
        </>
    );
};

export default MapCardView;
