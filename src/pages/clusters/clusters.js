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
    const [feed, setFeed] = useState([]);
    const [showClusters, setShowClusters] = useState(true);

    const [tabStyles, setTabStyles] = useState({
        clusters: 'headerTabUnderline headerTabUnderlineSelected',
        feed: 'headerTabUnderline',
    });

    const searchInput = useRef();

    const entryJSONToElement = (e, feedEntry = false) => {
        return (
            <div className="clusterItem">
                <a className="entryLink" href={`/${e.entry_id}/`}>
                    <span className="clusterItemText clusterItemTimestamp">{splitTimestamp(e.timestamp).split(',')[0]}</span>
                    <span className="clusterItemText clusterItemTitle">{e.title}</span>
                    <span>—</span>
                    <span className="clusterItemText clusterItemContent">{e.content}</span>
                    <span style={{ flexGrow: '1' }}></span>
                </a>
                {feedEntry ?
                    <a className="clusterItemText clusterItemOptions feedUsername" href={`/user/${e.username}`}>{e.username}</a> :
                    <ClusterItemOptions entryId={e.entry_id} />
                }
            </div>
        )
    };

    const clusterJSONToElement = (cluster, feed = false) => {
        return (
            <div className="clusterContainer">
                {cluster.map(e => entryJSONToElement(e, feed))}
            </div>
        );
    };

    const fetchClusters = () => {
        let api = `${config.API_ROOT}clusters`;
        const url = window.location.href.split('/');
        if (url.length > 4) {
            api += `?username=${url[url.length - 2]}`;
        }

        fetch(api, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(res => res.json()).then(res => {
            setClusters(res);
        });
    };

    const fetchFeed = () => {
        fetch(`${config.API_ROOT}feed`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(res => res.json()).then(res => {
            setFeed(res.entries);
        });
    };

    const searchFilter = () => {
        const query = searchInput.current.value.toLowerCase();
        const filtered = clusters.map(c => c.filter(e => e.title.toLowerCase().includes(query) || e.content.toLowerCase().includes(query)));
        setFilteredClusters(filtered);
    };

    const setTab = (tab) => {
        let newStyles = Object.assign({}, tabStyles);
        for (const [key, _] of Object.entries(newStyles)) {
            newStyles[key] = 'headerTabUnderline';
        }

        newStyles[tab] = 'headerTabUnderline headerTabUnderlineSelected';

        setTabStyles(newStyles);

        if (tab === 'clusters') {
            setShowClusters(true);
        }
        else {
            setShowClusters(false);

            if (feed.length === 0) {
                fetchFeed();
            }
        }
    }

    useEffect(() => {
        fetchClusters();
    }, []);

    return (
        <>
            <Header />
            <div className="clusters">
                <div className="clustersContentContainer">
                    <div className="clusterHeaderTabContainer">
                        <div className="textLink headerTab" onClick={() => setTab('clusters')}>
                            <span>My clusters</span>
                            <div className={tabStyles.clusters} />
                        </div>
                        <div className="textLink headerTab" onClick={() => setTab('feed')}>
                            <span>Feed</span>
                            <div className={tabStyles.feed} />
                        </div>
                    </div>
                    {showClusters ?
                        <>
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
                            {(filteredClusters.length ? filteredClusters.map(c => clusterJSONToElement(c)) : clusters.map(c => clusterJSONToElement(c)))}
                        </>
                        : (feed.length ? feed.map(c => clusterJSONToElement(c, true)) : `There's nothing here...`)}
                </div>
            </div>
        </>
    );
}
