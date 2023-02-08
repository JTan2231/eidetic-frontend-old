import * as config from '../../util/config.js';
import { useRef, useState } from 'react';

import '../../styles/index.css';
import '../../styles/login.css';
import '../../styles/header.css';

export const CreateUser = () => {
    const usernameInput = useRef();
    const passwordInput = useRef();

    const [fieldClasses, setFieldClasses] = useState('loginField');

    const createClick = () => {
        const username = usernameInput.current.value;
        const password = passwordInput.current.value;

        fetch(`${config.API_ROOT}create-user/`, {
            method: 'POST',
            body: JSON.stringify({
                username: username,
                password: password,
            }),
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
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

    const createKeyPress = (e) => {
        if (e.key === 'Enter') {
            createClick();
        }
    };

    return (
        <div>
            <div className="header headerBackground" style={{ justifyContent: 'center' }}>
                Eidetic
            </div>
            <div className="loginPage">
                <div className="loginContainer">
                    <div className="loginFieldContainer">
                        <input ref={usernameInput} className={fieldClasses} type="text" placeholder="New username" onKeyPress={createKeyPress} />
                    </div>
                    <div className="loginFieldContainer">
                        <input ref={passwordInput} className={fieldClasses} type="password" placeholder="New password" onKeyPress={createKeyPress} />
                    </div>
                    <button className="loginButton" onClick={createClick}>
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
}
