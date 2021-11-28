// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {
    RiotSummonerResponse,
    ApiSummonerResponse,
    RiotFreeChampionsRotationResponse,
    RiotSummonerChampionsResponse,
} from '../../types'

type Data = ApiSummonerResponse | null

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (req.method !== 'POST') {
        res.status(405).send(null)

        return
    }

    const summonerName = JSON.parse(req.body)

    if (typeof summonerName !== 'string') {
        res.status(400).send(null)

        return
    }

    try {
        const { data: summoner, error: summonerError } = await fetchRiotAPI<RiotSummonerResponse>(
            `https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}`
        )
        if (summonerError !== null && summoner === null) {
            res.status(summonerError.status).send(null)

            return
        }
        const { data: champions, error: championsError } = await fetchRiotAPI<RiotSummonerChampionsResponse>(
            `https://eun1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${summoner!.id}`
        )
        if (championsError !== null && champions === null) {
            res.status(championsError.status).send(null)

            return
        }
        const { data: freeChampions, error: freeChampionError } = await fetchRiotAPI<RiotFreeChampionsRotationResponse>(
            'https://eun1.api.riotgames.com/lol/platform/v3/champion-rotations'
        )
        if (freeChampionError !== null && freeChampions === null) {
            res.status(freeChampionError.status).send(null)

            return
        }

        res.status(200).send({
            name: summoner!.name,
            profileIconId: summoner!.profileIconId,
            champions: champions!,
            freeChampionIds: freeChampions!.freeChampionIds,
        })
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error)
        res.status(500).send(null)
    }
}

async function fetchRiotAPI<T>(
    url: string
): Promise<{ data: T | null; error: null | { status: number; statusText: string } }> {
    try {
        const response = await fetch(url, {
            headers: {
                'X-Riot-Token': process.env.RIOT_API_TOKEN ?? '',
            },
        })

        if (response.ok) {
            const responseBody: T = await response.json()

            return { data: responseBody, error: null }
        } else {
            return { data: null, error: { status: response.status, statusText: response.statusText } }
        }
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error)

        return { data: null, error: { status: 500, statusText: 'Internal Server Error' } }
    }
}
