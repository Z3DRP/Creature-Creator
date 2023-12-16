import React from 'react';
import './NoStats.css';

const NoStats = () => {
    return (
        <div className="message">
            <div className="overlay">
                <div className="content">
                    <span className="x">X</span>
                    <h2>Sorry...</h2>
                    <p>No stats are available for this creature; it is too rare or elusive </p>
                </div>
            </div>
        </div>
    )
}

export default NoStats;