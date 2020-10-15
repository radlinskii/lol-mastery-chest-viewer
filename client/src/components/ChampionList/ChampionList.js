import React from 'react';
import PropTypes from "prop-types";
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
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { D_DRAGON_URL } from '../../constants';

const useStyles = makeStyles({
    tableHeadCell: {
        fontWeight: 900,
    },
    visuallyHidden: {
        border: 0,
        clip: "rect(0 0 0 0)",
        height: 1,
        margin: -1,
        overflow: "hidden",
        padding: 0,
        position: "absolute",
        top: 20,
        width: 1
    }
});

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
    return order === "desc"
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
    { id: "avatar", align: "left", label: "" },
    { id: "name", align: "left", label: "Champion" },
    { id: "chestGranted", align: "center", label: "Mastery Chest Available" },
    { id: "championLevel", align: "center", label: "Mastery Level" },
    { id: "championPoints", align: "center", label: "Champion Points" }
];

function EnhancedTableHead(props) {
    const {
        classes,
        order,
        orderBy,
        onRequestSort
    } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead className={classes.tableHeadCell}>
            <TableRow>
                <TableCell className={classes.tableHeadCell} align="left" />
                {headCells.slice(1).map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.align}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : "asc"}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                                    {order === "desc" ? "sorted descending" : "sorted ascending"}
                                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired
};


export default function ChampionList({ champions }) {
    const classes = useStyles();
    const [order, setOrder] = React.useState("desc");
    const [orderBy, setOrderBy] = React.useState("championPoints");

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    return (
        <TableContainer component={Paper} elevation={0}>
            <Table aria-label="customized table">
                <EnhancedTableHead
                        classes={classes}
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                />
                <TableBody>
                    {/* {champions.map((champion) => (
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
                    ))} */}
                    {stableSort(champions, getComparator(order, orderBy))
                        .map((champion, index) => {
                            return (
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
                            );
                        })}    
                </TableBody>
            </Table>
        </TableContainer>
    );
}

// export default React.memo(ChampionList);
