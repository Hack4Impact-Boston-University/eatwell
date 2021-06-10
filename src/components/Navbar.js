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
	Backup,
	Favorite,
	LocalLibrary,
	EmojiObjects,
	Tune,
} from "@material-ui/icons";
import MenuIcon from "@material-ui/icons/Menu";
import FirebaseAuth from "./FirebaseAuth";

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
		[theme.breakpoints.down("sm")]: {
			display: "none",
		},
	},
	responsiveIcon: {
		display: "none",
		[theme.breakpoints.down("sm")]: {
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
	menuItems1: {
		color: "#EEF8F9",
		backgroundColor: "#126500",
	},
	menuIcon: {
		marginRight: theme.spacing(0.2),
	},
	paper: {
		background: "#0A5429",
	},
	viewButtonLabel: { textTransform: "none" },
}));

const Navbar = ({currentPage}) => {
	const classes = useStyles();
	const { user, logout } = useUser();
	const [open, setOpen] = React.useState(false);

	console.log("currentPage")
	console.log(currentPage)

	// navbar items
	const Items = (props) => {
		const [anchorEl, setAnchorEl] = React.useState(null);
		const handleClick = (event) => {
			setAnchorEl(event.currentTarget);
		};

		const handleClose = () => {
			setAnchorEl(null);
		};

		// navbar items are shown iff user is logged in
		return (
			<div>
				{user ? ( // user logged in show menu items
					<Toolbar disableGutters>
						<Grid container className={classes.responsiveMenu}>
							<Button href={`/profile/profile`}
								className={currentPage == 1 ? classes.menuItems1 : classes.menuItems}
								useState={{currentPage:1}}
							>
								<AccountCircle
									className={`${classes.menuIcon} ${classes.menuItems}`}
								/>
								<Typography variant="subtitle2">Profile</Typography>
							</Button>
							<Button href={`/recipes/recipeList`}
								className={currentPage == 2 ? classes.menuItems1 : classes.menuItems}
								useState={{currentPage:2}}
							>
								<Book />
								<Typography variant="subtitle2">Recipes</Typography>
							</Button>
							<Button href={`/skills/skillList`}
								className={currentPage == 3 ? classes.menuItems1 : classes.menuItems}
								useState={{currentPage:3}}
							>
								<LocalLibrary />
								<Typography variant="subtitle2">Skills</Typography>
							</Button>
							<Button href={`/tips/tipList`}
								className={currentPage == 4 ? classes.menuItems1 : classes.menuItems}
								useState={{currentPage:4}}
							>
								<EmojiObjects />
								<Typography variant="subtitle2">Tips</Typography>
							</Button>
							<Button href={`/recipes/favorites`}
								className={currentPage == 5 ? classes.menuItems1 : classes.menuItems}
								useState={{currentPage:5}}
							>
								<Favorite />
								<Typography variant="subtitle2">Favorites</Typography>
							</Button>
							{user.role == "admin" ? (
								<Button href={`/recipes/upload`}
									className={currentPage == 6 ? classes.menuItems1 : classes.menuItems}
									useState={{currentPage:6}}
								>
									<Backup style={{ marginRight: "2px" }} />
									<Typography variant="subtitle2">Upload</Typography>
								</Button>
							) : (
								<Box></Box>
							)}
							{user.role == "admin" ? (
								<Button href={`/profile/manage`}
									className={currentPage == 7 ? classes.menuItems1 : classes.menuItems}
									useState={{currentPage:7}}
								>
									<Tune />
									<Typography variant="subtitle2">Manage</Typography>
								</Button>
							) : (
								<Box></Box>
							)}
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
								classes={{ paper: classes.paper }}
							>
								<MenuItem button key={0}
									className={currentPage == 1 ? classes.menuItems1 : classes.menuItems}
								>
									<Button
										href={`/profile/profile`}
										className={classes.menuItems}
										classes={{ label: classes.viewButtonLabel }}
										useState={{currentPage:1}}
									>
										<ListItemIcon>
											<AccountCircle
												className={`${classes.menuIcon} ${classes.menuItems}`}
											/>
										</ListItemIcon>
										<Typography variant="subtitle1">Profile</Typography>
									</Button>
								</MenuItem>
								<MenuItem button key={1}
									className={currentPage == 2 ? classes.menuItems1 : classes.menuItems}
								>
									<Button
										href={`/recipes/recipeList`}
										className={classes.menuItems}
										classes={{ label: classes.viewButtonLabel }}
										useState={{currentPage:2}}
									>
										<ListItemIcon>
											<Book
												className={`${classes.menuIcon} ${classes.menuItems}`}
											/>
										</ListItemIcon>
										<Typography variant="subtitle1">Recipes</Typography>
									</Button>
								</MenuItem>
								<MenuItem button key={1}
									className={currentPage == 3 ? classes.menuItems1 : classes.menuItems}
								>
									<Button
										href={`/skills/skillList`}
										className={classes.menuItems}
										classes={{ label: classes.viewButtonLabel }}
										useState={{currentPage:3}}
									>
										<ListItemIcon>
											<LocalLibrary
												className={`${classes.menuIcon} ${classes.menuItems}`}
											/>
										</ListItemIcon>
										<Typography variant="subtitle1">Skills</Typography>
									</Button>
								</MenuItem>
								<MenuItem button key={1}
									className={currentPage == 4 ? classes.menuItems1 : classes.menuItems}
								>
									<Button
										href={`/tips/tipList`}
										className={classes.menuItems}
										classes={{ label: classes.viewButtonLabel }}
										useState={{currentPage:4}}
									>
										<ListItemIcon>
											<EmojiObjects
												className={`${classes.menuIcon} ${classes.menuItems}`}
											/>
										</ListItemIcon>
										<Typography variant="subtitle1">Tips</Typography>
									</Button>
								</MenuItem>
								<MenuItem button key={1}
									className={currentPage == 5 ? classes.menuItems1 : classes.menuItems}
								>
									<Button
										href={`/recipes/favorites`}
										className={classes.menuItems}
										classes={{ label: classes.viewButtonLabel }}
										useState={{currentPage:5}}
									>
										<ListItemIcon>
											<Favorite
												className={`${classes.menuIcon} ${classes.menuItems}`}
											/>
										</ListItemIcon>
										<Typography variant="subtitle1">Favorites</Typography>
									</Button>
								</MenuItem>
								{user.role == "admin" ? 
									<MenuItem button key={2}
										className={currentPage == 6 ? classes.menuItems1 : classes.menuItems}
									>
										<Button
											href={`/recipes/upload`}
											className={classes.menuItems}
											classes={{ label: classes.viewButtonLabel }}
											useState={{currentPage:6}}
										>
											<ListItemIcon>
												<Backup className={`${classes.menuIcon} ${classes.menuItems}`} />
											</ListItemIcon>
											<Typography variant="subtitle1">Upload</Typography>
										</Button>
									</MenuItem>
									: <Box></Box>
								}
								{user.role == "admin" ?
									<MenuItem button key={3}
										className={currentPage == 7 ? classes.menuItems1 : classes.menuItems}
									>
										<Button
											href={`/profile/manage`}
											className={classes.menuItems}
											classes={{ label: classes.viewButtonLabel }}
											useState={{currentPage:7}}
										>
											<ListItemIcon>
												<Tune className={`${classes.menuIcon} ${classes.menuItems}`}/>
											</ListItemIcon>
											<Typography variant="subtitle1">Manage</Typography>
										</Button>
									</MenuItem>
									: <Box></Box>
								}
								<MenuItem button key={4} className={classes.menuItems}>
									<Button
										onClick={() => logout()}
										className={classes.menuItems}
										classes={{ label: classes.viewButtonLabel }}
									>
										<ListItemIcon>
											<ExitToApp
												className={`${classes.menuIcon} ${classes.menuItems}`}
											/>
										</ListItemIcon>
										<Typography variant="subtitle1">Logout</Typography>
									</Button>
								</MenuItem>
							</Menu>
						</Button>
					</Toolbar>
				) : (
					<Toolbar disableGutters></Toolbar>
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
