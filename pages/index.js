import React, {useState} from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import * as ui from '@material-ui/core'
import Link from 'next/link'
import { useUser } from '../utils/auth/useUser'
import FirebaseAuth from '../components/FirebaseAuth'
import Navbar from "../components/Navbar";
import { makeStyles, 
        Dialog, 
        DialogContent,
        DialogTitle,
        Button
        } from "@material-ui/core";
import {getUserFromCookie} from "../utils/cookies"
import { DialerSip } from '@material-ui/icons'

const useStyles = makeStyles((theme) => ({
  heading: {
      color: "red",
  },
  avatar: {
      height: theme.spacing(13),
      width: theme.spacing(13),
      margin: "auto",
  },
  btn: {
      width: "8rem",
      display: "block",
      margin: "auto",
      textAlign: "center",
      marginTop: "1rem",
  },
  formItems: {
      marginTop: theme.spacing(2),
  },
}));

const Index = () => {
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
  function Login() {
    if(login) {
      return (
        <div>
          <FirebaseAuth/>
        </div>
      );
    }
    return (
      <ui.Grid container direction="row" justify="center" alignItems="center">
      </ui.Grid>
    );
  }
  return (
    <div>
      <Navbar/>
       <div className={styles.container}>
        <Head>
          <title>EatWell</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={styles.main}>
          <img id={styles.logo} src="/assets/eatwell_logo 2.png" width="50%"/>

          <h1 className={styles.title}>
            Welcome to EatWell!
          </h1>
          
          <Button>
            <FirebaseAuth/>
          </Button>

          {/* <Login/>
          {user && 
            <div>
              {user.enrolledProgram}
            </div>
          } */}
        </main>
      </div>
    </div>
  )
}

export default Index
