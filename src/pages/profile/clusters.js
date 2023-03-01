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
    const [followText, setFollowText] = useState('Follow');
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
                        </div>
                    ))
                }
            </div>
        );
    };

    const getUrlUsernameParam = () => {
        const url = window.location.href.split('/');
        if (url.length > 4) {
            return url[url.length - 2];
        }

        return '';
    }

    const fetchClusters = () => {
        const api = `${config.API_ROOT}clusters?username=${getUrlUsernameParam()}`;
        fetch(api, {
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
        const filtered = clusters.map(c => c.filter(e => e.title.toLowerCase().includes(query) || e.content.toLowerCase().includes(query)));
        setFilteredClusters(filtered);
    };

    const followClick = () => {
        fetch(`${config.API_ROOT}follow/`, {
            method: 'POST',
            body: JSON.stringify({
                followee_username: getUrlUsernameParam(),
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(res => res.json()).then(res => {
            setFollowText(res.status === 'followed' ? 'Unfollow' : 'Follow');
        });
    };

    const checkFollow = () => {
        fetch(`${config.API_ROOT}follow/?followee_username=${getUrlUsernameParam()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(res => res.json()).then(res => {
            console.log(res);
            setFollowText(res.following ? 'Unfollow' : 'Follow');
        });
    };

    useEffect(() => {
        fetchClusters();
        checkFollow();
    }, []);

    return (
        <>
            <Header />
            <div className="clusters">
                <div className="clustersContentContainer">
                    {clusters[0] !== 'NOUSER' ? (
                        <>
                            <div className="clustersContentTitle">
                                {`${getUrlUsernameParam()}'s `}Clustered Entries
                            </div>
                            <div className="saveEntryButton followButton" onClick={followClick}>
                                <span>{followText}</span>
                            </div>
                            <div className="searchFieldContainer">
                                <input ref={searchInput} className="searchField" type="text" placeholder="Search" onChange={searchFilter} />
                            </div>
                            {(filteredClusters.length ? filteredClusters.map(c => clusterJSONToElement(c)) : clusters.map(c => clusterJSONToElement(c)))}
                        </>
                    ) : `This user does not exist`}
                </div>
            </div>
        </>
    );
}
