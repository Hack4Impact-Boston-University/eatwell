import {
	Box,
	Grid,
	makeStyles,
	TextField,
	Typography,
	CircularProgress,
} from "@material-ui/core";
import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import FirebaseAuth from "../../components/FirebaseAuth";
import { useUser } from "../../utils/auth/useUser";
import * as firebase from 'firebase'
import 'firebase/firestore'
import { Redirect } from 'react-router-dom'
import { useRouter } from 'next/router'
import styles from '../../styles/Home.module.css'

const useStyles = makeStyles((theme) => ({
    container: {
          background: `url(${"/assets/backgroundImage.png"}) repeat center center fixed`,
          height: "100vh",
          overflow: "hidden",
      },
  }));

export default function create() {
    const classes = useStyles();
    //console.log("User not logged in.");

    if(!getUserFromCookie || !("code" in getUserFromCookie())) {
        removeUserCookie();
    }

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

