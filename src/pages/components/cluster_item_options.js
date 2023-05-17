import { useState } from 'react';
import '../../styles/clusters.css';
import { API_ROOT } from '../../util/config';

export const ClusterItemOptions = (props) => {
    const [optionSelect, setOptionSelect] = useState([]);

    const closeMenu = () => {
        setOptionSelect([]);
    };

    const deleteEntry = () => {
        fetch(`${API_ROOT}delete-entry/`, {
            method: 'POST',
            body: JSON.stringify({
                entry_id: props.entryId,
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.ok && res.status !== 400) {
                location.reload();
            }

            return res.json();
        }).then(res => {
            if (res.errors) {
                alert(res.errors);
            }
        });
    }

    const togglePrivacy = () => {
        fetch(`${API_ROOT}entries/`, {
            method: 'PATCH',
            body: JSON.stringify({
                entry_id: props.entryId,
                private: !props.private,
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => {
            if (res.ok && res.status !== 400) {
                location.reload();
            }
        });
    }

    const optionsClick = (e) => {
        const positionStyle = {
            left: `${e.clientX + 10}px`,
            top: `${e.clientY}px`,
        };

        setOptionSelect(
            <>
                <div className="clusterItemOptionSelectBackground" onClick={closeMenu}></div>
                <div className="clusterItemOptionSelect" style={positionStyle}>
                    <div className="selectMenuOption" onClick={togglePrivacy}>Toggle privacy</div>
                    <div className="selectMenuOption" onClick={deleteEntry}>Delete entry</div>
                </div>
            </>
        );
    };

    return (
        <>
            <span className="clusterItemText clusterItemOptions" onClick={optionsClick}>
                <svg fill="black" width="16" height="16" viewBox="0 0 14 14">
                    <rect width="2" height="2" rx="1" transform="matrix(-1 0 0 1 5 6)" />
                    <rect width="2" height="2" rx="1" transform="matrix(-1 0 0 1 8 6)" />
                    <rect width="2" height="2" rx="1" transform="matrix(-1 0 0 1 11 6)" />
                </svg>
            </span>
            {optionSelect}
        </>
    );
}
