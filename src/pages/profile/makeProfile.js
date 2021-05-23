import {
	Box,
	Button,
	Grid,
	makeStyles,
	TextField,
	Typography,
	CircularProgress,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useUser } from "../../utils/auth/useUser";
import * as firebase from 'firebase'
import 'firebase/firestore'
import { Redirect } from 'react-router-dom'
import { useRouter } from 'next/router'
import styles from '../../styles/Home.module.css'
import {checkCode} from "../../utils/codes.js";
import { getUserFromCookie } from "../../utils/cookies";

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
	container: {
		background: `url(${"/assets/backgroundImage.png"}) repeat center center fixed`,
		height: "100vh",
		overflow: "hidden",
	},
	items: {
		marginTop: "10vh",
	}
}));

const makeProfile = () => {
	const { user, resolveUser, upload, logout} = useUser();
	const classes = useStyles();
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [tel, setTel] = useState("");
	const router = useRouter();

	const name = (e) => {
		const re = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
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

	const userData = getUserFromCookie();
	if (!userData) {
		return "Loading..."
	}
	const submit = () => {
		const program = userData?.code.program
		upload({
				firstname: firstName,
				lastname: lastName,
				phone: tel,
				program: program,
				favoriteRecipes:[],
				favoriteSkills:[],
				favoriteTips:[],
				notes:{},
				notesSkills:{},
				notesTips:{},
				ratings:{},
				ratingsSkills:{},
				ratingsTips:{}
		}).then(() => {
			router.push('/');
		}).catch((err) => {
			// Check if firebase error or incorrect code, return error accordingly
			console.log(err);
		});
	}

	useEffect(() => {
		const userData = getUserFromCookie();
		if(!userData) {
			//router.push("/");
		}
	})

	if (!userData.code && !user) {
		return (
			<div>
				<div className={styles.nav}>
					<Navbar/>
					<h1 align="center">Please sign in to access this page!</h1>
				</div>
			</div>
		);
	}
	if(resolveUser === "not found") {
		return (
			<Box className={classes.container}>
				<Grid container className={classes.items}>
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
						<Button variant="contained" color="primary" className={classes.btn} onClick={() => submit()}>
							Submit
						</Button>
					</Grid>
					<Grid container justify="center" item>
						<Button variant="contained" color="primary" className={classes.btn} onClick={() => logout()}>
							Take me back!
						</Button>
					</Grid>
				</Grid>
			</Box>
		);
} else {
	if(resolveUser === "found") {
		router.push('/');
	}
	return (<div>
		<Grid container spacing={0} direction="column" alignItems="center" justify="center" style={{ minHeight: '100vh' }}>
			<CircularProgress />
		</Grid>
	</div>);
}
};
export default makeProfile;
