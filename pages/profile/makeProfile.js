import {
	Button,
	Grid,
	makeStyles,
	TextField,
	Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import { useUser } from "../../utils/auth/useUser";

const useStyles = makeStyles((theme) => ({
	profileHeader: {
		marginTop: theme.spacing(2),
	},
	welcomeHeader: {
		marginTop: theme.spacing(3),
	},
	formItems: {
		marginTop: theme.spacing(2),
	},
	btn: {
		width: "8rem",
		display: "block",
		margin: "auto",
		backgroundColor: "tomato",
		color: "#EEF8F9",
		"&:hover": {
			background: "#F46F56",
		},
		textAlign: "center",
		marginTop: "1rem",
	},
}));

const makeProfile = () => {
	const { user, logout } = useUser();
	const classes = useStyles();
	const [firstName, setFirstName] = useState(false);
	const [lastName, setLastName] = useState(false);
	const [tel, setTel] = useState(false);

	if (!user) {
		console.log("User not logged in.");
		return (
			<div>
				<Navbar />
				<h1>Please sign in to access this page!</h1>
			</div>
		);
	}

	return (
		<div>
			<Navbar />
			<Grid container>
				<Grid xs={12} className={classes.welcomeHeader} item>
					<Typography variant="h3" align="center" gutterBottom>
						Welcome {user?.email}
					</Typography>
				</Grid>
				<Grid xs={12} className={classes.profileHeader} item>
					<Typography variant="h5" align="center" gutterBottom>
						Please complete your profile to proceed!
					</Typography>
				</Grid>
				<Grid justify="center" className={classes.formItems} container>
					<TextField
						error={false}
						id="profileFirst"
						label="First Name"
						placeholder="Your first name"
						required
						// helperText="Please enter your first name"
					/>
				</Grid>
				<Grid justify="center" className={classes.formItems} container>
					<TextField
						id="profileLast"
						label="Last Name"
						placeholder="Your Last Name"
						required
					/>
				</Grid>
				<Grid justify="center" className={classes.formItems} container>
					<TextField
						id="profilePhone"
						label="Phone Number"
						placeholder="Your phone number"
						type="tel"
						required
					/>
				</Grid>
				<Grid container justify="center" item>
					<Button variant="contained" color="primary" className={classes.btn}>
						Submit
					</Button>
				</Grid>
			</Grid>
		</div>
	);
};

export default makeProfile;
