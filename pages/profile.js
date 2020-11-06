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
} from "@material-ui/core";
import { useUser } from "../utils/auth/useUser";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
	heading: {
		color: "red",
	},
	avatar: {
		height: theme.spacing(13),
		width: theme.spacing(13),
		margin: "auto",
	},
	btn: {
		width: "8rem",
		display: "block",
		margin: "auto",
		textAlign: "center",
		marginTop: "1rem",
	},
	formItems: {
		marginTop: theme.spacing(2),
	},
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
				<AppBar
					position="static"
					style={{ display: "flex", background: "black" }}
				>
					<Toolbar disableGutters>
						<Avatar
							style={{
								marginLeft: "8px",
								marginRight: "8px",
							}}
							alt="Logo"
							src="/assets/eatwell_logo.png"
						/>
						<Typography variant="h6" style={{ flex: 1 }}>
							EatWell
						</Typography>
						<Button href="/" color="inherit" style={{ marginRight: "8px" }}>
							Login
						</Button>
					</Toolbar>
				</AppBar>
				<h1>Please sign in to access this page!</h1>
			</div>
		);
	}
	return (
		<div>
			<Navbar />
			<div>
				<p>You're signed in. Email: {user?.email}</p>
				<p
					style={{
						display: "inline-block",
						color: "blue",
						textDecoration: "underline",
						cursor: "pointer",
					}}
					onClick={() => logout()}
				>
					Log out
				</p>
			</div>
			<Grid justify="center" container>
				<Grid xs={12} item>
					<Avatar
						src="https://pbs.twimg.com/profile_images/988263662761775104/Bu1EDlWo.jpg"
						alt="profile pic"
						className={classes.avatar}
					/>
				</Grid>
				<Grid xs={8} md={4} item>
					<Button variant="contained" component="label" className={classes.btn}>
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
					defaultValue="John"
					InputProps={{
						readOnly: true,
					}}
				/>
			</Grid>
			<Grid justify="center" className={classes.formItems} container>
				<TextField
					id="profileLast"
					label="Last Name"
					defaultValue="Doe"
					InputProps={{
						readOnly: true,
					}}
				/>
			</Grid>
			<Grid justify="center" className={classes.formItems} container>
				<TextField
					id="profileEmail"
					label="Email"
					defaultValue="abc@gmail.com"
					InputProps={{
						readOnly: true,
					}}
				/>
			</Grid>
			<Grid justify="center" className={classes.formItems} container>
				<TextField
					id="profilePhone"
					label="Phone Number"
					defaultValue="123-456-7890"
					type="tel"
					InputProps={{
						readOnly: true,
					}}
				/>
			</Grid>
			<Grid justify="center" container>
				<Grid xs={10} md={4} lg={2} className={classes.formItems} item>
					<FormControl variant="outlined" margin="dense" fullWidth>
						<InputLabel htmlFor="profilePassword">Password</InputLabel>
						<OutlinedInput
							id="profilePassword"
							type={profile?.showPassword ? "text" : "password"}
							// value={profile?.password}
							value={"password"}
							inputProps={{
								readOnly: true,
							}}
							endAdornment={
								<InputAdornment position="end">
									<IconButton
										aria-label="toggle password visibility"
										onClick={handleClickShowPassword}
										edge="end"
									>
										{profile?.showPassword ? <Visibility /> : <VisibilityOff />}
									</IconButton>
								</InputAdornment>
							}
							labelWidth={70}
						/>
					</FormControl>
				</Grid>
			</Grid>
		</div>
	);
};

export default Profile;
