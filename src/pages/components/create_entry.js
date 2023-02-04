import * as config from '../../util/config.js';
import { useRef, useState } from 'react';

import '../../styles/entries.css';
import '../../styles/login.css';


export const CreateEntry = () => {
    const entryInput = useRef();
    const titleInput = useRef();

    const [height, setHeight] = useState('0');

    const createEntryAttempt = () => {
        fetch(`${config.API_ROOT}create-entry/`, {
            method: 'POST',
            body: JSON.stringify({
                title: titleInput.current.value,
                content: entryInput.current.value,
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => res.json()).then(() => {
            window.location.reload();
        });
    };

    const handleFocus = () => {
        setHeight('2em');
    };

    const handleBlur = () => {
        const inp = entryInput.current;
        if (inp && inp.value.length > 0) {
            setHeight('2em');
        }
        else {
            setHeight('0');
            titleInput.current.value = '';
        }
    };

    const groupStyle = {
        height: height,
        opacity: height === '0' ? '0' : '1',
        padding: height === '0' ? '0 1em' : '1px 1em 1em',
    };

    return (
        <>
            <textarea ref={entryInput} className="newEntry" placeholder="Create a new entry" onFocus={handleFocus} onBlur={handleBlur} />
            <div style={groupStyle} className="saveEntryGroup">
                <input ref={titleInput} className="newEntryTitleInput" type="text" placeholder="Title" />
                <div className="saveEntryButton" onClick={createEntryAttempt}>
                    <span>Save</span>
                </div>
            </div>
        </>
    );
};
