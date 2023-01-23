import * as config from '../../util/config.js';
import { getCookie } from '../../util/cookie.js';
import { useRef, useState } from 'react';

import '../../styles/index.css';
import '../../styles/login.css';
import '../../styles/header.css';

export const CreateUser = () => {
    const usernameInput = useRef();
    const passwordInput = useRef();

    const [fieldClasses, setFieldClasses] = useState('loginField');

    const createClick = async () => {
        const username = usernameInput.current.value;
        const password = passwordInput.current.value;

        await fetch(`${config.API_ROOT}create-user/`, {
            method: 'POST',
            body: JSON.stringify({
                username: username,
                password: password,
            }),
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => res.json()).then(res => {
            if (res.token) {
                console.log('TODO: create-user http request');
            }
            else {
                setFieldClasses('loginField error');
            }
        });
    };

    const createKeyPress = (e) => {
        if (e.key === 'Enter') {
            createClick();
        }
    };

    return (
        <div>
            <div className="header" style={{ justifyContent: 'center' }}>
                Eidetic
            </div>
            <div className="loginPage">
                <div className="loginContainer">
                    <input ref={ usernameInput } className={ fieldClasses } type="text" placeholder="Username" onKeyPress={ createKeyPress } />
                    <input ref={ passwordInput } className={ fieldClasses } type="password" placeholder="Password" onKeyPress={ createKeyPress } />
                    <button className="loginButton" onClick={ createClick }>
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
}
