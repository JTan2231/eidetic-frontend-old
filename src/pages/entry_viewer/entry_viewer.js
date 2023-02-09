import * as config from '../../util/config';
import { useEffect, useState } from 'react';
import { Header } from '../components/header';
import { Entry } from '../components/entry';

import '../../styles/entry_viewer.css';

function entryJSONToElement(entry) {
    return (
        <Entry id={entry.entry_id}
            title={entry.title}
            timestamp={entry.timestamp}
            content={entry.content} />
    );
}

export const EntryViewer = () => {
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        const url = window.location.href.split('/');
        const entry_id = url[url.length - 2];

        fetch(`${config.API_ROOT}entries/?entry_id=${entry_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(res => res.json()).then(res => {
            setEntries(res);
        });
    }, []);

    return (
        <>
            <Header />
            <div className="homeContainer">
                <div className="entryInteractionContainer">
                    {entries.map(e => entryJSONToElement(e))}
                </div>
            </div>
        </>
    );
}
