import React from 'react';
import './Body.css';
// zac
const Body = ({
    animalOne,
    setAnimalOne,
    animalTwo,
    setAnimalTwo,
    getCreature,
    hasImage,
    animalStats
}) => {
    return (
        <>
            <div className="column left-column">
                <section className="input-container">
                <input className="input animal" type="text" value={animalOne} placeholder="Animal One" onChange={e => setAnimalOne(e.target.value)} required/>
                <input className="input animal" type="text" value={animalTwo} placeholder="Animal Two" onChange={e => setAnimalTwo(e.target.value)} required/>
                <button onClick={getCreature} className="button">Create</button>
                {hasImage && (
                    <section className="stats-section">
                    <div className="form-group">
                    <label htmlFor="weight">Weight:</label>
                    <input className="input" type="text" value={animalStats?.weight} id="weight" />
                    </div>
                    <div className="form-group">
                    <label htmmlFor="height">Height:</label>
                    <input className="input" type="text" value={animalStats?.height} id="height"/>
                    </div>
                    <div className="form-group">
                    <label htmlFor="diet">Diet:</label>
                    <input className="input" type="text" value={animalStats?.diet} id="diet"/>
                    </div>
                    <div className="form-group">
                    <label htmlFor="prey">Prey:</label>
                    <input className="input" type="text" value={animalStats?.prey} id="prey"/>
                    </div>
                    <div className="form-group">
                    <label htmlFor="habitat">Habitat:</label>
                    <input className="input" type="text" value={animalStats?.habitat} id="habitat"/>
                    </div>
                    <div className="form-group">
                    <label htmlFor="lifespan">Life Span:</label>
                    <input className="input" type="text" value={animalStats?.lifespan} id="lifespan"/>
                    </div>
                    </section>
                )}
                </section>
            </div>
        </>
    )
}

export default Body;