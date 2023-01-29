import * as config from '../../util/config';
import { useEffect, useState } from 'react';
import { Header } from '../components/header';
import { Entry } from '../components/entry';
import { CreateEntry } from '../components/create_entry';

function entryJSONToElement(entry) {
    return <Entry id={entry.entry_id} title={entry.title} timestamp={entry.timestamp} content={entry.content} />
}

export const Home = () => {
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        fetch(`${config.API_ROOT}entries`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(res => res.json()).then(res => {
            setEntries(res)
        });
    }, []);

    return (
        <div style={{ width: 'calc(50vw - 2 * var(--body-padding))', height: '100vh' }}>
            <Header />
            <div className="containerWrapper">
                <div className="newEntryContainer">
                    <CreateEntry />
                </div>
            </div>
            {entries.map(e => entryJSONToElement(e))}
        </div>
    );
}
