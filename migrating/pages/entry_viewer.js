import * as config from '../util/config.js';
import { getCookie } from '../util/cookie.js';
import { splitTimestamp } from '../util/formatting.js';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Header } from '../components/header.js';

import '../styles/entry_viewer.css';

const fetchEntry = (props, setter) => {
    return fetch(`${config.API_ROOT}entries/?id=${props.entryid}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${getCookie('auth_token')}`,
        },
    }).then(res => res.json()).then(res => {
        res.content = res.content.split('\n').filter(c => c.length > 0).map(c => (<p>{ c }</p>));

        setter(res);
    });
}

export const EntryViewer = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const urlPath = location.pathname.split('/');
    const entryid = urlPath[urlPath.length-1];

    const [entry, setEntry] = useState({
        title: '',
        timestamp: '',
        content: '',
    })

    const props = location.state ? location.state : {};
    useEffect(() => {
        if (props) {
            fetchEntry(Object.assign({}, props, { entryid: entryid }), setEntry);
        }
    }, [props]);

    if (!getCookie('auth_token')) {
        return <Navigate to="/" />;
    }

    const headerProps = {
        token: props.token,
        viewing: entry.title,
        goBack: (
            <span className="textLink goBack" onClick={ () => navigate(-1) }>
                Go back
            </span>
        ),
        reset: () => {},
    };

    return (
        <div>
            <Header { ...headerProps } />
            <div className="entryWrapper centerPage">
                <div className="entryViewerTitle">
                    { entry.title }
                </div>
                <div className="entryViewerTimestamp">
                    { splitTimestamp(entry.timestamp) }
                </div>
                <div className="entryViewerContainer">
                    <div className="entryViewerContent">
                        <div className="entryViewerDisplay">
                            { entry.content }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
