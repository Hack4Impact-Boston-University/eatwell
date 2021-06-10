import {
	Box,
	Grid,
	makeStyles,
	TextField,
	Typography,
    CircularProgress,
    Button,
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
    const userData = getUserFromCookie();
    const [isExisting, setIsExisting] = useState(false);

    useEffect(() => {
        if(!userData) {
            router.push("/");
        }
        else if("email" in userData) {
            router.push("/profile/makeProfile");
        }
    })

    return (
        <Box className={classes.container}>
            <div className={styles.nav}>
                <Navbar currentPage={0}/>
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justify="center"
                    style={{ minHeight: '100vh' }}
                >
                    <Grid item>
                        {isExisting ? 
                            <h1 align="center">Click below to sign in</h1> 
                            : <h1 align="center">Click below to create an account</h1>
                        }
                        <Grid container justify="center"><FirebaseAuth code={userData} isLogin={isExisting} addProgram={isExisting}/></Grid>
                    </Grid>
                    <Grid item justify="center" item>
						<Button variant="contained" color="primary" style={{marginTop: "15px"}}
							onClick={() => setIsExisting(!isExisting)}>
							{isExisting ? "Create New Account" : "Use Existing Account"}
						</Button>
					</Grid> 
                </Grid> 
                
            </div>
        </Box>
    );
};

