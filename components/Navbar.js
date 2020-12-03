import React, { useState } from "react";
import {
	AppBar,
	Avatar,
	Box,
	Button,
	Grid,
	IconButton,
	makeStyles,
	Toolbar,
	Typography,
	Dialog,
	DialogContent,
	DialogTitle,
	Drawer,
	List,
	ListItemText,
	ListItem,
	ListItemIcon,
} from "@material-ui/core";
import { useUser } from "../utils/auth/useUser";
import Link from "next/link";
import {
	AccountCircle,
	Book,
	ExitToApp,
	KeyboardArrowRight,
	Menu,
} from "@material-ui/icons";
import FirebaseAuth from "../components/FirebaseAuth";

const drawerWidth = 100;
const barWidth = 60;

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
	},
	appBar: {
		[theme.breakpoints.up("sm")]: {
			width: `calc(100% - ${drawerWidth}px)`,
			marginLeft: drawerWidth,
		},
	},
	menuButton: {
		[theme.breakpoints.up("sm")]: {
			display: "none",
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
		height: barWidth,
	},
	responsiveMenu: {
		[theme.breakpoints.down("xs")]: {
			display: "none",
		},
	},
	responsiveIcon: {
		display: "none",
		[theme.breakpoints.down("xs")]: {
			display: "block",
		},
	},
	centerText: {
		display: "flex",
		alignItems: "center",
	},
	menuItems: {
		color: "#EEF8F9",
	},
	menuIcon: {
		marginRight: theme.spacing(0.2),
	},
}));

const Navbar = () => {
	const classes = useStyles();
	const { user, logout } = useUser();

	const [open, setOpen] = React.useState(false);
	const [toggle, setToggle] = useState(false);

	const toggleDrawer = (event) => {
		if (
			event.type === "keydown" &&
			(event.key === "Tab" || event.key === "Shift")
		) {
			return;
		}

		setToggle(!toggle);
	};

	const handleClose = () => {
		setOpen(false);
	};
	const handleToggle = () => {
		setOpen(!open);
	};
	// navbar items
	const Items = (props) => {
		// navbar items are shown iff user is logged in
		return (
			<div>
				{user ? (
					// user logged in show menu items
					(user.role == "user") ? (
						<Toolbar disableGutters>
							<Box className={classes.responsiveMenu} component="div">
							<Link href={`/recipes/recipeList`}>
								<Button className={classes.menuItems}>
									<Book />
									<Typography variant="subtitle2">Recipes</Typography>
								</Button>
							</Link>

							<Link href={`/profile/profile`}>
								<Button className={classes.menuItems}>
									<AccountCircle
										className={`${classes.menuIcon} ${classes.menuItems}`}
									/>
									<Typography variant="subtitle2">Profile</Typography>
								</Button>
							</Link>

							<Button
								onClick={() => logout()}
								className={`${classes.menuIcon} ${classes.menuItems}`}
							>
								<ExitToApp />
								<Typography variant="subtitle2">Logout</Typography>
							</Button>
						</Box>
						<Button className={classes.responsiveIcon}>
							<Menu className={classes.menuItems} onClick={toggleDrawer} />
							<Drawer anchor="top" open={toggle} onClose={toggleDrawer}>
								<div onClick={toggleDrawer} onKeyDown={toggleDrawer}>
									<List>
										<ListItem button key={0}>
											<ListItemIcon>
												<Book />
											</ListItemIcon>
											<ListItemText primary="Recipes" />
										</ListItem>

										<ListItem button key={1}>
											<ListItemIcon>
												<AccountCircle />
											</ListItemIcon>
											<ListItemText primary="Account" />
										</ListItem>

										<ListItem button key={2}>
											<ListItemIcon>
												<ExitToApp />
											</ListItemIcon>
											<ListItemText primary="Logout" />
										</ListItem>
									</List>
								</div>
							</Drawer>
						</Button>
						</Toolbar>
						) : (
						<Toolbar disableGutters>
							<Box className={classes.responsiveMenu} component="div">
							<Link href={`/recipes/upload`}>
								<Button className={classes.menuItems}>
									<Book />
									<Typography variant="subtitle2">Upload</Typography>
								</Button>
							</Link>

							<Link href={`/profile/admin`}>
								<Button className={classes.menuItems}>
									<AccountCircle
										className={`${classes.menuIcon} ${classes.menuItems}`}
									/>
									<Typography variant="subtitle2">Manage</Typography>
								</Button>
							</Link>

							<Button
								onClick={() => logout()}
								className={`${classes.menuIcon} ${classes.menuItems}`}
							>
								<ExitToApp />
								<Typography variant="subtitle2">Logout</Typography>
							</Button>
						</Box>
						<Button className={classes.responsiveIcon}>
							<Menu className={classes.menuItems} onClick={toggleDrawer} />
							<Drawer anchor="top" open={toggle} onClose={toggleDrawer}>
								<div onClick={toggleDrawer} onKeyDown={toggleDrawer}>
									<List>
										<ListItem button key={0}>
											<ListItemIcon>
												<Book />
											</ListItemIcon>
											<ListItemText primary="Upload" />
										</ListItem>

										<ListItem button key={1}>
											<ListItemIcon>
												<AccountCircle />
											</ListItemIcon>
											<ListItemText primary="Admin" />
										</ListItem>

										<ListItem button key={2}>
											<ListItemIcon>
												<ExitToApp />
											</ListItemIcon>
											<ListItemText primary="Logout" />
										</ListItem>
									</List>
								</div>
							</Drawer>
						</Button>
					</Toolbar>
				)

				) : (
					// user not logged in show login button
					<Button className={classes.menuItems} onClick={() => handleToggle()}>
						<KeyboardArrowRight
							className={`${classes.menuIcon} ${classes.menuItems}`}
						/>
						<Typography variant="subtitle1">Login</Typography>
					</Button>
				)}
			</div>
		);
	};

	return (
		<div>
			<div>
				<AppBar position="static">
					<Toolbar className={classes.toolbar}>
						<Button href="/" className={classes.logoContainer}>
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
				<Dialog
					onClose={handleClose}
					aria-labelledby="simple-dialog-title"
					open={open}
				>
					<DialogTitle id="form-dialog-title">Login</DialogTitle>
					<DialogContent>
						<FirebaseAuth />
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
};
export default Navbar;
