import { TableCellProps } from '@mui/material'

import type { EmotionCache } from '@emotion/cache'
import type { AppProps } from 'next/app'

export type EnhancedAppProps = AppProps & { emotionCache: EmotionCache }

export type RiotChampion = {
    key: string
    id: string
    name: string
}

type RiotSummonerChampion = {
    chestGranted: boolean
    championLevel: number
    championPoints: number
    championId: number
}

export type RiotSummonerChampionsResponse = RiotSummonerChampion[]

export type Champion = RiotSummonerChampion & RiotChampion

export type Summoner = {
    name: string
    profileIconId: string
    champions: Champion[]
    freeChampionIds: number[]
    patchVersion: string
}

export type RiotSummonerResponse = Omit<Summoner, 'patchVersion' | 'champions'> & {
    id: string
    champions: RiotSummonerChampionsResponse
}

export type ApiSummonerResponse = Omit<RiotSummonerResponse, 'id'>

export type RiotFreeChampionsRotationResponse = { freeChampionIds: number[] }

export type HeadCell = {
    id: 'avatar' | 'name' | 'chestGranted' | 'championLevel' | 'championPoints'
    align?: TableCellProps['align']
    label: string
}

export type SortOrder = Exclude<HeadCell['id'], 'avatar'>

export type SortDirection = 'desc' | 'asc'
