/* eslint-disable no-console */

let championsMapPromise = null;
const SUMMONER_SEARCH_PARAM = 'summonerName';

async function fetchChampionsJSON() {
    const response = await fetch('https://ddragon.leagueoflegends.com/cdn/9.22.1/data/en_US/champion.json');
    if (response.ok) {
        const json = await response.json();

        return parseChampionsJSON(json);
    }

    const container = document.getElementById('container');
    removeChildren(container);
    const subheader = document.createElement('h2');
    subheader.innerText = 'Error Occured :(';
    container.appendChild(subheader);

    throw new Error('error fetching champions.json from Riot API');
}

async function fetchMasteryChest(value) {
    const container = document.getElementById('container');
    removeChildren(container);
    const subheader = document.createElement('h2');
    subheader.innerText = 'Loading...';
    container.appendChild(subheader);

    try {
        const options = {
            method: 'POST',
            body: JSON.stringify(value),
        };
        const response = await fetch('/form', options);
        if (response.ok) {
            const [responseBody, championsMap] = await Promise.all([response.json(), championsMapPromise]);
            const championsData = mergeChampionsData(championsMap, responseBody);
            console.log(responseBody);
            const summonerWithChampions = {
                name: responseBody.name,
                profileIconId: responseBody.profileIconId,
                champions: championsData,
            };

            addResults(summonerWithChampions);
        } else if (response.status === 404) {
            const msg = `Summoner with name "${value}" not found :(`;

            subheader.innerText = msg;
            throw new Error(msg);
        } else {
            console.error(response);

            throw new Error('Error occured');
        }
    } catch (error) {
        console.error(error);
        subheader.innerText = 'Error occured';
    }
}

function mergeChampionsData(championsMap, summoner) {
    const championsData = summoner.champions.map((champ) => ({
        ...champ,
        ...championsMap[champ.championId],
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

function removeChildren(node) {
    while (node.firstChild) {
        node.firstChild.remove();
    }
}

function addResults(summoner) {
    const container = document.getElementById('container');
    removeChildren(container);

    const summonerGreeting = document.createElement('h2');
    summonerGreeting.innerText = `Hello ${summoner.name}`;
    container.appendChild(summonerGreeting);

    summoner.champions.forEach((champion) => {
        const div = document.createElement('div');

        const championName = document.createElement('span');
        championName.innerText = champion.name;
        div.appendChild(championName);

        const championChest = document.createElement('span');
        championChest.innerText = ` - chest ${champion.chestGranted ? 'already granted' : 'available'}`;
        div.appendChild(championChest);

        container.appendChild(div);
    });
}

window.onload = function onLoad() {
    let submitted = false;
    try {
        championsMapPromise = fetchChampionsJSON();
    } catch (error) {
        console.error(error);
    }

    const formTag = document.getElementById('form');
    formTag.addEventListener('submit', async (event) => {
        event.preventDefault();
        submitted = true;
        const inputValue = event.target[0].value;

        const search = new URLSearchParams(window.location.search);
        search.set(SUMMONER_SEARCH_PARAM, inputValue);
        window.location.search = search.toString();

        await fetchMasteryChest(inputValue);
    });

    const currentParams = new URLSearchParams(window.location.search);
    if (currentParams.has(SUMMONER_SEARCH_PARAM)) {
        const summonerName = currentParams.get(SUMMONER_SEARCH_PARAM);

        const inputTag = document.getElementById('summonerNameInput');
        inputTag.value = summonerName;

        if (!submitted) {
            fetchMasteryChest(summonerName);
        }
    }
};
