<<<<<<< HEAD
// import React from "react";
// import {
//     AppBar,
//     Avatar,
//     Box,
//     Button,
//     makeStyles,
//     Toolbar,
//     Typography,
// } from "@material-ui/core";
// import { useRouter } from "next/router";

// const useStyles = makeStyles((theme) => ({
//     logo: {
//         marginRight: theme.spacing(2),
//     },
//     logoContainer: {
//         display: "flex",
//         "&:hover": {
//             cursor: "pointer",
//         },
//     },
//     toolbar: {
//         display: "flex",
//         justifyContent: "space-between",
//         background: "lightgreen",
//     },
//     centerText: {
//         display: "flex",
//         alignItems: "center",
//     },
//     menuContainer: {
//         display: "flex",
//         alignItems: "center",
//     },
//     menuItems: {
//         padding: "8px",
//         color: "black",
//     },
// }));

// const Navbar = () => {
//     const router = useRouter();
//     const classes = useStyles();

//     return (
//         <div>
//             <AppBar position="static">
//                 <Toolbar className={classes.toolbar}>
//                     <Box
//                         onClick={(e) => {
//                             e.preventDefault;
//                             router.push("/");
//                         }}
//                         className={classes.logoContainer}
//                     >
//                         <Avatar
//                             alt="Logo"
//                             src="/assets/eatwell_logo.png"
//                             className={classes.logo}
//                         />
//                         <Box className={classes.centerText}>
//                             <Typography
//                                 variant="h6"
//                                 style={{
//                                     userSelect: "none",
//                                     color: "black",
//                                 }}
//                             >
//                                 EatWell
//                             </Typography>
//                         </Box>
//                     </Box>

//                     <Box className={classes.menuContainer}>
//                         <Button href="/" className={classes.menuItems}>
//                             Home
//                         </Button>
//                         <Button href="#" className={classes.menuItems}>
//                             Recipes
//                         </Button>
//                         <Button href="/profile" className={classes.menuItems}>
//                             Profile
//                         </Button>
//                     </Box>
//                 </Toolbar>
//             </AppBar>
//         </div>
//     );
// };

// export default Navbar;

=======
import React, { useState } from "react";
import {
	AppBar,
	Avatar,
	Box,
	Button,
	Drawer,
	makeStyles,
	Toolbar,
	Typography,
} from "@material-ui/core";
// import { useRouter } from "next/router";
import { useUser } from "../utils/auth/useUser";
import Link from "next/link";

const useStyles = makeStyles((theme) => ({
	logo: {
		marginRight: theme.spacing(2),
	},
	logoContainer: {
		display: "flex",
		"&:hover": {
			cursor: "pointer",
		},
	},
	toolbar: {
		display: "flex",
		justifyContent: "space-between",
		background: "#20D3D6",
	},
	centerText: {
		display: "flex",
		alignItems: "center",
	},
	menuContainer: {
		display: "flex",
		alignItems: "center",
	},
	menuItems: {
		padding: "8px",
		color: "#EEF8F9",
	},
}));

const Navbar = () => {
	// const router = useRouter();
	const classes = useStyles();
	const [topDrawer, setTopDrawer] = useState(false);

	const toggleDrawer = (event) => {
		setTopDrawer(!topDrawer);
	};

	const { user, logout } = useUser();
	return (
		<div>
			{/* <Button onClick={toggleDrawer}>Toggle</Button>
			<Drawer
				anchor="top"
				open={topDrawer}
				onClose={() => setTopDrawer(!topDrawer)}
			>
				asdf
			</Drawer> */}
			<AppBar position="static">
				<Toolbar className={classes.toolbar}>
					<Button
						href="/"
						// onClick={(e) => {
						//     e.preventDefault();
						//     router.push("/");
						// }}
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

					<Box className={classes.menuContainer}>
						<Button className={classes.menuItems}>
							<Link href={`/`}>
								<a>Home</a>
							</Link>
						</Button>
						<Button className={classes.menuItems}>
							<Link href={`recipes/chicken_fried_rice`}>
								<a>Recipe</a>
							</Link>
						</Button>
						{user ? (
							<div>
								<Button className={classes.menuItems}>
									<Link href={`profile`}>
										<a>Profile</a>
									</Link>
								</Button>
								<Button onClick={() => logout()} className={classes.menuItems}>
									Logout
								</Button>
							</div>
						) : (
							<Button className={classes.menuItems}>
								<Link href={`login`}>
									<a>Login</a>
								</Link>
							</Button>
						)}
					</Box>
				</Toolbar>
			</AppBar>
		</div>
	);
};
>>>>>>> 23f5408e9b11364500a943017ad178a1f6317137

import React, { Component } from 'react';
import {Nav, Navbar, Form, NavDropdown, MenuItem,  Tabs, ButtonToolbar, Button, Table, ButtonGroup, Row, Col, Grid, Panel, FormGroup, FormControl} from 'react-bootstrap';
import './navbar.module.css';

export default class Navbarr extends Component {
  render() {
    const color = {
      background: "lightgreen",
    }
    return (
      <Navbar bg="NavbarItems" className={color}>
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