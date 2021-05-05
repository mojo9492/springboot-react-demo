import React from "react";
import {Snackbar} from "@material-ui/core";
import MuiAlert, {AlertProps} from '@material-ui/lab/Alert';
import {makeStyles, Theme} from "@material-ui/core/styles";
import {Severity} from "../lib";


function Alert(props: AlertProps) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		width: '100%',
		'& > * + *': {
			marginTop: theme.spacing(2),
		},
	},
}));


interface NotificationProps {
	onOpen: boolean;
	onClose: () => void;
	severityType: Severity;

}

const Notification: React.FC<NotificationProps> = (props) => {
	const classes = useStyles();
	const {onOpen, onClose, severityType, children} = props;


	return (
			<div className={classes.root}>
				<Snackbar anchorOrigin={{vertical: "bottom", horizontal: "right"}}
				          open={onOpen}
				          autoHideDuration={6000}
				          onClose={onClose}
				>
					<Alert onClose={onClose} severity={severityType}>{children}</Alert>
				</Snackbar>
			</div>
	)
}

export default Notification;