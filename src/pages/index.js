import React, {useState} from 'react'
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
import {getUserFromCookie} from "../utils/cookies"
import { useRouter } from 'next/router';
import {checkCode} from "../utils/codes.js";
import { DialerSip } from '@material-ui/icons'
import { getRecipe } from '../utils/recipes'

const useStyles = makeStyles((theme) => ({
  container: {
		background: `url(${"/assets/backgroundImage.png"}) repeat center center fixed`,
		height: "100vh",
		overflow: "hidden",
	},
}));

function makeid(length) {
	var result           = '';
	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';// 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for ( var i = 0; i < length; i++ ) {
	   result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
 }

const Index = () => {
  const classes = useStyles();
  const { user, logout } = useUser()
  const [login, setLogin] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [code, setCode] = React.useState("");
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
    if (checkCode(code)) {
      router.push("/profile/makeProfile");
    }
  }

  if(getUserFromCookie() && !("firstname" in getUserFromCookie())) {
		router.push("/profile/makeProfile");
		return (<div></div>);
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

            <h2 className={styles.title}>
              Welcome to EatWell!
            </h2>

            {!user && 
              <Grid container>
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
                  </Grid>
                  <Grid container xs={5} justify="center">
                      <Typography align="center" gutterBottom>
                        Already registered? Sign in to proceed:
                      </Typography>
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
              <FirebaseAuth/>
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
