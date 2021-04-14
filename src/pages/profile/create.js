import {
	Box,
	Grid,
	makeStyles,
	TextField,
	Typography,
	CircularProgress,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import FirebaseAuth from "../../components/FirebaseAuth";
import { useUser } from "../../utils/auth/useUser";
import * as firebase from 'firebase'
import 'firebase/firestore'
import { Redirect, Router } from 'react-router-dom'
import { useRouter } from 'next/router'
import styles from '../../styles/Home.module.css'
import { getUserFromCookie } from "../../utils/cookies";

const useStyles = makeStyles((theme) => ({
    container: {
          background: `url(${"/assets/backgroundImage.png"}) repeat center center fixed`,
          height: "100vh",
          overflow: "hidden",
      },
  }));

export default function create() {
    const classes = useStyles();
    const router = useRouter();
    //console.log("User not logged in.");

    const userData = getUserFromCookie();
    if(!userData) {
        router.push("/");
    }
    else if("id" in userData) {
        router.push("/profile/makeProfile");
    }

        // window.onbeforeunload = () => {
		// 	if (!("id" in userData)) {
        //         console.log(userData);
		// 		removeUserCookie();
        //         router.push("/");
		// 	}
		// }

		//window.addEventListener("beforeunload", checkUserData);

        //return () => window.removeEventListener("beforeunload", checkUserData);

    return (
        <Box className={classes.container}>
            <div className={styles.nav}>
                <Navbar/>
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justify="center"
                    style={{ minHeight: '100vh' }}
                >
                    <Grid item>
                        <h1 align="center">Click below to create an account</h1>
                        <Grid container justify="center"><FirebaseAuth/></Grid>
                    </Grid>   
                </Grid> 
                
            </div>
        </Box>
    );
};

