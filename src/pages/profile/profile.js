/* profile.js displays user profile data retrieved from firebase, and allows edit */

import {
	AppBar,
	Avatar,
	Button,
	Toolbar,
	Typography,
	makeStyles,
	Grid,
	FormControl,
	InputLabel,
	InputAdornment,
	IconButton,
	TextField,
	OutlinedInput,
	withStyles,
	Box,
} from "@material-ui/core";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { useUser } from "../../utils/auth/useUser";
import Navbar from "../../components/Navbar";
import { useEffect, useState } from "react";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import styles from '../../styles/Home.module.css'
import {editUserCookie, getUserFromCookie} from "../../utils/cookies";
import { useRouter } from 'next/router';
import useSWR from "swr";
import * as firebase from "firebase";

const useStyles = makeStyles((theme) => ({
	root: {
		// border: "1px solid black",
		background: "lightgray",
		borderRadius: "5px",
		minWidth: "100px",
		padding: "3px",
	},
	pass: {
		marginTop: theme.spacing(2),
		maxWidth: "200px",
		minWidth: "120px",
	},
	container: {
		background: `url(${"/assets/backgroundImage.png"}) repeat center center fixed`,
		paddingBottom: "15vh",
		overflow: "hidden",
		paddingTop: "10vh"
	},
	heading: {
		color: "red",
	},
	avatar: {
		height: "13vh",
		width: "13vh",
		margin: "auto",
	},
	btn: {
		width: "calc(min(max(32vw, 105px), 150px))",
		display: "block",
		margin: "auto",
		textAlign: "center",
		background: "tomato",
		color: "#EEF8F9",
		"&:hover": {
			background: "#F46F56",
		},
	},
	btn2: {
		width: "calc(min(max(37vw, 120px), 160px))",
		display: "block",
		margin: "auto",
		textAlign: "center",
		background: "tomato",
		color: "#EEF8F9",
		"&:hover": {
			background: "#F46F56",
		},
	},
	formItems: {
		marginTop: "1.2vh",
	},
	body: {
		marginTop: "4vh",
	},
	viewButtonLabel: { textTransform: "none" },
	text: {
		fontSize: 'calc(min(4vw, 18px))'
	},
}));

const theme = createMuiTheme({
    palette: {
        text: {
          primary: "#388e3c"
        },
    }
});

const fetcher = async (...args) => {
	const res = await fetch(...args);
	return res.json();
};

