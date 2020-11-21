import React, { useState } from "react";
import {
	AppBar,
	Avatar,
	Box,
	Button,
	makeStyles,
	Toolbar,
	Typography,
} from "@material-ui/core";
import { useUser } from "../utils/auth/useUser";
import Link from "next/link";
import { AccountCircle, MenuBook } from "@material-ui/icons";

const drawerWidth = 100
const barWidth = 60

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
	},
	appBar: {
		[theme.breakpoints.up('sm')]: {
			width: `calc(100% - ${drawerWidth}px)`,
			marginLeft: drawerWidth,
		},
	},
	menuButton: {
		[theme.breakpoints.up('sm')]: {
			display: 'none',
		},
	},
	logo: {
		marginRight: theme.spacing(2),
		height: "75px",
	},
	logoContainer: {
		display: "flex",
		padding: "0",
		"&:hover": {
			cursor: "pointer",
		},
	},
	toolbar: {
		display: "flex",
		justifyContent: "space-between",
		background: "#0A5429",
		height: barWidth
	},
	centerText: {
		display: "flex",
		alignItems: "center",
	},
	menuContainer: {
		display: "flex",
	},
	menuItems: {
		display: "flex",
		alignItems: "center",
		// padding: "4px",
		color: "#EEF8F9",
	},
	menuIcon: {
		marginRight: theme.spacing(0.5)
	}
}));

const Navbar = () => {
	const classes = useStyles();
	const { user, logout } = useUser();

	// navbar items
	const Items = (props) => {
		// navbar items are shown iff user is logged in
		return (
			<div>
				{user ? (
					<Box className={classes.menuContainer}>
						<Link href="/recipes/chicken_fried_rice">
							<Button>
								<Box component="div" className={classes.menuItems}>
									<MenuBook className={classes.menuIcon} />
									<Typography variant="subtitle2">Recipes</Typography>
								</Box>
							</Button>
						</Link>
						<Link href={`/profile/profile`}>
							<Button>
								<Box component="div" className={classes.menuItems}>
									<AccountCircle className={classes.menuIcon} />
									<Typography variant="subtitle2">Profile</Typography>
								</Box>
							</Button>
						</Link>
						<Button onClick={() => logout()} className={classes.menuItems}>
							<Typography variant="subtitle2">Logout</Typography>
						</Button>
					</Box>
				) : ( // user not logged in show login button
						<Button className={classes.menuItems}>
							<Link href={`/login`}>
								<a>Login</a>
							</Link>
						</Button>
					)
				}
			</div >
		);
	}

	return (
		<div>
			<div>
				<AppBar position="static">
					<Toolbar className={classes.toolbar}>
						<Button
							href="/"
							className={classes.logoContainer}
						>
							<Avatar
								alt="Logo"
								src="/assets/eatwell_logo.png"
								className={classes.logo}
							/>
							<Typography
								variant="h6"
								style={{
									userSelect: "none",
									color: "#EEF8F9",
								}}
							>
								EatWell
							</Typography>
						</Button>
						<Items />
					</Toolbar>
				</AppBar>
			</div>
		</div>
	);
};
export default Navbar;