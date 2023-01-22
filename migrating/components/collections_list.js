import { formatTitle, formatTimestamp } from '../util/formatting.js';
import { getCookie } from '../util/cookie.js';
import { useNavigate } from 'react-router-dom';

import { CreateEntry } from './create_entry.js';

import '../styles/entries.css'; 

export const CollectionsList = (props) => {
    const navigate = useNavigate();

    let collections = [];

    for (const collection of props.collections) {
        const p = {
            parentProps: {
                userid: props.userid,
                username: props.username,
                token: props.token,
            },

            collectionid: collection.collection_id,
            collectionTitle: collection.title,
        };

        const pClick = props.viewing ? () => {
            navigate(`/`, { state: p.parentProps });
        } : props.fetchCollection;

        let entries = [
            <div tabIndex="0" className="collectionTitle" onClick={ () => pClick(p) }>
                <div className="entryContentContainer">
                    <div className="titleContainer">
                        <span className="entryTitle">{ props.viewing ? '' : formatTitle(collection.title) }</span>
                        <span className="entryTimestamp">{ props.viewing ? '' : formatTimestamp(collection.datetime_created) }</span>
                    </div>
                    <div className="collectionPreview">
                        { props.viewing ? 'Return to all collections' : `Click to view ${collection.count} entries` }
                    </div>
                </div>
            </div>
        ].concat(collection.entries.map(entryObject => {
            const clickFunction = () => {
                navigate(`/${getCookie('username')}/entries/${entryObject.id}`, {
                    state: Object.assign({}, p.parentProps, {
                        entryid: entryObject.id,
                    }),
                });
            };

            return (
                <div tabIndex="0" className="entry" onClick={ clickFunction }>
                    <div className="entryContentContainer">
                        <div className="titleContainer">
                            <span className="entryTitle">{ formatTitle(entryObject.title) }</span>
                            <span className="entryTimestamp">{ formatTimestamp(entryObject.timestamp) }</span>
                        </div>
                        <div className="entryPreview">
                            { entryObject.text_preview }
                        </div>
                    </div>
                </div>
            )
        }));

        collections.push(entries);
    }

    collections = collections.map(collection => (
        <div className="containerWrapper">
            <div className="entryContainer">
                { collection }
            </div>
        </div>
    ));

    if (!props.viewing) {
        collections.unshift(
            <div className="containerWrapper">
                <div className="newEntryContainer">
                    <CreateEntry { ...props } />
                </div>
            </div>
        );
    }
     
    return (
        <div>
            { collections }
        </div>
    );
}
