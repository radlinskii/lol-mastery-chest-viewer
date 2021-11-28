import { Paper, TableContainer, Table, TableRow, TableCell, TableBody, Avatar } from '@mui/material'
import { useState } from 'react'
import EnhancedTableHead from '../EnhancedTableHead'
import { D_DRAGON_CDN_URL, headCells } from '../../constants'
import { Champion, SortDirection, SortOrder } from '../../types'

type Props = {
    champions: Champion[]
    patchVersion: string
}

function descendingComparator(a: Champion, b: Champion, orderBy: SortOrder) {
    if (b[orderBy] < a[orderBy]) {
        return -1
    }
    if (b[orderBy] > a[orderBy]) {
        return 1
    }
    return 0
}

function getComparator(order: SortDirection, orderBy: SortOrder) {
    return order === 'desc'
        ? (a: Champion, b: Champion) => descendingComparator(a, b, orderBy)
        : (a: Champion, b: Champion) => -descendingComparator(a, b, orderBy)
}

function stableSort(array: Champion[], comparator: (a: Champion, b: Champion) => number) {
    const stabilizedThis: [Champion, number][] = array.map((el, index) => [el, index])
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0])
        if (order !== 0) return order

        return a[1] - b[1]
    })

    return stabilizedThis.map((el) => el[0])
}

export default function ChampionList(props: Props) {
    const { champions, patchVersion } = props
    const [order, setOrder] = useState<SortDirection>('desc')
    const [orderBy, setOrderBy] = useState<SortOrder>('championPoints')

    const handleRequestSort = (property: SortOrder) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    return (
        <TableContainer component={Paper} elevation={0}>
            <Table aria-label="customized table">
                <EnhancedTableHead
                    headers={headCells}
                    onRequestSort={handleRequestSort}
                    order={order}
                    orderBy={orderBy}
                />
                <TableBody>
                    {stableSort(champions, getComparator(order, orderBy)).map((champion) => {
                        return (
                            <TableRow key={champion.name}>
                                <TableCell align="left">
                                    <Avatar
                                        alt={`${champion.name} avatar`}
                                        src={`${D_DRAGON_CDN_URL}/${patchVersion}/img/champion/${champion.id}.png`}
                                    />
                                </TableCell>
                                <TableCell align="left">{champion.name}</TableCell>
                                <TableCell align="center">{champion.chestGranted ? 'false' : 'true'}</TableCell>
                                <TableCell align="center">{champion.championLevel}</TableCell>
                                <TableCell align="center">{champion.championPoints}</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
