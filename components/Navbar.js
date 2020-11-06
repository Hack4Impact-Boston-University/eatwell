import React from "react";
import {
    AppBar,
    Avatar,
    Box,
    Button,
    makeStyles,
    Toolbar,
    Typography,
} from "@material-ui/core";
// import { useRouter } from "next/router";
import {useUser} from "../utils/auth/useUser"
import Link from 'next/link'

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
        background: "lightgreen",
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
        color: "black",
    },
}));

const Navbar = () => {
    // const router = useRouter();
    const classes = useStyles();
    const {user, logout} = useUser();
    return (
        <div>
            <AppBar position="static">
                <Toolbar className={classes.toolbar}>
                    <Button href="/"
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
                                color: "black",
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
                        {user ? 
                            <div>
                                <Button className={classes.menuItems}>
                                    <Link href={`profile`}>
                                        <a>Profile</a>
                                    </Link>
                                </Button>
                                <Button onClick={() =>  logout()} className={classes.menuItems}>
                                    Logout
                                </Button>
                            </div>
                            :
                            <Button className={classes.menuItems}>
                                <Link href={`login`}>
                                    <a>Login</a>
                                </Link>
                            </Button>
                        }
                    </Box>
                </Toolbar>
            </AppBar>
        </div>
    );
};

export default Navbar;
