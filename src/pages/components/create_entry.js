import * as config from '../../util/config.js';
import { useRef, useState } from 'react';

import '../../styles/entries.css';
import '../../styles/login.css';
import '../../styles/checkbox.css';

export const CreateEntry = () => {
    const entryInput = useRef();
    const titleInput = useRef();

    const [height, setHeight] = useState('0');

    const [label, setLabel] = useState('Public');
    const [buttonClass, setButtonClass] = useState('light');

    const toggle = () => {
        if (label === 'Public') {
            setLabel('Private');
            setButtonClass('dark');
        }
        else {
            setLabel('Public');
            setButtonClass('light');
        }
    }

    const createEntryAttempt = () => {
        // what do these lines do ???
        const title = titleInput.current.value.replace(/^\s+|\s+$/g, '');
        const content = entryInput.current.value.replace(/^\s+|\s+$/g, '');

        fetch(`${config.API_ROOT}create-entry/`, {
            method: 'POST',
            body: JSON.stringify({
                title: title,
                content: content,
                private: label === 'Private',
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
        padding: height === '0' ? '0 1em' : '1em 1em 0 1em',
    };

    return (
        <>
            <textarea ref={entryInput} className="newEntry" placeholder="Create a new entry" onFocus={handleFocus} onBlur={handleBlur} />
            <div style={groupStyle} className="saveEntryGroup">
                <div className={'box ' + buttonClass} onClick={toggle}>
                    <span>{label}</span>
                </div>
                <input ref={titleInput} className="newEntryTitleInput" type="text" placeholder="Title" />
                <div className="saveEntryButton" onClick={createEntryAttempt}>
                    <span>Save</span>
                </div>
            </div>
        </>
    );
};
