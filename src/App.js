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


const App = () => {
  // add isLoading for spinner and hide stats before image is generated
  // need to call animal api to get list of animals to get data about combined animcals and
  // to randomly grab two animals to combine
  const randoAnimals = [
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
  const [randomAnimals, setRandomAnimals] = useState(randoAnimals);
  const [isLoading, setLoading] = useState(false);
  const [hasImage, setHasImage] = useState(false);
  const [creatureImage, setCreatureImage] = useState(null);
  const [animalStats, setAnimalStats] = useState(null);
  const [animalOne, setAnimalOne] = useState(undefined);
  const [animalTwo, setAnimalTwo] = useState(undefined);

  const handleRandom = () => {
    const randoAnimalOne = randomAnimals[Math.round(Math.random() * (randomAnimals.length - 1))];
    setAnimalOne(randoAnimalOne);
    let randoAnimalTwo = randomAnimals[Math.round(Math.random() * (randomAnimals.length - 1))];
    while (randoAnimalTwo === randoAnimalOne) {
      randoAnimalTwo = randomAnimals[Math.round(Math.random() * (randomAnimals.length - 1))];
    }
    setAnimalTwo(randoAnimalTwo);
  }

  const showToast = (message, options) => {
    return new Promise((resolve, reject) => {
      try {
        if (options.type === 'success') {
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
        if (firstAnimal !== undefined && secondAnimal !== undefined) {
          const response = await fetch(`http://localhost:8001/creature/animals?anmlOne=${firstAnimal}&anmlTwo=${secondAnimal}`);
          
          const animalData = await response.json();
  
          if (!response.ok) {
            reject(animalData);
          } else {
            resolve(animalData);
          }
        } else {
          setLoading(false);
          showToast('Error, you must enter both animals', {type: 'error'});
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  function fetchCreatureImage(firstAnimal, secondAnimal) {
    let imgPrompt = `Generate a unique creature by merging a ${firstAnimal} with a ${secondAnimal}. Ensure the creature is a blend of features from both animals.`;

    const options = {
      method: 'POST',
      body: JSON.stringify({
        message: imgPrompt
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }

    return new Promise(async (resolve, reject) => {
      try {
        if (animalOne !== undefined && animalTwo !== undefined) {
          const response = await fetch('http://localhost:8001/create', options);
    
          const imageResult = await response.json();
    
          if (!response.ok) {
            reject(imageResult);
          } else {
            resolve(imageResult);
          }
        } 
      } catch (err) {
        reject(err);
      }
    })
  }

  const getCreature = async() => {
    setLoading(true);

    fetchAnimalData(animalOne, animalTwo)
    .then((result) => {
      console.log(`animal data result ${result}`);
      console.log(`animal stats ${result.stats}`);
      console.log(`animal list ${result.animals}`);
      setAnimalStats(result.stats);
      randoAnimals.concat(result.animals);
      setRandomAnimals(randoAnimals);
    })
    .catch((err) => {
      console.log(err);
    });

    fetchCreatureImage(animalOne, animalTwo)
    .then((result) => {
      console.log(result);
      setHasImage(true);
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
      <Header handleRandom={handleRandom} />
        {
          isLoading && (
            <Loader isLoading={isLoading} />
          )
        }
        {
          !isLoading && (
            <div className="columns">
              <>
                <Body 
                  animalOne={animalOne}
                  setAnimalOne={setAnimalOne}
                  animalTwo={animalTwo}
                  setAnimalTwo={setAnimalTwo}
                  getCreature={getCreature}
                  hasImage={hasImage}
                  animalStats={animalStats}
                />
                <ImageSection creatureImage={creatureImage} animalOne={animalOne} animalTwo={animalTwo} hasImage={hasImage} />
              </>
            </div>
          )
        }
    </div>
    </>
  );
}

export default App;
