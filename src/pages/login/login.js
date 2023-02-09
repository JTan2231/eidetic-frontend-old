import * as config from '../../util/config.js';
import { getCookie } from '../../util/cookie.js';
import { useRef, useState, useEffect } from 'react';

import '../../styles/index.css';
import '../../styles/login.css';
import '../../styles/header.css';

export const Login = () => {
    const usernameInput = useRef();
    const passwordInput = useRef();

    const [fieldClasses, setFieldClasses] = useState('loginField');

    useEffect(() => {
        usernameInput.current.focus();
    }, []);

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
                'X-CSRFToken': getCookie('csrftoken'),
            }
        }).then(res => {
            if (res.status === 200) {
                window.location.href = '/';
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

    const headerLinkStyle = {
        textDecoration: 'none',
        color: 'black',
        zIndex: 1,
        justifyContent: 'center',
    };

    return (
        <div>
            <a href="/" style={headerLinkStyle} className="header headerBackground">
                <div>Eidetic</div>
            </a>
            <div className="loginPage">
                <div>
                    <div className="loginContainer">
                        <div className="loginFieldContainer">
                            <input ref={usernameInput} className={fieldClasses} type="text" placeholder="Username" onKeyPress={loginKeyPress} />
                        </div>
                        <div className="loginFieldContainer">
                            <input ref={passwordInput} className={fieldClasses} type="password" placeholder="Password" onKeyPress={loginKeyPress} />
                        </div>
                        <button className="loginButton" onClick={loginClick}>
                            Log in
                        </button>
                    </div>
                    <div style={{ position: 'fixed', bottom: '3em', fontSize: '16px' }}>
                        No account?&nbsp;
                        <a class="textLink" href="/new_user">Create one here</a>
                    </div>
                </div>
            </div>
        </div >
    );
}
