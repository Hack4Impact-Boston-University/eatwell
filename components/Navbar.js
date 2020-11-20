import React, { useState } from "react";
import {
	AppBar,
	Avatar,
	Box,
	Button,
	makeStyles,
	useTheme,
	Toolbar,
	Typography,
} from "@material-ui/core";
// import { useRouter } from "next/router";
import { useUser } from "../utils/auth/useUser";
import Link from "next/link";
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from '@material-ui/icons/Menu';
import { AccountCircle, MenuBook } from "@material-ui/icons";

const drawerWidth = 100
const barWidth = 60

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
	},
	drawer: {
		[theme.breakpoints.up('sm')]: {
			width: drawerWidth,
			flexShrink: 0,
		},
		background: "#0A5429"
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
	drawerPaper: {
		marginTop: barWidth,
		width: drawerWidth,
		background: "#0A5429"
	},
	// content: {
	// 	flexGrow: 1,
	// 	padding: theme.spacing(3),
	// },
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
		alignItems: "center",
	},
	drawerContainer: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
	},
	menuItems: {
		display: "flex",
		alignItems: "center",
		padding: "8px",
		color: "#EEF8F9",
	},
	menuIcon: {
		marginRight: theme.spacing(0.5)
	}
}));

const Navbar = () => {
	const classes = useStyles();
	const [mobileOpen, setMobileOpen] = React.useState(false);
	const theme = useTheme();
	const { user, logout } = useUser();


	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	const Items = (props) => {
		var cont = props.isDrawer ? classes.drawerContainer : classes.menuContainer;
		return (
			<div>
				<Box className={cont}>
					{/* <Button className={classes.menuItems}>
						<Link href={`/`}>
							<a>Home</a>
						</Link>
					</Button> */}
					<Link href={`/recipes/chicken_fried_rice`}>
						<Button className={classes.menuItems}>
							<MenuBook className={classes.menuIcon} />
							<Typography variant="p">Recipes</Typography>
						</Button>
					</Link>
					{user ? (
						<div className={classes.menuItems}>
							<Link href={`/profile/profile`}>
								<Button className={classes.menuItems}>
									<AccountCircle className={classes.menuIcon} />
									<Typography variant="p">Profile</Typography>
								</Button>
							</Link>
							<Button onClick={() => logout()} className={classes.menuItems}>
								Logout
							</Button>
						</div>
					) : (
							<Button className={classes.menuItems}>
								<Link href={`/login`}>
									<a>Login</a>
								</Link>
							</Button>
						)}
				</Box>
			</div>
		);
	}

	return (
		<div>
			<div>
				<Hidden smUp implementation="css">
					<Drawer
						variant="persistent"
						anchor={'right'}
						open={mobileOpen}
						onClose={handleDrawerToggle}
						classes={{
							paper: classes.drawerPaper,
						}}
						ModalProps={{
							keepMounted: true, // Better open performance on mobile.
						}}
					>
						<Items isDrawer={true} />
					</Drawer>
				</Hidden>
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
						<Hidden only="xs" implementation="css">
							<Items isDrawer={false} />
						</Hidden>
						<IconButton
							color="inherit"
							aria-label="open drawer"
							edge="start"
							onClick={handleDrawerToggle}
							className={classes.menuButton}
						>
							<MenuIcon />
						</IconButton>
					</Toolbar>
				</AppBar>
			</div>
		</div>
	);
};
export default Navbar;
// import React, { Component } from 'react';
// import {Nav, Navbar, Form, NavDropdown, MenuItem,  Tabs, ButtonToolbar, Button, Table, ButtonGroup, Row, Col, Grid, Panel, FormGroup, FormControl} from 'react-bootstrap';
// import './navbar.module.css';

// export default class Navbarr extends Component {
//   render() {
//     const color = {
//       background: "lightgreen",
//     }
//     return (
//       <Navbar bg="NavbarItems" className={color}>
//         <Navbar.Brand href="/">Eatwell</Navbar.Brand>
//         <Navbar.Toggle aria-controls="basic-navbar-nav" />
//         <Navbar.Collapse id="basic-navbar-nav">
//           <Nav className="mr-auto">
//             <Nav.Link href="#">Recipes</Nav.Link>
// 			<Nav.Link href="/profile">Profile</Nav.Link>
//           </Nav>
//           <Form inline>
//             <FormControl type="text" placeholder="Search" className="mr-sm-2" />
//             <Button variant="outline-success">Search</Button>
//           </Form>
//         </Navbar.Collapse>
//       </Navbar>
//       );
//     }
//   }