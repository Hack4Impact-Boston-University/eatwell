import { AppBar, Avatar, Button, Toolbar, Typography } from "@material-ui/core";
import { useUser } from "../utils/auth/useUser";
import Navbar from "../components/Navbar";

const Profile = () => {
	const { user, logout } = useUser();
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
			</div>
		</div>
	);
};

export default Profile;
