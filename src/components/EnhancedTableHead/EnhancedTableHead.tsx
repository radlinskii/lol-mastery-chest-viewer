import PropTypes from 'prop-types'
import { TableHead, TableRow, TableCell, TableSortLabel } from '@mui/material'
import { HeadCell, SortDirection, SortOrder } from '../../types'

type EnhancedTableHeadProps = {
    headers: HeadCell[]
    order: SortDirection
    orderBy: SortOrder
    onRequestSort: (property: SortOrder) => void
}

export default function EnhancedTableHead(props: EnhancedTableHeadProps) {
    const { headers, order, orderBy, onRequestSort } = props

    const createSortHandler = (property: SortOrder) => () => {
        onRequestSort(property)
    }

    return (
        <TableHead>
            <TableRow>
                {headers.map((headCell) => {
                    if (headCell.id === 'avatar') {
                        return (
                            <TableCell align={headCell.align} key={headCell.id} sx={{ fontWeight: 900 }}>
                                {headCell.label}
                            </TableCell>
                        )
                    } else {
                        return (
                            <TableCell
                                align={headCell.align}
                                key={headCell.id}
                                sortDirection={orderBy === headCell.id ? order : false}
                                sx={{ fontWeight: 900 }}
                            >
                                <TableSortLabel
                                    active={orderBy === headCell.id}
                                    direction={orderBy === headCell.id ? order : 'asc'}
                                    onClick={createSortHandler(headCell.id)}
                                >
                                    {headCell.label}
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
