import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import {Student} from "../lib";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Tooltip from "@material-ui/core/Tooltip";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
		order: Order,
		orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
	return order === 'desc'
			? (a, b) => descendingComparator(a, b, orderBy)
			: (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
	const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});
	return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
	disablePadding: boolean;
	id: keyof Student;
	label: string;
	numeric: boolean;
}

const headCells: HeadCell[] = [
	{id: 'id', numeric: true, disablePadding: false, label: 'Student ID'},
	{id: 'name', numeric: false, disablePadding: false, label: 'Student Name'},
	{id: 'email', numeric: false, disablePadding: false, label: 'Email'},
	{id: 'gender', numeric: true, disablePadding: false, label: 'Gender'},
];

interface EnhancedTableProps {
	onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Student) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
	const {order, orderBy, onRequestSort} = props;
	const createSortHandler = (property: keyof Student) => (event: React.MouseEvent<unknown>) => {
		onRequestSort(event, property);
	};

	return (
			<TableHead>
				<TableRow>
					{headCells.map((headCell) => (
							<TableCell
									key={headCell.id}
									align={headCell.numeric ? 'right' : 'left'}
									padding={headCell.disablePadding ? 'none' : 'default'}
									sortDirection={orderBy === headCell.id ? order : false}
							>
								<TableSortLabel
										active={orderBy === headCell.id}
										direction={orderBy === headCell.id ? order : 'asc'}
										onClick={createSortHandler(headCell.id)}
								>
									{headCell.label}
								</TableSortLabel>
							</TableCell>
					))}
					<TableCell
							align={'right'}
							padding={'none'}
							sortDirection={false}
					/>
				</TableRow>
			</TableHead>
	);
}

const useStyles = makeStyles((theme: Theme) =>
		createStyles({
			root: {
				width: '100%',
			},
			paper: {
				width: '100%',
				marginBottom: theme.spacing(2),
			},
			table: {
				minWidth: 750,
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
		}),
);

interface EnhancedTablePropsII {
	students: Student[];
	onDelete: (studentId: number) => void;
}

const EnhancedTable: React.FC<EnhancedTablePropsII> = (props) => {
	const {students, onDelete } = props;
	const classes = useStyles();
	const [order, setOrder] = React.useState<Order>('asc');
	const [orderBy, setOrderBy] = React.useState<keyof Student>("id");
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);

	const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Student) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const emptyRows = rowsPerPage - Math.min(rowsPerPage, students.length - page * rowsPerPage);

	return (
			<div className={classes.root}>
				<Paper className={classes.paper}>
					<TableContainer>
						<Table
								className={classes.table}
								aria-labelledby={"tableTitle"}
								size={"medium"}
								aria-label={"enhanced table"}
						>
							<EnhancedTableHead
									order={order}
									orderBy={orderBy}
									onRequestSort={handleRequestSort}
									rowCount={students.length}
							/>
							<TableBody>
								{stableSort(students, getComparator(order, orderBy))
										.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
										.map((stud: Student) => {

											return (
													<TableRow
															key={stud.id}
															hover
															role="checkbox"
															tabIndex={-1}
													>
														<TableCell align="right">{stud.id}</TableCell>
														<TableCell align="right">{stud.name}</TableCell>
														<TableCell align="right">{stud.email}</TableCell>
														<TableCell align="right">{stud.gender}</TableCell>
														<TableCell align="right">
															<Tooltip title="Delete">
																<IconButton aria-label="delete" onClick={() => onDelete(stud.id)}>
																	<DeleteIcon/>
																</IconButton>
															</Tooltip>
														</TableCell>
													</TableRow>
											);
										})}
								{emptyRows > 0 && (
										<TableRow style={{height: 53 * emptyRows}}>
											<TableCell colSpan={6}/>
										</TableRow>
								)}
							</TableBody>
						</Table>
					</TableContainer>
					<TablePagination
							rowsPerPageOptions={[5, 10, 25]}
							component="div"
							count={students.length}
							rowsPerPage={rowsPerPage}
							page={page}
							onChangePage={handleChangePage}
							onChangeRowsPerPage={handleChangeRowsPerPage}
					/>
				</Paper>
			</div>
	);
}
export default EnhancedTable;