import * as config from '../util/config.js';
import { getCookie } from '../util/cookie.js';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../styles/entries.css';
import '../styles/login.css';


export const CreateEntry = (props) => {
    const entryInput = useRef();
    const titleInput = useRef();

    const navigate = useNavigate();

    const [height, setHeight] = useState('0');

    const createEntryAttempt = () => {
        fetch(`${config.API_ROOT}create-entry/`, {
            method: 'POST',
            body: JSON.stringify({
                user: props.userid,
                title: titleInput.current.value,
                content: entryInput.current.value,
            }),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${getCookie('auth_token')}`,
            }
        }).then(res => res.json()).then(res => {
            navigate(0);
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
            <textarea ref={ entryInput } className="newEntry" placeholder="Create a new entry" onFocus={ handleFocus } onBlur={ handleBlur } />
            <div style={ groupStyle } className="saveEntryGroup">
                <input ref={ titleInput } className="newEntryTitleInput" type="text" placeholder="Title" />
                <div className="saveEntryButton" onClick={ createEntryAttempt }>
                    <span>Save</span>
                </div>
            </div>
        </>
    );
};