const Profile = () => {
	const { user, logout, upload } = useUser();
	const [errorAlert, setErrorAlert] = useState(false);
	const [successAlert, setSuccessAlert] = useState(false);
	const [profile, setProfile] = useState({});
	const { data: programsDic } = useSWR(`/api/programs/getAllProgramsDic`, fetcher);
	const classes = useStyles();
	const [firstName, setFirstName] = useState('')
    const [lastName, setLastName]  = useState('')
    const [phone, setPhone] = useState('')
	const [deliveryAddress, setDeliveryAddress] = useState('')
	const [client, setClient] = useState('')
	const [doneRunning, setDoneRunning] = useState('')
	const [oldPassword, setOldPassword] = useState('')
	const [newPassword, setNewPassword] = useState('')
	const [load, setLoad] = useState(true)
	const [passwordError, setPasswordError] = useState(false)
	const [passwordErrorText, setPasswordErrorText] = useState("Must input new and old passwords")

	const [submitText, setSubmitText] = useState("")
	const [success, setSuccess] = useState(false)

	const router = useRouter();

	// name validation check, only able to use letters
	const name = (e) => {
		const re = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
		if (!re.test(e.key)) {
			e.preventDefault();
		}
	}

	// phone validation check, key pressed when entering telephone number can only be numbers
	const phonenum = (e) => {
		const re = /[0-9]+/g;
		if (!re.test(e.key) || e.target.selectionStart > 11) {
			e.preventDefault();
		}
	}

	// telnum formatting
	const telnum = (e) => {
		let val = e.target.value;
		if (phone.length == 2 && val.length == 3 || phone.length == 6 && val.length == 7) {
			val += '-';
		}
		else if (phone.length == 4 && val.length == 3 || phone.length == 8 && val.length == 7) {
			val = val.slice(0, -1);
		}
		setPhone(val);
	}

	// set user profile data
	useEffect(() => {
		if(user && load) {
			setFirstName(user.firstname)
			setLastName(user.lastname)
			setPhone(user.phone)
			setDeliveryAddress(user.deliveryAddress)
			setLoad(false)
		}
	})

	// profile photo upload
	const handleUpload = (e) => {
		e.preventDefault();
		//console.log(e.target.files);
		const re = /(?:\.([^.]+))?$/;
		let ext = re.exec(e.target.files[0].name)[1];
		//console.log("ext");
		if (ext !== "png" && ext !== "jpg" && ext !== "jpeg") {
			//console.log("Please upload a .png, .jpg, or .jpeg file");
			setErrorAlert(true);
		} else {
			//console.log("file uploaded");
			setSuccessAlert(true);
		}
		//console.log(successAlert);
	};

	// update profile data changes
	const submitChanges = () => {
		setPasswordError(false)
		setSubmitText("")
		setSuccess(false)
		var profileData = {}
		if(firstName.trim() == '' || firstName == user.firstname) {
			setFirstName(user.firstname)
		} else {
			user.firstname = firstName
			profileData.firstname = firstName
			firebase.firestore().collection("users").doc(user.id).update({firstname:firstName});
		}
		if(lastName.trim() == '' || lastName == user.lastname) {
			setLastName(user.lastname)
		} else {
			user.lastname = lastName
			profileData.lastname = lastName
			firebase.firestore().collection("users").doc(user.id).update({lastname:lastName});
		}
		if(phone.trim() == "" || phone == user.phone || !phone.match(/[0-9][0-9][0-9]-[0-9][0-9][0-9]-[0-9][0-9][0-9][0-9]/)) {
			if(!phone.match(/[0-9][0-9][0-9]-[0-9][0-9][0-9]-[0-9][0-9][0-9][0-9]/)) {
				setSubmitText("Phone must be a valid number")
			}
			setPhone(user.phone)
		} else  {
			user.phone = phone
			profileData.phone = phone
			firebase.firestore().collection("users").doc(user.id).update({phone:phone});
		}
		if(deliveryAddress.trim() == '' || deliveryAddress == user.deliveryAddress) {
			setDeliveryAddress(user.deliveryAddress)
		} else {
			user.deliveryAddress = deliveryAddress
			profileData.deliveryAddress = deliveryAddress
			firebase.firestore().collection("users").doc(user.id).update({deliveryAddress:deliveryAddress});
		}
		if(oldPassword == "" && newPassword != "" || oldPassword != "" && newPassword == "") {
			setPasswordError(true)
		} else if(oldPassword.trim() != "" && newPassword.trim() != "") {
			profileData.oldPassword = oldPassword
			profileData.newPassword = newPassword
		}
		if(Object.keys(profileData).length > 0) {
			editUserCookie(profileData);
			upload(profileData).then(() => {
				setSuccess(true)
				setSubmitText("Changes saved successfully!")
			}).catch((error) => {
				if(error.code == "auth/wrong-password") {
					setSubmitText("Old password is incorrect")
				} else if(error.code == "auth/weak-password") {
					setSubmitText("New password is too weak")
				} else if(error.code == "auth/too-many-requests"){
					setSubmitText("Too many attempts made. Please try again later")
				} else {
					console.error(error.code)
				} 
			});
		}
		setSubmitText("")
	}

	useEffect(() => {
		var userData = getUserFromCookie();

		// check if user profile exists, if not, direct to makeProfile
		if(userData) {
			if(!("firstname" in userData)) {
				router.push("/profile/makeProfile");
				return (<div></div>);
			}
		}  else {
			router.push("/");
		}

		// if "role" is "user", get the "client" that the user is assigned to
		async function getClient() {
			if (userData) {
				if (userData.role == "user" && userData?.client && userData.client != "") {
					const usersRef = firebase.firestore().collection("users").doc(userData.client)
					const doc = await usersRef.get();
					if (!doc.exists) {
						setClient("No client assigned")
					} else {
						setClient(doc.data().firstname + " " + doc.data().lastname)
					}
					setDoneRunning(true)
				} else if (userData.role == "user" && (!userData?.client || userData.client == "")) {
					setClient("No client assigned")
					setDoneRunning(true)
				}
			}
		}
		getClient()
	});

	// load data
	if (!user || !programsDic || (user.role == "user" && doneRunning == false)) {
		if (!user) {
			return (
				<div><div className={styles.nav}>
					<Navbar currentPage={1}/>
					<h1 align="center">Please sign in to access this page!</h1>
				</div></div>);
		} if (!programsDic) {
			return "loading programsDic...";
		} if (user.role == "user" && doneRunning == false) {
			return "loading client...";
		}
	}

	return (
		<div>
			<Box component="div" className={classes.container}>
				<Grid justify="center" alignItems="center" direction="column" className={classes.body} container>
					{/* display profile photo */}
					<Grid xs={12} item>
						<Avatar
							src="https://pbs.twimg.com/profile_images/988263662761775104/Bu1EDlWo.jpg"
							alt="profile pic"
							className={classes.avatar}
						/>
					</Grid>
					{/* edit profile photo */}
					<Grid xs={8} md={4} item className={classes.formItems}>
						<Button
							variant="contained"
							component="label"
							className={classes.btn}
							classes={{ label: classes.viewButtonLabel }}
						>
							<Typography className={classes.text}>
								Upload File
							</Typography>
							<input
								type="file"
								onChange={handleUpload}
								style={{ display: "none" }}
							/>
						</Button>
						{errorAlert ? (
							<Alert
								onClose={() => setErrorAlert(false)}
								variant="filled"
								severity="error"
							>
								Please upload a single image (.png, jpg, jpeg)
							</Alert>
						) : (
							""
						)}
						{successAlert ? (
							<Alert
								onClose={() => setSuccessAlert(false)}
								variant="filled"
								severity="success"
							>
								File successfully uploaded!
							</Alert>
						) : (
							""
						)}
					</Grid>
				</Grid>
				{/* display profile email */}
				<Grid justify="center" className={classes.formItems} container>
					<Box component="div" textOverflow="clip">
						<Typography className={classes.text}>
							{user.email}
						</Typography>
					</Box>
				</Grid>
				{/* display user's client */}
				<Grid justify="center" className={classes.formItems} container>
					<Box component="div" textOverflow="clip">
						<Typography className={classes.text}>
							{client}
						</Typography>
					</Box>
				</Grid>
				
				<Grid container spacing={3}>
					<Grid item xs={12} sm={3}></Grid>
					<Grid item xs={12} sm={3}>
						{/* display or edit user's First Name */}
						<Grid justify="center" className={classes.formItems} container>
							<TextField
								id="profileFirst"
								label="First Name"
								value={firstName}
								onChange={(e) => setFirstName(e.target.value)}
								onKeyPress={(e) => name(e)}
								InputProps={{
									className: classes.root,
									classes: {input: classes.text},
								}}
								InputLabelProps={{
									shrink: true,
								}}	
								size="small"
							/>
						</Grid>
						{/* display or edit user's Last Name */}
						<Grid justify="center" className={classes.formItems} container>
							<TextField
								id="profileLast"
								label="Last Name"
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
								onKeyPress={(e) => name(e)}
								InputProps={{
									className: classes.root,
									classes: {input: classes.text},
								}}
								InputLabelProps={{
									shrink: true,
								}}	
								size="small"
							/>
						</Grid>
						{/* display or edit user's Phone Number */}
						<Grid justify="center" className={classes.formItems} container>
							<TextField
								id="profilePhone"
								label="Phone Number"
								value={phone}
								onChange={(e) => telnum(e)}
								onKeyPress={(e) => phonenum(e)}
								type="tel"
								InputProps={{
									className: classes.root,
									classes: {input: classes.text},
								}}
								InputLabelProps={{
									shrink: true,
								}}	
								size="small"
							/>
						</Grid>
						{/* display or edit user's Delivery Address */}
						<Grid justify="center" className={classes.formItems} container>
							<TextField
								id="profileDeliveryAddress"
								label="Delivery Address"
								value={deliveryAddress}
								onChange={(e) => setDeliveryAddress(e.target.value)}
								InputProps={{
									className: classes.root,
									classes: {input: classes.text},
								}}
								InputLabelProps={{
									shrink: true,
								}}	
								size="small"
							/>
						</Grid>
					</Grid>
					{/* textfield for changing user account's password */}
					<Grid item xs={12} sm={3}>
						{user.provider == "password" &&
							<div>
								<Grid justify="center" className={classes.formItems} container>
									<TextField
										id="profileOldPass"
										label="Old Password"
										value={oldPassword}
										onChange={(e) => setOldPassword(e.target.value)}
										type="password"
										InputProps={{
											className: classes.root,
											classes: {input: classes.text},
										}}
										InputLabelProps={{
											shrink: true,
										}}				
										size="small"
										error={passwordError}
									/>
								</Grid>
								<Grid justify="center" className={classes.formItems} container>
									<TextField
										id="profileNewPass"
										label="New Password"
										value={newPassword}
										onChange={(e) => setNewPassword(e.target.value)}
										type="password"
										InputProps={{
											className: classes.root,
											classes: {input: classes.text},
										}}
										InputLabelProps={{
											shrink: true,
										}}	
										size="small"
										error={passwordError}
										helperText={passwordError ? passwordErrorText : ""}
									/>
								</Grid>
							</div>
						}
					</Grid>
					<Grid item xs={12} sm={3}></Grid>
				</Grid>
				<Box m={3} />
				{/* save changes button */}
				<Grid justify="center" className={classes.formItems} container>
					<Grid xs={8} md={4} item>
						<Button
							variant="contained"
							component="label"
							className={classes.btn2}
							classes={{ label: classes.viewButtonLabel }}
							onClick={() => submitChanges()}
						>
							<Typography className={classes.text}>
								Save Changes
							</Typography>
						</Button>
					</Grid>
				</Grid>

				{/* display successfully change profile information text */}
				<ThemeProvider theme={theme}>
					{submitText &&
						<Grid justify="center" className={classes.formItems} container>
							<Box component="div" textOverflow="clip">
								<Typography className={classes.text} color={success ? 'textPrimary' : 'error'}>
									{submitText}
								</Typography>
							</Box>
						</Grid>
					}
				</ThemeProvider>

				<Box m={4} />

				{/* display user's role: "user", "client", "admin" */}
				<Grid justify="center" className={classes.formItems} container>
					<Box component="div" textOverflow="clip">
						<Typography className={classes.text}>
							User Role: {user.role}
						</Typography>
					</Box>
				</Grid>
				{(user.role == "user") &&
					<Grid justify="center" className={classes.formItems} container>
						<Box component="div" textOverflow="clip">
							<Typography className={classes.text}>
								Enrolled Program: {programsDic[user.program]?.programName}
							</Typography>
						</Box>
					</Grid>
				}

				<div className={styles.nav}>
					<Navbar currentPage={1}/>
				</div>
			</Box>
		</div>
	);
};

export default Profile;
