/* eslint-disable no-console */

async function fetchChampionsJSON() {
    const response = await fetch('champions.json');
    const json = await response.json();

    return json
}

async function submitHandler(event) {
    event.preventDefault();
    const inputValue = event.target[0].value;

    try {
        const options = {
            method: 'POST',
            body: JSON.stringify(inputValue),
        };
        const response = await fetch('/form', options);
        if (response.ok) {
            const responseBody = await response.json();

            const championsJSON = await fetchChampionsJSON();
            const championsMap = parseChampionsJSON(championsJSON);
            const championsData = mergeChampionsData(championsMap, responseBody);

            const summonerWithChampions = {
                name: responseBody.name,
                profileIconId: responseBody.profileIconId,
                champions: championsData,
            };

            addResults(summonerWithChampions);
        } else {
            console.error(response);
        }
    } catch (error) {
        console.error('fetching error');
        console.error(error);
    }
}

function mergeChampionsData(championsMap, summoner) {
    const championsData = summoner.champions.map((champ) => ({
        ...champ,
        ...championsMap[champ.championId]
    }));

    return championsData;
}

function parseChampionsJSON(championsJSON) {
    const champions = Object.values(championsJSON.data);
    const championsByID = champions.reduce((acc, champ) => ({
            ...acc,
            [champ.key]: champ,
        }), {});

    return championsByID;
}

function addResults(summoner) {
    const container = document.getElementById('container');

    const summonerGreeting = document.createElement('h2');
    summonerGreeting.innerText = `Hello ${summoner.name}`;
    container.appendChild(summonerGreeting);

    summoner.champions.forEach(champion => {
        const div = document.createElement('div');

        const championName = document.createElement('span');
        championName.innerText = champion.name;
        div.appendChild(championName);

        const championChest = document.createElement('span');
        championChest.innerText = ` - chest ${champion.chestGranted ?  'already granted' : 'available'}`;
        div.appendChild(championChest);

        container.appendChild(div);
    });
}

window.onload = function onLoad() {
    const form = document.getElementById('form');
    form.addEventListener('submit', submitHandler);
};
