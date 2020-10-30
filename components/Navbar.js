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
import { useRouter } from "next/router";

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
    const router = useRouter();
    const classes = useStyles();

    return (
        <div>
            <AppBar position="static">
                <Toolbar className={classes.toolbar}>
                    <Box
                        onClick={(e) => {
                            e.preventDefault;
                            router.push("/");
                        }}
                        className={classes.logoContainer}
                    >
                        <Avatar
                            alt="Logo"
                            src="/assets/eatwell_logo.png"
                            className={classes.logo}
                        />
                        <Box className={classes.centerText}>
                            <Typography
                                variant="h6"
                                style={{
                                    userSelect: "none",
                                    color: "black",
                                }}
                            >
                                EatWell
                            </Typography>
                        </Box>
                    </Box>

                    <Box className={classes.menuContainer}>
                        <Button href="/" className={classes.menuItems}>
                            Home
                        </Button>
                        <Button href="#" className={classes.menuItems}>
                            Recipes
                        </Button>
                        <Button href="/profile" className={classes.menuItems}>
                            Profile
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>
        </div>
    );
};

export default Navbar;
