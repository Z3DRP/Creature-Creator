import React from 'react';
import './ImageSection.css';

const ImageSection = ({
    creatureImage,
    animalOne,
    animalTwo
}) => {
    return (
        <>
            <div className="column right-column">
                <section className="image-section">
                {
                    creatureImage?.map((image, _index) => (
                    <img key={_index} src={image.url} alt={`Generated of value a ${animalOne} combined with ${animalTwo}`}/>
                    ))
                }
                </section>
            </div>
        </>
    )
}

export default ImageSection;