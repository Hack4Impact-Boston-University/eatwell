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
	Menu,
	MenuItem,
} from "@material-ui/core";
import { useUser } from "../utils/auth/useUser";
import {
	AccountCircle,
	Book,
	ExitToApp,
	KeyboardArrowRight,
} from "@material-ui/icons";
import MenuIcon from "@material-ui/icons/Menu";
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
	paper: {
		background: "#0A5429",
	},
	viewButtonLabel: { textTransform: "none" }
}));

const Navbar = () => {
	const classes = useStyles();
	const { user, logout } = useUser();

	const [open, setOpen] = React.useState(false);
	const [toggle, setToggle] = useState(false);

	// const toggleDrawer = (event) => {
	// 	if (
	// 		event.type === "keydown" &&
	// 		(event.key === "Tab" || event.key === "Shift")
	// 	) {
	// 		return;
	// 	}

	// 	setToggle(!toggle);
	// };

	// const handleToggle = () => {
	// 	setOpen(!open);
	// };

	const UserMenuItems = (props) => {
		return (
			<Button href={`/recipes/recipeList`} className={classes.menuItems}>
				<Book />
				<Typography variant="subtitle2">Recipes</Typography>
			</Button>
		);
	}

	const AdminMenuItems = (props) => {
		return (
			<div>					
				<Button href={`/recipes/upload`} className={classes.menuItems}>
					<Book />
					<Typography variant="subtitle2">Upload</Typography>
				</Button>
				<Button href={`/profile/admin`} className={classes.menuItems}>
					<AccountCircle
						className={`${classes.menuIcon} ${classes.menuItems}`}
					/>
					<Typography variant="subtitle2">Manage</Typography>
				</Button>
			</div>
		);
	}

	const UserDrawerItems = (props) => {
		return (
			<Box>
				<MenuItem button key={0}>
					<ListItemIcon>
						<Book />
					</ListItemIcon>
					<ListItemText primary="Recipes" />
				</MenuItem>

				<MenuItem button key={1}>
					<ListItemIcon>
						<AccountCircle />
					</ListItemIcon>
					<ListItemText primary="Account" />
				</MenuItem>
			</Box>
		);
	}

	const AdminDrawerItems = (props) => {
		return (
			<Box>
				<MenuItem button key={1}  className={classes.menuItems}>
					<Button href={`/recipes/upload`} className={classes.menuItems} classes={{ label: classes.viewButtonLabel }}>
						<ListItemIcon>
							<Book className={`${classes.menuIcon} ${classes.menuItems}`}/>
						</ListItemIcon>
						<Typography variant="subtitle1">Upload</Typography>
					</Button>
				</MenuItem>

				<MenuItem button key={2} className={classes.menuItems}>
					<Button href={`/profile/admin`} className={classes.menuItems} classes={{ label: classes.viewButtonLabel }}>
						<ListItemIcon>
							<AccountCircle className={`${classes.menuIcon} ${classes.menuItems}`}/>
						</ListItemIcon>
						<Typography variant="subtitle1">Manage</Typography>
					</Button>
				</MenuItem>
			</Box>
		);
	}


	// navbar items
	const Items = (props) => {
		const [anchorEl, setAnchorEl] = React.useState(null);
		const handleClick = (event) => {
			setAnchorEl(event.currentTarget);
			console.log(event.currentTarget)
		}
	
		const handleClose = () => {
			setAnchorEl(null);
		};
		// navbar items are shown iff user is logged in
		return (
			<div>
				{user ? ( // user logged in show menu items
					<Toolbar disableGutters>
						<Grid container className={classes.responsiveMenu}>
							<Button href={`/profile/profile`} className={classes.menuItems}>
								<AccountCircle
									className={`${classes.menuIcon} ${classes.menuItems}`}
								/>
								<Typography variant="subtitle2">Profile</Typography>
							</Button>
							{user.role == "user" ? 
								<UserMenuItems/> 
								: 
								<AdminMenuItems/>
							}
							<Button
								onClick={() => logout()}
								className={`${classes.menuIcon} ${classes.menuItems}`}
							>
								<ExitToApp />
								<Typography variant="subtitle2">Logout</Typography>
							</Button>
						</Grid>
						<Button className={classes.responsiveIcon}>
							<MenuIcon className={classes.menuItems} onClick={handleClick} />
							<Menu
								id="simple-menu"
								anchorEl={anchorEl}
								keepMounted
								open={Boolean(anchorEl)}
								onClose={handleClose}
								classes={{paper: classes.paper}}
							>
								<MenuItem button key={0} className={classes.menuItems}>
									<Button href={`/profile/profile`} className={classes.menuItems} classes={{ label: classes.viewButtonLabel }}>
										<ListItemIcon>
											<AccountCircle className={`${classes.menuIcon} ${classes.menuItems}`}/>
										</ListItemIcon>
										<Typography variant="subtitle1">Profile</Typography>
									</Button>
								</MenuItem>
								{user.role == "user" ? <UserDrawerItems/> : <AdminDrawerItems/>}
								<MenuItem button key={3} className={classes.menuItems}>
									<Button onClick={() => logout()} className={classes.menuItems} classes={{ label: classes.viewButtonLabel }}>
										<ListItemIcon>
											<ExitToApp className={`${classes.menuIcon} ${classes.menuItems}`}/>
										</ListItemIcon>
										<Typography variant="subtitle1">Logout</Typography>
									</Button>
								</MenuItem>
							</Menu>
							{/* <Drawer anchor="top" open={toggle} onClose={toggleDrawer}>
								<div onClick={toggleDrawer} onKeyDown={toggleDrawer}>
								</div>
							</Drawer> */}
						</Button>
					</Toolbar>
				) : (
					<Toolbar disableGutters>
					</Toolbar>
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
					//onClose={handleClose}
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
