import React, {useState, useEffect} from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import * as ui from '@material-ui/core'
import Link from 'next/link'
import { useUser } from '../utils/auth/useUser'
import FirebaseAuth from '../components/FirebaseAuth'
import Navbar from "../components/Navbar";
import {makeStyles,
        Button,
        Box,
        Grid,
        Dialog,
        DialogTitle,
        DialogContent,
        TextField,
        Typography,
        } from "@material-ui/core";
import {getUserFromCookie, removeUserCookie} from "../utils/cookies"
import { useRouter } from 'next/router';
import {checkCode} from "../utils/codes.js";

const useStyles = makeStyles((theme) => ({
  container: {
		background: `url(${"/assets/backgroundImage.png"}) repeat center center fixed`,
		height: "100vh",
		overflow: "hidden",
	},
}));

const Index = () => {
  const classes = useStyles();
  const { user, logout } = useUser()
  const [login, setLogin] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [errorText, setErrorText] = useState("");
  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
  };
  function signInClick(event) {
    setLogin(true);
  }

  const router = useRouter();

  const submit = () => {
    console.log("0");
    if(code != "") {
      console.log("1");
      checkCode(code.trim().toUpperCase()).then((data) => {
        console.log(data)
        setErrorText("");
        // Save program info for later
        router.push("/profile/create");
      }).catch((err) => {
        // Check if firebase error or incorrect code, return error accordingly
        console.log(err);
        setErrorText(typeof(err) == "string" ? err : err.message);
      });
    } else {
      setErrorText("");
    }
  }

		const userData = getUserFromCookie();
    if(userData) {
      if("code" in userData) {
        removeUserCookie();
      } else if(!("firstname" in userData)) {
			  router.push("/profile/makeProfile");
		  }
    }

  return (
    <div>
      <Box className={classes.container}>
        <div className={styles.container}>
          <Head>
            <title>EatWell</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <main className={styles.main}>
            <img className={styles.logo} src="/assets/eatwell_logo 2.png"/>

            <h4 className={styles.title}>
              Welcome to EatWell!
            </h4>

            {!user && 
                <Grid container justify="center">
                  <Grid container item xs={5} justify="center">
                    <Grid xs={12} className={classes.welcomeHeader} item>
                      <Typography align="center" gutterBottom>
                        Input your organization-provided activation code to register:
                      </Typography>
                    </Grid>
                    <Grid justify="center" className={classes.formItems} container>
                      <TextField
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        error={false}
                        label="Activation Code"
                        placeholder="Your Organization's Code"
                        required
                        // helperText="Please enter your first name"
                      />
                    </Grid>
                    <Grid container justify="center" item>
                      <Button variant="contained" color="primary" className={classes.btn} onClick={() => submit()}>
                        Submit
                      </Button>
                    </Grid>
                    <Grid justify="center" className={classes.formItems} container>
                        <Box component="div" textOverflow="clip">
                          <Typography variant="h6" color={'error'}>
                            {errorText}
                          </Typography>
                        </Box>
                    </Grid>
                  </Grid>
                  <Grid item xs={5} justify="center">
                      <Typography align="center" gutterBottom>
                        Already registered? Sign in to proceed:
                      </Typography>
                      <Grid container justify="center">
                        <FirebaseAuth/>
                      </Grid>
                  </Grid>
                </Grid>
            }
            
          </main>
        </div>
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
          <DialogTitle id="form-dialog-title">Login</DialogTitle>
            <DialogContent>
              {/* <FirebaseAuth/> */}
            </DialogContent>
        </Dialog>
      </Box>
      
      <div className={styles.nav}>
        <Navbar/>
      </div>
    </div>
  )
}

export default Index
