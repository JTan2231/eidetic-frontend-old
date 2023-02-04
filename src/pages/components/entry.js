import * as config from '../../util/config';
import { useState, useEffect } from 'react';
import { splitTimestamp } from '../../util/formatting';

import '../../styles/entries.css';

export const Entry = (props) => {
    const [related, setRelated] = useState([]);
    const [id, setID] = useState(-1);
    const [textClasses, setTextClasses] = useState('entryContent textClipped');
    const [showText, setShowText] = useState('Show more');

    useEffect(() => {
        setID(props.id);
    }, []);

    // create an array of props from here to the root of the thread
    const getThread = (children) => {
        children.push(props);

        if (props.getThread !== undefined) {
            children = props.getThread(children);
        }

        return children;
    };

    const getThreadClick = () => {
        props.setThread(getThread([]));
    }

    const fetchRelated = () => {
        fetch(`${config.API_ROOT}entry-links/?entry_id=${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(res => res.json()).then(res => {
            const entries = res.entries;
            setRelated(entries.map(r => (
                <Entry id={r.entry_id} title={r.title} timestamp={r.timestamp} content={r.content} getThread={getThread} setThread={props.setThread} />
            )));
        });
    };

    const collapse = () => {
        setRelated([]);
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
        return (
            <div className="entryOutline">
                <div className="entry">
                    <div className="entryTitle">{entryJSON.title}</div>
                    <div className="entryTimestamp">{splitTimestamp(entryJSON.timestamp)}</div>
                    <div className={textClasses}>{entryJSON.content}</div>
                    <div className="entryActionBar">
                        <span className="entryAction" onClick={getThreadClick}>Show thread</span>
                        <span className="entryAction" onClick={showText === 'Show more' ? showMore : showLess}>{showText}</span>
                        <span className="entryAction" onClick={related.length > 0 ? collapse : fetchRelated}>
                            {related.length > 0 ? 'Collapse' : 'See related'}
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="entryBlock">
            {entryJSONToEntryOutline(props)}
            {related}
        </div>
    );
}
