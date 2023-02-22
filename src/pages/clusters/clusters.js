import * as config from '../../util/config';
import { splitTimestamp } from '../../util/formatting';
import { Header } from '../components/header';
import { CreateEntry } from '../components/create_entry';
import { ClusterItemOptions } from '../components/cluster_item_options';
import { useState, useEffect, useRef } from 'react'

import '../../styles/index.css';
import '../../styles/clusters.css';
import '../../styles/search.css';

export const Clusters = () => {
    const [clusters, setClusters] = useState([]);
    const [filteredClusters, setFilteredClusters] = useState([]);
    const searchInput = useRef();

    const clusterJSONToElement = (cluster) => {
        return (
            <div className="clusterContainer">
                {
                    cluster.map(e => (
                        <div className="clusterItem">
                            <a className="entryLink" href={`/${e.entry_id}/`}>
                                <span className="clusterItemText clusterItemTimestamp">{splitTimestamp(e.timestamp).split(',')[0]}</span>
                                <span className="clusterItemText clusterItemTitle">{e.title}</span>
                                <span>—</span>
                                <span className="clusterItemText clusterItemContent">{e.content}</span>
                                <span style={{ flexGrow: '1' }}></span>
                            </a>
                            <ClusterItemOptions entryId={e.entry_id} />
                        </div>
                    ))
                }
            </div>
        );
    };

    const fetchClusters = () => {
        fetch(`${config.API_ROOT}clusters`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(res => res.json()).then(res => {
            setClusters(res);
        });
    };

    const searchFilter = () => {
        const query = searchInput.current.value.toLowerCase();
        const filtered = clusters.map(c => c.filter(e => e.title.toLowerCase().includes(query)));
        setFilteredClusters(filtered);
    };

    useEffect(() => {
        fetchClusters();
    }, []);

    return (
        <>
            <Header />
            <div className="clusters">
                <div className="clustersContentContainer">
                    <div className="containerWrapper">
                        <div className="newEntryContainer">
                            <CreateEntry />
                        </div>
                    </div>
                    <div className="clustersContentTitle">
                        Clustered Entries
                    </div>
                    <div className="searchFieldContainer">
                        <input ref={searchInput} className="searchField" type="text" placeholder="Search" onChange={searchFilter} />
                    </div>
                    {filteredClusters.length ? filteredClusters.map(c => clusterJSONToElement(c)) : clusters.map(c => clusterJSONToElement(c))}
                </div>
            </div>
        </>
    );
}
