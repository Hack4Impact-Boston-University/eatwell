import {
	Button,
	Grid,
	makeStyles,
	TextField,
	Typography,
	CircularProgress,
} from "@material-ui/core";
import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import { useUser } from "../../utils/auth/useUser";
import * as firebase from 'firebase'
import 'firebase/firestore'
import { Redirect } from 'react-router-dom'
import { useRouter } from 'next/router'

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
	const { user, resolveUser, upload} = useUser();
	const classes = useStyles();
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [tel, setTel] = useState("");
	const router = useRouter();

	const name = (e) => {
		const re = /[A-Za-z \-]+/g;
		if (!re.test(e.key)) {
			e.preventDefault();
		}
	}

	const phone = (e) => {
		const re = /[0-9]+/g;
		if (!re.test(e.key) || e.target.value.length > 11) {
			e.preventDefault();
		}
	}

	const telnum = (e) => {
		let val = e.target.value;
		if (tel.length == 2 && val.length == 3 || tel.length == 6 && val.length == 7) {
			val += '-';
		}
		else if (tel.length == 4 && val.length == 3 || tel.length == 8 && val.length == 7) {
			val = val.slice(0, -1);
		}
		setTel(val);
	}

	if (!user) {
		console.log("User not logged in.");
		return (
			<div>
				<Navbar />
				<h1>Please sign in to access this page!</h1>
			</div>
		);
	}
	if(resolveUser === "not found") {
		return (
			<div>
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
							value={firstName}
							onKeyPress={(e) => name(e)}
							onChange={(e) => setFirstName(e.target.value)}
							error={false}
							id="profileFirst"
							label="First Name"
							placeholder="Your First Name"
							required
							// helperText="Please enter your first name"
						/>
					</Grid>
					<Grid justify="center" className={classes.formItems} container>
						<TextField
							value={lastName}
							onKeyPress={(e) => name(e)}
							onChange={(e) => setLastName(e.target.value)}
							id="profileLast"
							label="Last Name"
							placeholder="Your Last Name"
							required
						/>
					</Grid>
					<Grid justify="center" className={classes.formItems} container>
						<TextField
							value={tel}
							onKeyPress={(e) => phone(e)}
							onChange={(e) => telnum(e)}
							id="profilePhone"
							label="Phone Number"
							placeholder="Your Phone Number"
							type="tel"
							required
						/>
					</Grid>
					<Grid container justify="center" item>
						<Button variant="contained" color="primary" className={classes.btn} onClick={() => upload(firstName, lastName, tel).then(() => {router.push('/profile/profile');})}>
							Submit
						</Button>
					</Grid>
				</Grid>
			</div>
		);
} else {
	if(resolveUser === "found") {
		router.push('/profile/profile');
	}
	return (<div>
		<Grid container spacing={0} direction="column" alignItems="center" justify="center" alignItems="center" style={{ minHeight: '100vh' }}>
			<CircularProgress />
		</Grid>
	</div>);
}
};
export default makeProfile;
