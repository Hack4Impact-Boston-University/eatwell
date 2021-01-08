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
import { useUser } from "../../utils/auth/useUser";
import Navbar from "../../components/Navbar";
import { useEffect, useState } from "react";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import styles from '../../styles/Home.module.css'

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
		width: "7rem",
		display: "block",
		margin: "auto",
		textAlign: "center",
		marginTop: "1rem",
		background: "tomato",
		color: "#EEF8F9",
		"&:hover": {
			background: "#F46F56",
		},
	},
	formItems: {
		marginTop: "1.5vh",

	},
	body: {
		marginTop: "4vh",
	},
	viewButtonLabel: { textTransform: "none" },
	text: {
		fontSize: 'calc(min(4vw, 20px))'
	}
}));

const Profile = () => {
	const { user, logout } = useUser();
	const [errorAlert, setErrorAlert] = useState(false);
	const [successAlert, setSuccessAlert] = useState(false);
	const [profile, setProfile] = useState({});
	const classes = useStyles();

	const handleUpload = (e) => {
		e.preventDefault();
		console.log(e.target.files);
		const re = /(?:\.([^.]+))?$/;
		let ext = re.exec(e.target.files[0].name)[1];
		console.log("ext");
		if (ext !== "png" && ext !== "jpg" && ext !== "jpeg") {
			console.log("Please upload a .png, .jpg, or .jpeg file");
			setErrorAlert(true);
		} else {
			console.log("file uploaded");
			setSuccessAlert(true);
		}
		console.log(successAlert);
	};

	const handleClickShowPassword = (e) => {
		e.preventDefault();
		setProfile({ ...profile, showPassword: !profile.showPassword });
	};

	if (!user) {
		console.log("User not logged in.");
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
				<Grid justify="center" className={classes.body} container>
					<Grid xs={12} item>
						<Avatar
							src="https://pbs.twimg.com/profile_images/988263662761775104/Bu1EDlWo.jpg"
							alt="profile pic"
							className={classes.avatar}
						/>
					</Grid>
					<Grid xs={8} md={4} item>
						<Button
							variant="contained"
							component="label"
							className={classes.btn}
							classes={{ label: classes.viewButtonLabel }}
						>
							Upload File
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
					<TextField
						id="profileFirst"
						label="First Name"
						value={user.firstname}
						InputProps={{
							readOnly: true,
							className: classes.root,
							classes: {input: classes.text},
						}}
						size="small"
					/>
				</Grid>
				<Grid justify="center" className={classes.formItems} container>
					<TextField
						id="profileLast"
						label="Last Name"
						value={user.lastname}
						defaultValue="Doe"
						InputProps={{
							readOnly: true,
							className: classes.root,
							classes: {input: classes.text},
						}}
						size="small"
					/>
				</Grid>
				<Grid justify="center" className={classes.formItems} container>
					<TextField
						id="profileEmail"
						label="Email"
						value={user.email}
						defaultValue="abc@gmail.com"
						InputProps={{
							readOnly: true,
							className: classes.root,
							classes: {input: classes.text},
						}}
						size="small"
					/>
				</Grid>
				<Grid justify="center" className={classes.formItems} container>
					<TextField
						id="profilePhone"
						value={user.phone}
						label="Phone Number"
						defaultValue="123-456-7890"
						type="tel"
						InputProps={{
							readOnly: true,
							className: classes.root,
							classes: {input: classes.text},
						}}
						size="small"
					/>
				</Grid>
				<Grid justify="center" className={classes.formItems} container>

						<FormControl variant="outlined" margin="dense">
							<InputLabel htmlFor="profilePassword">Password</InputLabel>
							<OutlinedInput
								id="profilePassword"
								type={profile?.showPassword ? "text" : "password"}
								// value={profile?.password}
								value={"password"}
								inputProps={{
									readOnly: true,
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

				</Grid>
				<Grid justify="center" className={classes.formItems} container>
					<Box component="div" textOverflow="clip">
						User Role: {user.role}
					</Box>
				</Grid>
				<Grid justify="center" className={classes.formItems} container>
					{(user.role == "user") ? (
						<Box component="div" textOverflow="clip">
							Enrolled Program: {user.program}
						</Box>
					) : (
						<Box></Box>
					)}
				</Grid>

				<div className={styles.nav}>
					<Navbar/>
				</div>
			</Box>
		</div>
	);
};

export default Profile;
