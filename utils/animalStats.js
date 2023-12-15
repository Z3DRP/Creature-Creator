const generateStats = (animal1, animal2) => {
    // weight,height,diet,prey,habitat,behavior
    let stats;

    if (animal1 !== undefined && animal2 !== undefined) {
        // the fields for the animals is not standardized so for any unstandard names like prey vs main_prey assign to variable to get a default
        let anmlPrey1 = animal1?.main_prey ?? animal1?.prey;
        let anmlPrey2 = animal2?.main_prey ?? animal2?.prey;

        stats = {
            height: animal1?.height === undefined && animal2?.height === undefined ? `${getRandomNumber(10)} ft` : getRandomStat(animal1.height, animal2.height),
            weight: animal1?.weight === undefined && animal2?.weight === undefined ?`${getRandomNumber(300)} lbs` : getRandomStat(animal1.weight, animal2.weight),
            diet: animal1?.diet === undefined && animal2?.diet === undefined ? getRandomDiet() : determineDiet(),
            prey: anmlPrey1 === undefined && anmlPrey2 === undefined ? getRandomPrey() : determinePrey(anmlPrey1, anmlPrey2),
            habitat: animal1.habitat === undefined && animal2 === undefined ? getRandomHabitat() : determineHabitat(animal1?.habitat, animal2?.habitat),
            lifespan: animal1?.lifespan === undefined && animal2?.lifespan === undefined ? getRandomLifespan() : calculateLifespan(animal1?.lifespan, animal2?.lifespan)
        }

        return stats;
    }
}

const getRandomStat = (stat1, stat2) => {
    let stat;
    if (stat1 !== undefined && stat2 !== undefined) {
        stat = Math.random() + 1 === 1 ? stat1 : stat2;
    } else {
        stat = stat1 ?? stat2;
    }
    return stat;
}

const determineDiet = (diet1, diet2) => {
    return diet1 === diet2 ? diet1 : 'Omnivore';
}

const getRandomDiet = () => {
    let diets = ['Carnivore', 'Herbivore', 'Omnivore'];
    return diets[Math.round(Math.random() * diets.length)];
}

const determinePrey = (prey1, prey2) => {
    let preys;
    if (prey1 !== undefined && prey2 !== undefined) {
        preys = [...prey1.split(','), ...prey2.split(',')].join(',').replaceAll(' ', '');
    } else {
        preys = prey1 !== undefined ? prey1 : prey2;
    }
    return preys;
}

const getRandomPrey = () => {
    let preys = [
        'People', 'Big Animals', 'Little Animals', 
        'Cows', 'Grass', 'Bugs', 'Woodlice', 'Ants', 
        'Penguins', 'Giraffes', 'Fish', 'Bears', 'Birds',
        'Seeds', 'Flowers', 'Nuts', 'Berries', 'Hares', 'Lemmings'
    ];

    return [
        preys[Math.round(Math.random() * preys.length)],
        preys[Math.round(Math.random() * preys.length)],
        preys[Math.round(Math.random() * preys.length)]
    ].join(',');
}

const determineHabitat = (habitat1, habitat2) => {
    // NOTE add a TODO to highlighter and format habitat & prey by adding spaces after commas
    let habitat;
    if (habitat1 !== undefined && habitat2 !== undefined) {
        habitat = [...habitat1.split(','), ...habitat2.split(',')].join(',');
    } else {
        habitat = habitat1 !== undefined ? habitat1 : habitat2;
    }

    return habitat;
}

const getRandomHabitat = () => {
    let habitats = [
        'Polar Forest Regions', 'Rain forest', 'Deserts',
        'Prairies', 'Mountains', 'Caves', 'Swamps', 'Plains',
        'Lowland Tropical Forest', 'Open Woodlands', 'Tropical Reefs',
        'Sea', 'Costal Waters', 'Dense Jungles', 'Grasslands', 'Costal Mangroves and Riverine Forests'
    ]
    return [
        habitats[Math.round(Math.random() * habitats.length)],
        habitats[Math.round(Math.random() * habitats.length)],
        habitats[Math.round(Math.random() * habitats.length)]
    ].join(',');
}

const calculateLifespan = (lifespan1, lifespan2) => {
    let span1 = lifespan1.split(' ');
    let span2 = lifespan2.split(' ');
    // spans again are not always standardized 
    // some are "12 - 15" and others are "12-15" so do extra splitting
    span1 = span1[0].includes('-') ? span1[0].split('-') : span1;
    span2 = span2[0].includes('-') ? span2[0].split('-') : span2;
    let firstSpan = [];
    let secondSpan = [];
    let formattedLifespan;

    if (lifespan1 !== undefined && lifespan2 !== undefined) {

        firstSpan = span1.filter(span => !isNaN(Number(span)));
        secondSpan = span2.filter(span => !isNaN(Number(span)));
        console.log(firstSpan);
        console.log(secondSpan);
        
    
        let yearsLow = firstSpan[0] < secondSpan[0] ? firstSpan[0] : secondSpan[0];
        let yearsHi = firstSpan[1] > secondSpan[1] ? firstSpan[1] : secondSpan[0];

        formattedLifespan =`${yearsLow} - ${yearsHi} years`;
    } else {
        formattedLifespan = lifespan1 != undefined ? lifespan1 : lifespan2;
    }

    return formattedLifespan;
}

const getRandomLifespan = () => {
    let yearsLow = Math.floor(Math.random() * 25) + 1;
    let yearsHi = Math.floor(Math.random() * 150) + 1;
    return `${yearsLow} - ${yearsHi} years`;
}

const getRandomNumber = maxNumber => {
    return Math.floor(Math.random() * maxNumber) + 1;
}

export default generateStats;