import { useCallback, useEffect, useState } from 'react';
import { D_DRAGON_URL, API_URL } from '../constants';

function mergeChampionsData(championsMap, summoner) {
    return summoner.champions.map((champ) => ({
        ...champ,
        ...championsMap[champ.championId],
    }));
}

async function fetchChampionsJSON() {
    const url = `${D_DRAGON_URL}/data/en_US/champion.json`;
    const response = await fetch(url);

    if (response.ok) {
        const json = await response.json();

        const champions = Object.values(json.data);
        return champions.reduce((acc, champ) => ({
            ...acc,
            [ champ.key ]: champ,
        }), {});
    }

    throw new Error(`Error fetching champions.json from Riot API, url: ${url}`);
}

async function fetchMasteryChest(value) {
    const response = await fetch(`${API_URL}/form`, {
        method: 'POST',
        body: JSON.stringify(value),
    });

    if (response.ok) {
        const [summonerData, championsMap] = await Promise.all([response.json(), fetchChampionsJSON()]);

        return {
            name: summonerData.name,
            profileIconId: summonerData.profileIconId,
            champions: mergeChampionsData(championsMap, summonerData),
        };
    } else if (response.status === 404) {
        throw new Error(`Summoner with name "${value}" not found :(`);
    } else {
        console.error(response);
        throw new Error(`Error occurred. Status: ${response.status}`);
    }
}

const useSummoner = (value) => {
    const [summoner, setSummoner] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setError(undefined);
    }, [summoner])

    const fetchSummoner = useCallback(  async () => {
        try {
            setSummoner(undefined);
            setLoading(true);
            const results = await fetchMasteryChest(value);
            setLoading(false);

            setSummoner(results);
        } catch (e) {
            setLoading(false);
            console.error(e);
            setError(e);
        }
    }, [value]);

    return { fetchSummoner, summoner, error, loading };
};

export default useSummoner;
