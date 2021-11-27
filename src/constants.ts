import { HeadCell } from './types'

export const SUMMONER_SEARCH_PARAM = 'summonerName'
export const HIDE_ROTATION_PARAM = 'hideRotation'
export const D_DRAGON_CDN_URL = 'https://ddragon.leagueoflegends.com/cdn'
export const D_DRAGON_VERSIONS_URL = 'https://ddragon.leagueoflegends.com/api/versions.json'

export const headCells: HeadCell[] = [
    {
        id: 'avatar',
        align: 'left',
        label: '',
    },
    {
        id: 'name',
        align: 'left',
        label: 'Champion',
    },
    {
        id: 'chestGranted',
        align: 'center',
        label: 'Mastery Chest Available',
    },
    {
        id: 'championLevel',
        align: 'center',
        label: 'Mastery Level',
    },
    {
        id: 'championPoints',
        align: 'center',
        label: 'Champion Points',
    },
]
