import { useCallback, useEffect, useState } from 'react'
import { D_DRAGON_CDN_URL, D_DRAGON_VERSIONS_URL } from '../constants'
import { Champion, Summoner } from '../types'

function mergeChampionsData(championsMap: Record<Champion['key'], Champion>, summonerChampions: Champion[]) {
    return summonerChampions.map((champ) => ({
        ...champ,
        ...championsMap[champ.championId],
    }))
}

async function fetchPatchVersion(): Promise<string> {
    const response = await fetch(D_DRAGON_VERSIONS_URL)

    if (response.ok) {
        const json = await response.json()

        return json.shift()
    } else {
        throw new Error(`Error fetching champions.json from Riot API, url: ${D_DRAGON_VERSIONS_URL}`)
    }
}

async function fetchChampionsJSON(patchVersion: string) {
    const url = `${D_DRAGON_CDN_URL}/${patchVersion}/data/en_US/champion.json`
    const response = await fetch(url)

    if (response.ok) {
        const json = await response.json()

        const champions: Champion[] = Object.values(json.data) // TODO: what's in data? Object.values and then reduce?
        return champions.reduce(
            (acc: Record<Champion['key'], Champion>, champ: Champion) => ({
                ...acc,
                [champ.key]: champ,
            }),
            {}
        )
    }

    throw new Error(`Error fetching champions.json from Riot API, url: ${url}`)
}

async function fetchMasteryChest(summonerName: string) {
    const response = await fetch('/form', {
        method: 'POST',
        body: JSON.stringify(summonerName),
    })

    if (response.ok) {
        const patchVersion = await fetchPatchVersion()
        const [summonerData, championsMap] = await Promise.all([response.json(), fetchChampionsJSON(patchVersion)])

        return {
            name: summonerData.name as string,
            profileIconId: summonerData.profileIconId as string,
            champions: mergeChampionsData(championsMap, summonerData.champions),
            freeChampionIds: summonerData.freeChampionIds as string[],
            patchVersion,
        }
    } else if (response.status === 404) {
        throw new Error(`Summoner with name "${summonerName}" not found :(`)
    } else {
        // eslint-disable-next-line no-console
        console.error(response)
        throw new Error(`Error occurred. Status: ${response.status}`)
    }
}

const useSummoner = (summonerName: string) => {
    const [summoner, setSummoner] = useState<Summoner | null>(null)
    const [error, setError] = useState<Error | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setError(null)
    }, [summoner])

    const fetchSummoner = useCallback(async () => {
        try {
            setSummoner(null)
            setLoading(true)
            const result = await fetchMasteryChest(summonerName)
            setLoading(false)

            setSummoner(result)
        } catch (e) {
            if (e instanceof Error) {
                setLoading(false)
                // eslint-disable-next-line no-console
                console.error(e)
                setError(e)
            }
        }
    }, [summonerName])

    return { fetchSummoner, summoner, error, loading }
}

export default useSummoner
