import React from 'react';
import './Header.css';

const Header = ({handleRandom}) => {
    return (
        <>
            <section className="title">Creator Creator</section>
            <section className="subtitle">Enter in two animals to create a creature</section>
            <p className="random" onClick={handleRandom}>
                <span>Random Creature</span>
            </p>
        </>
    )
}

export default Header;