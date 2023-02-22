import * as config from '../../util/config.js';
import { getCookie, deleteAllCookies } from '../../util/cookie.js';
import { formatTitle, formatTimestamp } from '../../util/formatting.js';
import { useState, useEffect, useRef } from 'react';

import '../../styles/header.css';

const AccountMenu = (props) => {
    return (
        <div id="account" className="menuDropdown">
            <div className="menuDropdownContents">
                <div id="topMenuItem" className="textLink menuDropdownItem" onClick={props.logoutClick}>
                    Log out
                </div>
            </div>
        </div>
    );
};

export const Header = (props) => {
    const navbar = useRef();

    const logoutClick = () => {
        fetch(`${config.API_ROOT}logout/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(res => {
            if (res.status === 200) {
                window.location.href = '/login';
            }
        });
    };

    const pageTitle = typeof props.viewing === 'string' ? formatTitle(props.viewing) : props.viewing;

    return (
        <>
            <div className="fixed">
                <div className="headerBackground">
                    <div className="header">
                        <div className="logo headerOptionLeftmost"><a href="/" style={{ textDecoration: 'none', color: 'black' }}>Eidetic</a></div>
                        <div className="headerOption pageTitle">
                            <div className="textLink">
                                {pageTitle}
                            </div>
                        </div>
                        <div className="headerOption headerOptionRightmost">
                            <span className="textLink" onClick={logoutClick}>Log out</span>
                        </div>
                    </div>
                </div>
                <div className="fauxHeader" />
            </div>
            <div ref={navbar} className="navbar">
                {props.goBack ? props.goBack : pageTitle}
            </div>
        </>
    );
}
