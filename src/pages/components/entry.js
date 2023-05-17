import * as config from '../../util/config';
import { useState, useEffect, useRef } from 'react';
import { splitTimestamp } from '../../util/formatting';

import '../../styles/index.css';
import '../../styles/search.css';
import '../../styles/entries.css';
import '../../styles/entry_viewer.css';

export const Entry = (props) => {
    const [related, setRelated] = useState([]);
    const [filteredRelated, setFilteredRelated] = useState([]);
    const [id, setID] = useState(-1);
    const [textClasses, setTextClasses] = useState('entryContent textClipped');
    const [showText, setShowText] = useState('Show more');

    const searchInput = useRef();

    useEffect(() => {
        setID(props.id);
    }, []);

    const fetchRelated = () => {
        fetch(`${config.API_ROOT}entry-links/?entry_id=${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(res => res.json()).then(res => {
            const entries = res.entries;
            setRelated(entries);
        });
    };

    const showMore = () => {
        setTextClasses('entryContent');
        setShowText('Show less');
    };

    const showLess = () => {
        setTextClasses('entryContent textClipped');
        setShowText('Show more');
    };

    const entryJSONToEntryOutline = (entryJSON) => {
        const seeRelatedButtonStyle = {
            display: related.length ? 'none' : '',
        };

        return (
            <div className="entryOutline">
                <div className="entry">
                    <div className="entryTitle">{entryJSON.title}</div>
                    <div className="entryTimestamp">{splitTimestamp(entryJSON.timestamp)}</div>
                    <div className="entryPrivate">{entryJSON.private ? 'Private' : ''}</div>
                    <div className={textClasses}>{entryJSON.content}</div>
                    <div className="entryActionBar">
                        {entryJSON.display ? (
                            <>
                                <span className="profileLinkWrapper">Saved by <a className="profileLink" href={`/user/${props.username}`}>{props.username}</a></span>
                                <span className="entryAction" onClick={showText === 'Show more' ? showMore : showLess}>{showText}</span>
                                <span style={seeRelatedButtonStyle} className="entryAction" onClick={fetchRelated}>
                                    See related
                                </span>
                            </>
                        ) : ''}
                    </div>
                </div>
            </div>
        );
    };

    const relatedJSONToListElements = (relatedJSON) => {
        return (
            <div className={relatedJSON.private ? 'relatedItemDark' : 'relatedItem'}>
                <a href={`/${relatedJSON.entry_id}`} className="entryLink">
                    <span className="relatedItemText relatedItemTimestamp">{splitTimestamp(relatedJSON.timestamp).split(',')[0]}</span>
                    <span className="relatedItemText relatedItemTitle">{relatedJSON.title}</span>
                    <span>—</span>
                    <span className="relatedItemText relatedItemContent">{relatedJSON.content}</span>
                </a>
            </div>
        )
    };

    const searchFilter = () => {
        const query = searchInput.current.value.toLowerCase();
        const filtered = related.filter(e => (e.title.toLowerCase().includes(query) || e.content.toLowerCase().includes(query)));
        setFilteredRelated(filtered);
    };

    const relatedContainerStyle = {
        display: related.length ? '' : 'none',
    };

    return (
        <div className="entryBlock">
            {entryJSONToEntryOutline(props)}

            <div style={relatedContainerStyle} className="relatedListContainer">
                <div className="relatedListTitle">
                    Related Entries
                </div>
                <div className="searchFieldContainer">
                    <input ref={searchInput} className="searchField" type="text" placeholder="Search" onChange={searchFilter} />
                </div>
                <div className="relatedItemContainer">
                    {(filteredRelated.length || searchInput.current?.value.length ? filteredRelated : related).map(r => relatedJSONToListElements(r))}
                </div>
            </div>
        </div>
    );
}
