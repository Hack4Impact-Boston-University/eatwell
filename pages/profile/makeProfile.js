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
	const { user, logout } = useUser();
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

	const upload = async () => {
		console.log(user)
		var profile = firebase.firestore().collection('users').doc(user.id)
		var data = {
			uid: user.id,
			email: user.email,
			firstname: firstName,
			lastname: lastName,
			phone: tel,
		}

		console.log(data)

		await profile.set(data);
		router.push('/profile/profile');
		//window.location = "http://localhost:3000/profile/profile";
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
						value={firstName}
						onKeyPress={(e) => name(e)}
						onChange={(e) => setFirstName(e.target.value)}
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
						placeholder="Your phone number"
						type="tel"
						required
					/>
				</Grid>
				<Grid container justify="center" item>
					<Button variant="contained" color="primary" className={classes.btn} onClick={() => upload()}>
						Submit
					</Button>
				</Grid>
			</Grid>
		</div>
	);
};

export default makeProfile;
