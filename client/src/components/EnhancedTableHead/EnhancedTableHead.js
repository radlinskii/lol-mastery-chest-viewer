import React from 'react';
import PropTypes from "prop-types";
import {
    TableHead,
    TableRow,
    TableCell
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TableSortLabel from '@material-ui/core/TableSortLabel';

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

export default function EnhancedTableHead(props) {
    const {
        headers,
        order,
        orderBy,
        onRequestSort
    } = props;

    const classes = useStyles();

    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headers.map((headCell) => {
                    if (headCell.hasOwnProperty('noSort')) {
                        return <TableCell key={headCell.id} className={classes.tableHeadCell} align={headCell.align}>{headCell.label}</TableCell>
                    }
                    else {
                        return <TableCell
                            key={headCell.id}
                            className={classes.tableHeadCell}
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
                    }
                })}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    headers: PropTypes.arrayOf(PropTypes.object).isRequired,
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired
};

