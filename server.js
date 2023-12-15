import OpenAI from "openai";
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import generateStats from "./utils/animalStats.js";
const PORT = 8000;
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


        // res.json(animalOneData);
        res.json(stats);

    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
    
});

app.post('/create', async (req, res) => {
    try {
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: req.body.message,
            n: 1,
            quality: 'hd',
            size: '1024x1024',
            style: 'vivid'

        });
        console.log(response.data);
        res.send(response.data.data[0].url);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error'});
    }
})