import { AppBar, Avatar, Button, Toolbar, Typography, makeStyles } from "@material-ui/core";
import { useUser } from "../utils/auth/useUser";
import Navbar from "../components/Navbar";

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
		marginTop: "1rem"
	},
	formStyle: {
		margin: "auto",
		maxWidth: "20rem"
	}


}));


const Profile = () => {
	const { user, logout } = useUser();
	const classes = useStyles();

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
							style={{ marginLeft: "8px", marginRight: "8px" }}
							alt="Logo"
							src="Logo"
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
				<p>You're signed in. Email: {user.email}</p>
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
			
			<Avatar
				src="https://pbs.twimg.com/profile_images/988263662761775104/Bu1EDlWo.jpg"
				alt="profile pic"
				className={classes.avatar}
			/>

<Button
  variant="contained"
  component="label"
  className={classes.btn}
>
  Upload File
  <input
    type="file"
    style={{ display: "none" }}
  />
</Button>
<form className={classes.formStyle}>
<p>First Name: </p>
<p>Last Name: </p>
<p>Email: </p>
<p>Telephone: </p>
</form>
			</div>
		</div>
	);
};

export default Profile;
