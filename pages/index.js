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
        DialogContent
        } from "@material-ui/core";
import {getUserFromCookie} from "../utils/cookies"
import { DialerSip } from '@material-ui/icons'

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
  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
  };
  function signInClick(event) {
    setLogin(true);
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
              <Button>
                <FirebaseAuth/>
              </Button>
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
