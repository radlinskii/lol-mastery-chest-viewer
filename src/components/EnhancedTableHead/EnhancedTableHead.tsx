import PropTypes from 'prop-types'
import { TableHead, TableRow, TableCell, TableCellProps, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import { HeadCell, SortDirection, SortOrder } from '../../types'

type EnhancedTableHeadProps = {
    headers: HeadCell[]
    order: SortDirection
    orderBy: SortOrder
    onRequestSort: (property: SortOrder) => void
}

const useStyles = makeStyles({
    tableHeadCell: {
        fontWeight: 900,
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
})

export default function EnhancedTableHead(props: EnhancedTableHeadProps) {
    const { headers, order, orderBy, onRequestSort } = props
    const classes = useStyles()

    const createSortHandler = (property: SortOrder) => () => {
        onRequestSort(property)
    }

    return (
        <TableHead>
            <TableRow>
                {headers.map((headCell) => {
                    if (headCell.id === 'avatar') {
                        return (
                            <TableCell align={headCell.align} className={classes.tableHeadCell} key={headCell.id}>
                                {headCell.label}
                            </TableCell>
                        )
                    } else {
                        return (
                            <TableCell
                                align={headCell.align}
                                className={classes.tableHeadCell}
                                key={headCell.id}
                                sortDirection={orderBy === headCell.id ? order : false}
                            >
                                <TableSortLabel
                                    active={orderBy === headCell.id}
                                    direction={orderBy === headCell.id ? order : 'asc'}
                                    onClick={createSortHandler(headCell.id)}
                                >
                                    {headCell.label}
                                    {orderBy === headCell.id ? (
                                        <span className={classes.visuallyHidden}>
                                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                        </span>
                                    ) : null}
                                </TableSortLabel>
                            </TableCell>
                        )
                    }
                })}
            </TableRow>
        </TableHead>
    )
}

EnhancedTableHead.propTypes = {
    headers: PropTypes.arrayOf(PropTypes.object).isRequired,
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
}
