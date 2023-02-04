import * as config from '../../util/config';
import { splitTimestamp } from '../../util/formatting';
import { Header } from '../components/header';
import { CreateEntry } from '../components/create_entry';
import { useState, useEffect } from 'react'

import '../../styles/clusters.css';

export const Clusters = () => {
    const [clusters, setClusters] = useState([]);

    const fetchClusters = () => {
        fetch(`${config.API_ROOT}clusters`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(res => res.json()).then(res => {
            const cluster_elements = res.map(c => (
                <div className="clusterContainer">
                    {
                        c.map(e => (
                            <a className="entryLink" href={`/${e.entry_id}/`}>
                                <div className="clusterItem">
                                    <span className="clusterItemText clusterItemTimestamp">{splitTimestamp(e.timestamp).split(',')[0]}</span>
                                    <span className="clusterItemText clusterItemTitle">{e.title}</span>
                                    <span>—</span>
                                    <span className="clusterItemText clusterItemContent">{e.content}</span>
                                </div>
                            </a>
                        ))
                    }
                </div>
            ));

            setClusters(cluster_elements);
        });
    };

    useEffect(() => {
        fetchClusters();
    }, []);

    return (
        <>
            <Header />
            <div className="clusters">
                <div className="containerWrapper">
                    <div className="newEntryContainer">
                        <CreateEntry />
                    </div>
                </div>
                {clusters}
            </div>
        </>
    );
}
