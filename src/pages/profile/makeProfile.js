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
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

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
	const [deliveryAddress, setDeliveryAddress] = useState("");
	const [submitText, setSubmitText] = useState("")
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

	let userData = {};

	useEffect(() => {
		userData = getUserFromCookie()
	}, [userData])

	const submit = () => {
		setSubmitText("")
		if (!firstName || !lastName || !tel || !deliveryAddress) {
			setSubmitText("Please fill out all the information!")
		} else {
			upload({
				firstname: firstName,
				lastname: lastName,
				phone: tel,
				deliveryAddress: deliveryAddress,
//				program: program,
				favoriteRecipes:[],
				favoriteSkills:[],
				favoriteTips:[],
				notes:[],
				ratings:{},
				timesVisited:0
			}).then(() => {
				if (user?.role != undefined) {
					router.push('/');
				} else {
					router.push('/profile/survey');
					// router.push('https://docs.google.com/forms/d/e/1FAIpQLSdkoKfBcKm8Yc4dLt0mJ4SidcdwwbeKxzdp6RVdXfRKYqPMkw/viewform?usp=sf_link');
				}
			}).catch((err) => {
				// Check if firebase error or incorrect code, return error accordingly
				console.log(err);
			});
		}
	}

	if (!userData) {
		return "Loading..."
	} else if (!userData.code && !user) {
		return (
			<div>
				<div className={styles.nav}>
					<Navbar currentPage={0}/>
					<h1 align="center">Please sign in to access this page!</h1>
					<h1 align="center"><Button align="center" className={styles.btn} onClick={() => {router.push('/')}}>Go back to home page</Button></h1>
					
				</div>
			</div>
		);
	} else if(resolveUser === "not found") {
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
					<Grid justify="center" className={classes.formItems} container>
						<TextField
							value={deliveryAddress}
							onChange={(e) => setDeliveryAddress(e.target.value)}
							error={false}
							id="profileDeliveryAddress"
							label="Delivery Address"
							placeholder="Your Delivery Address"
							required
						/>
					</Grid>
					<Grid container justify="center" item>
						<Button variant="contained" color="primary" className={classes.btn} onClick={() => submit()}>
							Submit
						</Button>
					</Grid>
					<ThemeProvider>
						{submitText &&
							<Grid justify="center" className={classes.formItems} container>
								<Box component="div" textOverflow="clip">
									<Typography className={classes.text}>
										{submitText}
									</Typography>
								</Box>
							</Grid>
						}
					</ThemeProvider>
					<Grid container justify="center" item>
						<Button variant="contained" color="primary" className={classes.btn} 
							onClick={() => {
								let currUser = firebase.auth().currentUser
								firebase.auth().signOut()
								.then(() => {
									return currUser.delete().then(() => {
										console.log("success")
										router.push("/")
									})
								}).catch((err) => {
									console.log(err)
								});
							}}>
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
