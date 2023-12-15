// NOTE start at 42:53
import { useState } from 'react';
import { css } from '@emotion/react';
import { ClipLoader } from 'react-spinners';

const override = css`
  display: block;
  margin: 0;
  border-color: red;
`;

const App = () => {
  // add isLoading for spinner and hide stats before image is generated
  // need to call animal api to get list of animals to get data about combined animcals and
  // to randomly grab two animals to combine
  const [isLoading, setLoading] = useState(false);
  const [hasImage, setHasImage] = useState(false);
  const [creatureImage, setCreatureImage] = useState(null);
  const [animalStats, setAnimalStats] = useState(null);
  const [animalOne, setAnimalOne] = useState(null);
  const [animalTwo, setAnimalTwo] = useState(null);
  const randomAnimals = [
    'Rhino',
    'Grey Fox',
    'Cheetah',
    'Bat',
    'Gorilla',
    'Giraffe',
    'Pig',
    'Cat',
    'Dog',
    'Lion',
    'Cow',
    'Deer',
    'Wolf',
    'Bear',
    'Raven',
    'Crow',
    'Toad',
    'Ball Python',
    'Mouse'
  ];
  const randomVerbs = [
    'Scary',
    'Nice',
    'Funny',
    'Evil',
    'Good'
  ];

  const handleRandom = () => {
    const randoAnimalOne = randomAnimals[Math.round(Math.random() * randomAnimals.length)];
    setAnimalOne(randoAnimalOne);
    let randoAnimalTwo = randomAnimals[Math.round(Math.random() * randomAnimals.length)];
    while (randoAnimalTwo === randoAnimalOne) {
      randoAnimalTwo = randomAnimals[Math.round(Math.random() * randomAnimals.length)];
    }
    setAnimalTwo(randoAnimalTwo);
  }

  const getCreature = async() => {
    try {
      setLoading(true);
      console.log(`animal options ${animalOne}, ${animalTwo}`);

      const animalResponse = await fetch (`http://localhost:8000/creature/animals?anmlOne=${animalOne}&anmlTwo=${animalTwo}`).catch(err => {console.log(err)});
      // NOTE backend handles combining the animal data for stats
      const animalData = await animalResponse.json();
      console.log(animalData);
      setAnimalStats(animalData);

      const options = {
          method: 'POST',
          body: JSON.stringify({
            message: `a ${animalOne} that is part ${animalTwo}`
          }),
          headers: {
            'Content-type': 'application/json'
          }
      }

      const response = await fetch('http://localhost:8000/create', options);
      const data = await response.json();
      setHasImage(true);
      console.log(data)
      setCreatureImage(data)
    } catch (err) {
      setHasImage(false);
      setLoading(false);
      console.log(err);
    }
  }

  return (
    <>
    <div className="App">
      <section className="title">Creator Creator</section>
      <section className="subtitle">Enter in two animals to create a creature</section>
      <p className="random" onClick={handleRandom}>
        <span>Random Creature</span>
      </p>
        {
          isLoading && (
            <div className="loader" > 
              <ClipLoader color="#000" loading={isLoading} css={override} size={50} />
            </div>
          )
        }
        {
          !isLoading && (
            <div className="columns">
              <>
                <div className="column left-column">
                  <section className="input-container">
                  <input className="input animal" type="text" value={animalOne} placeholder="Animal One" onChange={e => setAnimalOne(e.target.value)}/>
                  <input className="input animal" type="text" value={animalTwo} placeholder="Animal Two" onChange={e => setAnimalTwo(e.target.value)}/>
                  <button onClick={getCreature} className="button">Create</button>
                  {
                  hasImage &&
                  <section className="stats-section">
                    <div className="form-group">
                    <label htmlFor="weight">Weight:</label>
                    <input className="input" type="text" id="weight" />
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
                  }
                  </section>
                </div>

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
            </div>
          )
        }
    </div>
    </>
  );
}

export default App;
