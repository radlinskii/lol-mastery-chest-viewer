import React from 'react';
import {
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Avatar,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { D_DRAGON_URL } from '../../constants';

const useStyles = makeStyles({
    tableHeadCell: {
        fontWeight: 900,
    },
});

function ChampionList({ champions }) {
    const classes = useStyles();

    return (
        <TableContainer component={Paper} elevation={0}>
            <Table aria-label="customized table">
                <TableHead className={classes.tableHeadCell}>
                    <TableRow>
                        <TableCell className={classes.tableHeadCell} align="left" />
                        <TableCell className={classes.tableHeadCell} align="left">Champion</TableCell>
                        <TableCell className={classes.tableHeadCell} align="center">Mastery Chest Available</TableCell>
                        <TableCell className={classes.tableHeadCell} align="center">Mastery Level</TableCell>
                        <TableCell className={classes.tableHeadCell} align="center">Champion Points</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {champions.map((champion) => (
                        <TableRow key={champion.id}>
                            <TableCell align="left">
                                <Avatar
                                    alt={`${champion.id} avatar`}
                                    src={`${D_DRAGON_URL}/img/champion/${champion.id}.png`}
                                />
                            </TableCell>
                            <TableCell align="left">{champion.id}</TableCell>
                            <TableCell align="center">{champion.chestGranted ? "false" : "true"}</TableCell>
                            <TableCell align="center">{champion.championLevel}</TableCell>
                            <TableCell align="center">{champion.championPoints}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default React.memo(ChampionList);
