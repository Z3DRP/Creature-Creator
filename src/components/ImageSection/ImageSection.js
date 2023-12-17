import React from 'react';
import './ImageSection.css';

const ImageSection = ({
    creatureImage,
    animalOne,
    animalTwo,
    hasImage
}) => {
    return (
        <>
            <div className="column right-column">
                <section className="image-section">
                { hasImage && 
                    (<img className="creature-img" src={creatureImage?.url} alt={`Generated of value a ${animalOne} combined with ${animalTwo}`}/>)
                }
                </section>
            </div>
        </>
    )
}

export default ImageSection;