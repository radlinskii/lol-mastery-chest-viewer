import React from 'react';
import {
    Paper,
    TableContainer,
    Table,
    TableRow,
    TableCell,
    TableBody,
    Avatar,
} from '@material-ui/core';
import EnhancedTableHead from '../EnhancedTableHead';
import { D_DRAGON_CDN_URL } from '../../constants';

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    {
        id: 'avatar',
        align: 'left',
        label: '',
        noSort: true
    },
    {
        id: 'name',
        align: 'left',
        label: 'Champion'
    },
    {
        id: 'chestGranted',
        align: 'center',
        label: 'Mastery Chest Available'
    },
    {
        id: 'championLevel',
        align: 'center',
        label: 'Mastery Level'
    },
    {
        id: 'championPoints',
        align: 'center',
        label: 'Champion Points'
    }
];

export default function ChampionList({ champions, patchVersion }) {
    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('championPoints');

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    return (
        <TableContainer component={Paper} elevation={0}>
            <Table aria-label="customized table">
                <EnhancedTableHead
                    headers={headCells}
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                />
                <TableBody>
                    {stableSort(champions, getComparator(order, orderBy))
                        .map((champion) => {
                            return (
                                <TableRow key={champion.id}>
                                    <TableCell align="left">
                                        <Avatar
                                            alt={`${champion.id} avatar`}
                                            src={`${D_DRAGON_CDN_URL}/${patchVersion}/img/champion/${champion.id}.png`}
                                        />
                                    </TableCell>
                                    <TableCell align="left">{champion.id}</TableCell>
                                    <TableCell align="center">{champion.chestGranted ? 'false' : 'true'}</TableCell>
                                    <TableCell align="center">{champion.championLevel}</TableCell>
                                    <TableCell align="center">{champion.championPoints}</TableCell>
                                </TableRow>
                            );
                        })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
