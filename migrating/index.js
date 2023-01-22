import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from 'react-router-dom';

import { Collections } from './pages/collections.js';
import { EntryViewer } from './pages/entry_viewer.js';
import { Login } from './pages/login.js';
import { CreateUser } from './pages/create_user.js';

import './styles/index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={ <Collections /> } />
                <Route path="/login" element={ <Login /> } />
                <Route path="/create-user" element={ <CreateUser/> } />
                <Route path="/:username/collections/:collectionid" element={ <Collections /> } />
                <Route path="/:username/entries/:entryid" element={ <EntryViewer /> } />

                <Route path="*" element={ <Navigate to="/" /> } />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);
