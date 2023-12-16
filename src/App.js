import { useState } from 'react';
// import { css } from '@emotion/react';
// import { ClipLoader } from 'react-spinners';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import Header from './components/Header/Header.js'
import Body from './components/Body/Body.js';
import ImageSection from './components/ImageSection/ImageSection.js';
import Loader from './components/Loader/Loader.js';

// const override = css`
//   display: block;
//   margin: 0;
//   border-color: red;
// `;

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
  const [noStatsFound, setNoStats] = useState(false);

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

  const showToast = (message, options) => {
    return new Promise((resolve, reject) => {
      try {
        if (options.type === 'succes') {
          console.log('success toast');
          toast.success(message);
        } else {
          console.log('error toast');
          toast.error(message);
        }
        resolve()
      } catch (err) {
        reject(err)
      }
    });
  }

  function fetchAnimalData(firstAnimal, secondAnimal) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(`http://localhost:8000/creature/animals?anmlOne=${firstAnimal}&anmlTwo=${secondAnimal}`);
        
        const animalData = await response.json();

        if (!response.ok) {
          setNoStats(true);
          reject(animalData);
        } else {
          setNoStats(false);
          resolve(animalData);
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  function fetchCreatureImage(firstAnimal, secondAnimal) {
    const options = {
      method: 'POST',
      body: JSON.stringify({
        message: `a ${firstAnimal} that is part ${secondAnimal}`
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }

    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch('http://localhost:8000/create', options);
  
        const imageResult = await response.json();
  
        if (!response.ok) {
          reject(imageResult);
        } else {
          resolve(imageResult);
        }
      } catch (err) {
        reject(err);
      }
    })
  }

  const getCreature = async() => {
    setLoading(true);
    // try {
    //   setLoading(true);
    //   console.log(`animal options:: ${animalOne} - ${animalTwo}`);

    //   const animalResponse = await fetch (`http://localhost:8000/creature/animals?anmlOne=${animalOne}&anmlTwo=${animalTwo}`);
    //   // NOTE backend handles combining the animal data for stats
    //   const animalData = await animalResponse.json();
    //   setNoStats(false);
    //   setAnimalStats(animalData);

    //   const options = {
    //       method: 'POST',
    //       body: JSON.stringify({
    //         message: `a ${animalOne} that is part ${animalTwo}`
    //       }),
    //       headers: {
    //         'Content-type': 'application/json'
    //       }
    //   }

    //   const response = await fetch('http://localhost:8000/create', options);
    //   const data = await response.json();

    //   setHasImage(true);
    //   setCreatureImage(data)
    // } catch (err) {
    //   setHasImage(false);
    //   setLoading(false);
    //   console.log(err);
    // }

    fetchAnimalData(animalOne, animalTwo)
    .then((result) => {
      console.log(result);
      setNoStats(false);
      setAnimalStats(result);
    })
    .catch((err) => {
      console.log(err);
      // set no stat data for stats/attribute section
      setNoStats(true);
    });

    fetchCreatureImage(animalOne, animalTwo)
    .then((result) => {
      console.log(result);
      hasImage(true);
      setCreatureImage(result);
    })
    .catch(err => {
      console.error(err);
      setHasImage(false);
      showToast(`An error occurred while fetching image error:: ${err.error}`, {type: 'error'});
    }).finally(() => {
      setLoading(false);
    });


  }

  return (
    <>
    <div className="App">
      <ToastContainer />
      {/* <section className="title">Creator Creator</section>
      <section className="subtitle">Enter in two animals to create a creature</section>
      <p className="random" onClick={handleRandom}>
        <span>Random Creature</span>
      </p> */}
      <Header handleRandom={handleRandom} />
        {
          isLoading && (
            // <div className="loader" > 
            //   <ClipLoader color="#000" loading={isLoading} css={override} size={50} />
            // </div>
            <Loader isLoading={isLoading} />
          )
        }
        {
          !isLoading && (
            <div className="columns">
              <>
                {/* <div className="column left-column">
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
                </div> */}
                <Body 
                  animalOne={animalOne}
                  setAnimalOne={setAnimalOne}
                  animalTwo={animalTwo}
                  setAnimalTwo={setAnimalTwo}
                  getCreature={getCreature}
                  hasImage={hasImage}
                  animalStats={animalStats}
                  noStatsFound={noStatsFound}
                />

                {/* <div className="column right-column">
                  <section className="image-section">
                    {
                      creatureImage?.map((image, _index) => (
                        <img key={_index} src={image.url} alt={`Generated of value a ${animalOne} combined with ${animalTwo}`}/>
                      ))
                    }
                  </section>
                </div> */}
                <ImageSection creatureImage={creatureImage} animalOne={animalOne} animalTwo={animalTwo} />
              </>
            </div>
          )
        }
    </div>
    </>
  );
}

export default App;
