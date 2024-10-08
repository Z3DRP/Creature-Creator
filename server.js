import OpenAI from "openai";
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import generateStats from "./utils/animalStats.js";
const PORT = 8081;
const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.API_KEY
});

app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`));

app.get('/creature/animals', async (req, res, next) => {
    try {
        console.log('fetching.....');

        const responseOne = await fetch(`https://api.api-ninjas.com/v1/animals?name=${req.query.anmlOne}`, {
            headers: {
                'X-Api-Key': process.env.NINJA_KEY
            }
        });

        if (!responseOne.ok) {
            console.log(`1st fetch failed :: status ${responseOne.status} :: error ${responseOne.statusText}`);
        }
        const animalOneData = await responseOne.json();
        console.log(`animal one data:: ${animalOneData}`);

        
        const responseTwo = await fetch(`https://api.api-ninjas.com/v1/animals?name=${req.query.anmlTwo}`, {
            headers: {
                'X-Api-Key': process.env.NINJA_KEY
            }
        });

        if (!responseTwo.ok) {
            throw new Error(`2nd Request failed with status :: ${responseTwo.status} :: error ${responseTwo.statusText}`);
        }
        const animalTwoData = await responseTwo.json();
        console.log(`animal two data ${animalTwoData}`);

        // generateStats will combined the animal data and return obj to be sent to client        
        let animal1 = animalOneData.find(animal => animal?.name.toLowerCase() === req.query.anmlOne.toLowerCase()) ?? animalOneData[0];
        let animal2 = animalTwoData.find(animal => animal?.name.toLowerCase() === req.query.anmlTwo.toLowerCase()) ?? animalTwoData[0];
        const stats = generateStats(animal1?.characteristics, animal2?.characteristics);

        // make a list of names to pass to front-end to add more animals to random list
        let animals = getAnimalList(animalOneData, animalTwoData);

        res.json({stats, animals});
        // res.json(stats);

    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
    
});

app.post('/create', async (req, res) => {
    try {
        console.log('fetching img...');
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: req.body.message,
            n: 1,
            quality: 'hd',
            size: '1024x1024',
            style: 'vivid'

        });
        console.log('::end img fetch')
        console.log(response.data[0]);
        console.log(`revised prompt ${response.data[0]?.revised_prompt}`);
        console.log(`url ${response.data[0]?.url}`);
        // NOTE send this response for testing...
        // let response = {
        //     data: [
        //         {
        //             revised_prompt: 'something',
        //             url: 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-3E47rg3fcMXR1IElorSD32SI/user-QWGzkjwBzRagwlaTojx0rEJ1/img-97qvrKdA17Ng5ATxQJVSKqWy.png?st=2023-12-17T03%3A04%3A42Z&se=2023-12-17T05%3A04%3A42Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-12-17T00%3A48%3A46Z&ske=2023-12-18T00%3A48%3A46Z&sks=b&skv=2021-08-06&sig=9fjQ5ySqMl6kP0mHRMb9cfEVUN1cbxiiRT/LRHbD4Tg%3D'
        //         }
        //     ]
        // };
        res.send(response.data[0]);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.Error});
    }
})

const getAnimalList = (animals1, animals2) => {
    let firstList = animals1.map(animal => {
        return animal.name;
    });
    let secondList = animals2.map(animal => {
        return animal.name;
    });

    return firstList.concat(secondList);
}