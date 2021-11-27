import { TableCellProps } from '@material-ui/core'

export type Champion = {
    key: string
    championId: string
    id: string

    name: string
    chestGranted: boolean
    championLevel: number
    championPoints: number
    avatar: string
}

export type Summoner = {
    name: string
    profileIconId: string
    champions: Champion[]
    freeChampionIds: string[]
    patchVersion: string
}

export type HeadCell = {
    id: 'avatar' | 'name' | 'chestGranted' | 'championLevel' | 'championPoints'
    align?: TableCellProps['align']
    label: string
}

export type SortOrder = Exclude<HeadCell['id'], 'avatar'>

export type SortDirection = 'desc' | 'asc'
