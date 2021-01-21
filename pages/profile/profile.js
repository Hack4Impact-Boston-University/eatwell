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
import {editUserCookie} from "../../utils/cookies";

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
		height: "100vh",
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


const Profile = () => {
	const { user, logout, upload } = useUser();
	const [errorAlert, setErrorAlert] = useState(false);
	const [successAlert, setSuccessAlert] = useState(false);
	const [profile, setProfile] = useState({});
	const classes = useStyles();

	const [firstName, setFirstName] = useState('')
    const [lastName, setLastName]  = useState('')
    const [phone, setPhone] = useState('')
	const [oldPassword, setOldPassword] = useState('')
	const [newPassword, setNewPassword] = useState('')
	const [load, setLoad] = useState(true)

	const [passwordError, setPasswordError] = useState(false)
	const [passwordErrorText, setPasswordErrorText] = useState("Must input new and old passwords")

	const [submitText, setSubmitText] = useState("")
	const [success, setSuccess] = useState(false)

	const name = (e) => {
		const re = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
		if (!re.test(e.key)) {
			e.preventDefault();
		}
	}

	const phonenum = (e) => {
		const re = /[0-9]+/g;
		if (!re.test(e.key) || e.target.selectionStart > 11) {
			e.preventDefault();
		}
	}

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

	const handleClickShowPassword = (e) => {
		e.preventDefault();
		setProfile({ ...profile, showPassword: !profile.showPassword });
	};

	useEffect(() => {
		if(user && load) {
			setFirstName(user.firstname)
			setLastName(user.lastname)
			setPhone(user.phone)
			setLoad(false)
		}
	})

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

	const submitChanges = () => {
		setPasswordError(false)
		setSubmitText("")
		setSuccess(false)
		var profileData = {}
		if(firstName.trim() == '' || firstName == user.firstname) {
			setFirstName(user.firstname)
		} else {
			profileData.firstname = firstName
		}
		if(lastName.trim() == '' || lastName == user.lastname) {
			setLastName(user.lastname)
		} else {
			profileData.lastname = lastName
		}
		if(phone.trim() == "" || phone == user.phone || !phone.match(/[0-9][0-9][0-9]-[0-9][0-9][0-9]-[0-9][0-9][0-9][0-9]/)) {
			if(!phone.match(/[0-9][0-9][0-9]-[0-9][0-9][0-9]-[0-9][0-9][0-9][0-9]/)) {
				setSubmitText("Phone must be a valid number")
			}
			setPhone(user.phone)
		} else  {
			profileData.phone = phone
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
	}

	if (!user) {
		return (
			<div>
				<div className={styles.nav}>
					<Navbar/>
				</div>
				<h1 align="center">Please sign in to access this page!</h1>
			</div>
		);
	}

	return (
		<div>
			<Box component="div" className={classes.container}>
				<Grid justify="center" alignItems="center" direction="column" className={classes.body} container>
					<Grid xs={12} item>
						<Avatar
							src="https://pbs.twimg.com/profile_images/988263662761775104/Bu1EDlWo.jpg"
							alt="profile pic"
							className={classes.avatar}
						/>
					</Grid>
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
				<Grid justify="center" className={classes.formItems} container>
					<Box component="div" textOverflow="clip">
						<Typography className={classes.text}>
							{user.email}
						</Typography>
					</Box>
				</Grid>
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
				{/* <Grid justify="center" className={classes.formItems} container>
					<FormControl variant="outlined" margin="dense">
						<InputLabel htmlFor="profilePassword">Password</InputLabel>
						<OutlinedInput
							id="profilePassword"
							type={profile?.showPassword ? "text" : "password"}
							// value={profile?.password}
							value={password}
							inputProps={{
								readOnly: true,
								classes: {label: classes.text},
							}}
							className={classes.text}
							endAdornment={
								<InputAdornment position="end">
									<IconButton
										aria-label="toggle password visibility"
										onClick={handleClickShowPassword}
										edge="end"
									>
										{profile?.showPassword ? (
											<Visibility />
										) : (
											<VisibilityOff />
										)}
									</IconButton>
								</InputAdornment>
							}
							labelWidth={70}
						/>
					</FormControl>
				</Grid> */}
				<Grid justify="center" className={classes.formItems} container>
					<Box component="div" textOverflow="clip">
						<Typography className={classes.text}>
							User Role: {user.role}
						</Typography>
					</Box>
				</Grid>
				{user.role == "user" &&
					<Grid justify="center" className={classes.formItems} container>
						<Box component="div" textOverflow="clip">
							<Typography className={classes.text}>
								Enrolled Program: {user.program}
							</Typography>
						</Box>
					</Grid>
				}
				
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

				<div className={styles.nav}>
					<Navbar/>
				</div>
			</Box>
		</div>
	);
};

export default Profile;
