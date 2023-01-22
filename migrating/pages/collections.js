import * as config from '../util/config.js';
import { getCookie } from '../util/cookie.js';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Header } from '../components/header.js';
import { CollectionsList } from '../components/collections_list.js';

import '../styles/collections.css';

const fetchEntriesByCollection = (props, setter) => {
    fetch(`${config.API_ROOT}entriesbycollection/?user_id=${getCookie('user_id')}&max=3`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${getCookie('auth_token')}`,
        },
    }).then(res => res.json()).then(res => {
        setter(res);
    });
}

const fetchCollection = (props, setter) => {
    return fetch(`${config.API_ROOT}collectionentries/?user_id=${getCookie('user_id')}&collection_id=${props.collectionid}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${getCookie('auth_token')}`,
        },
    }).then(res => res.json()).then(res => {
        setter(res);
    });
}

const importFunction = (n) => {
    fetch(`${config.API_ROOT}imports/`, {
        method: 'POST',
        body: JSON.stringify({
            user_id: getCookie('user_id'),
            channel: 'people-s-thoughts',
        }),
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${getCookie('auth_token')}`,
        }
    }).then(res => res.json()).then(res => {
        n(0);
    });
}

export const Collections = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [collections, setCollections] = useState([]);
    const [showNewEntry, setShowNewEntry] = useState(true);

    const props = location.state ? location.state : {};
    useEffect(() => {
        if (getCookie('auth_token')) {
            if (!props.collectionid) {
                fetchEntriesByCollection(props, setCollections);
            }
            else {
                fetchCollection(props, setCollections);
            }
        }
    }, [props.collectionid]);

    if (!getCookie('auth_token')) {
        return <Navigate to="/login" />;
    }

    const headerProps = {
        token: props.token,
        viewing: props.viewing ? props.viewing : 'Collections',
        reset: () => {},
    };

    const collectionsListProps = {
        userid: getCookie('user_id'),
        username: getCookie('username'),
        token: getCookie('auth_token'),
        collections: collections,
        viewing: props.viewing,
        fetchCollection: (p) => {
            p = {
                ...p.parentProps,
                collectionid: p.collectionid,
                viewing: p.collectionTitle,
            };

            navigate(`/${p.username}/collections/${p.viewing}`, { state: p });
            fetchCollection(p, setCollections);
        },
    };

    return (
        <div className="centerPage">
            <Header { ...headerProps } />
            <button onClick={ () => importFunction(navigate) }>IMPORT</button>
            <CollectionsList { ...collectionsListProps } />
        </div>
    );
}
