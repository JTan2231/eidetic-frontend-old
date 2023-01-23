import * as config from '../../util/config.js';
import { getCookie } from '../../util/cookie.js';
import { React, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

import '../../styles/index.css';
import '../../styles/login.css';
import '../../styles/header.css';

export const Login = () => {
    const usernameInput = useRef();
    const passwordInput = useRef();

    const [fieldClasses, setFieldClasses] = useState('loginField');

    const loginClick = () => {
        const username = usernameInput.current.value;
        const password = passwordInput.current.value;

        fetch(`${config.API_ROOT}login/`, {
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
                console.log('TODO');
            }
            else {
                setFieldClasses('loginField error');
            }
        });
    };

    const loginKeyPress = (e) => {
        if (e.key === 'Enter') {
            loginClick();
        }
    };

    if (getCookie('auth_token')) {
        return console.log('TODO: already logged in');
    }

    return (
        <div>
            <div className="header" style={{ justifyContent: 'center' }}>
                Eidetic
            </div>
            <div className="loginPage">
                <div>
                    <div className="loginContainer">
                        <input ref={ usernameInput } className={ fieldClasses } type="text" placeholder="Username" onKeyPress={ loginKeyPress } />
                        <input ref={ passwordInput } className={ fieldClasses } type="text" placeholder="Password" onKeyPress={ loginKeyPress } />
                        <button className="loginButton" onClick={ loginClick }>
                            Login
                        </button>
                    </div>
                    <div style={{ position: 'fixed', bottom: '3em', fontSize: '16px' }}>
                        No account?&nbsp;
                        <span class="textLink" onClick={ () => console.log('TODO: create user') }>Create one here</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
