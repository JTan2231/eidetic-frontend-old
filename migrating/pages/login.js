import * as config from '../util/config.js';
import { getCookie } from '../util/cookie.js';
import { useRef, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';

import '../styles/login.css';
import '../styles/header.css';

export const Login = () => {
    const navigate = useNavigate();

    const usernameInput = useRef();
    const passwordInput = useRef();

    const [fieldClasses, setFieldClasses] = useState('loginField');

    const loginClick = async () => {
        const username = usernameInput.current.value;
        const password = passwordInput.current.value;

        await fetch(`${config.API_ROOT}login/`, {
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
                navigate(`/`, {
                    state: {},
                });
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
        return (<Navigate to="/" />);
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
                        <span class="textLink" onClick={ () => navigate('/create-user') }>Create one here</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
