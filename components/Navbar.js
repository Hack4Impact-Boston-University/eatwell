// import React, { Component } from 'react';
// import './navbar.module.css';

// const MenuItems = [
//     {
//         title: "Home",
//         url: '#',
//         cName: 'nav-links'
//     },
//     {
//         title: "Recipe",
//         url: '#',
//         cName: 'nav-links'
//     },
//     {
//         title: "Login",
//         url: '#',
//         cName: 'nav-links'
//     },
//     {
//         title: "Search",
//         url: '#',
//         cName: 'nav-links'
//     },
//     {
//         title: "Home",
//         url: '#',
//         cName: 'nav-links'
//     },
// ]
// class Navbar extends Component {
//   render() {
//     return (
// 		<nav className="NavbarItems">
// 			<h1 className="navbar-logo">EatWell</h1>
// 			<div className="menu-icon">

// 			</div>
// 			<ul className="nav-menu">
// 				{MenuItems.map((item,index) => {
// 					return (
// 						<li key={index}>
// 							<a className={item.cName} href={item.url}>
// 							{item.title}
// 							</a>
// 						</li>
// 					)
// 				})}
// 			</ul>
// 		</nav>
// 	)
//   }
// }
// export default Navbar;



import React, { Component } from 'react';
import {Nav, Navbar, Form, NavDropdown, MenuItem,  Tabs, ButtonToolbar, Button, Table, ButtonGroup, Row, Col, Grid, Panel, FormGroup, FormControl} from 'react-bootstrap';
import './navbar.module.css';

export default class Navbarr extends Component {
  render() {
    return (
      <Navbar bg="NavbarItems" variant="light">
        <Navbar.Brand href="/">Eatwell</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#">Recipes</Nav.Link>
			<Nav.Link href="/profile">Profile</Nav.Link>
          </Nav>
          <Form inline>
            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
            <Button variant="outline-success">Search</Button>
          </Form>
        </Navbar.Collapse>
      </Navbar>
      );
    }
  }





// import React from "react";
// import {
// 	AppBar,
// 	Avatar,
// 	Box,
// 	Button,
// 	makeStyles,
// 	Toolbar,
// 	Typography,
// } from "@material-ui/core";
// import { useRouter } from "next/router";

// const useStyles = makeStyles((theme) => ({
// 	logo: {
// 		marginRight: theme.spacing(2),
// 	},
// 	logoContainer: {
// 		display: "flex",
// 		"&:hover": {
// 			cursor: "pointer",
// 		},
// 	},
// 	toolbar: {
// 		display: "flex",
// 		justifyContent: "space-between",
// 		background: "black",
// 	},
// 	centerText: {
// 		display: "flex",
// 		alignItems: "center",
// 	},
// 	menuContainer: {
// 		display: "flex",
// 		alignItems: "center",
// 	},
// 	menuItems: {
// 		padding: "8px",
// 		color: "white",
// 	},
// }));

// const Navbar = () => {
// 	const router = useRouter();
// 	const classes = useStyles();

// 	return (
// 		<div>
// 			<AppBar position="static">
// 				<Toolbar className={classes.toolbar}>
// 					<Box
// 						onClick={(e) => {
// 							e.preventDefault;
// 							router.push("/");
// 						}}
// 						className={classes.logoContainer}
// 					>
// 						<Avatar alt="Logo" src="L" className={classes.logo} />
// 						<Box className={classes.centerText}>
// 							<Typography variant="h6" style={{ userSelect: "none" }}>
// 								EatWell
// 							</Typography>
// 						</Box>
// 					</Box>

// 					<Box className={classes.menuContainer}>
// 						<Button href="/" className={classes.menuItems}>
// 							Home
// 						</Button>
// 						<Button href="#" className={classes.menuItems}>
// 							Recipes
// 						</Button>
// 						<Button href="/profile" className={classes.menuItems}>
// 							Profile
// 						</Button>
// 					</Box>
// 				</Toolbar>
// 			</AppBar>
// 		</div>
// 	);
// };

// export default Navbar;
