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
        } from "@material-ui/core";
import {getUserFromCookie} from "../utils/auth/userCookies"
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
          <ui.Button variant="outlined">
            <Link href={`recipes/chicken_fried_rice`}>
              <a>Recipe</a>
            </Link>
          </ui.Button>
          <ui.Button variant="outlined">
              <ui.Link href={"recipes/recipeList"}>
                Recipe List
              </ui.Link>
          </ui.Button>

          <ui.Button variant="outlined">
            <Link href={'profile/profile'}>
              <a>Profile</a>
            </Link>
          </ui.Button>
          {!user && 
          <ui.Button variant="outlined" onClick={() => handleToggle()}>
            Login
          </ui.Button>}

          <ui.Button variant="outlined">
              <ui.Link href='recipes/upload'>
                  Upload
              </ui.Link>
          </ui.Button>

          <ui.Button variant="outlined">
            <Link href={'profile/admin'}>
              <a>Admin</a>
            </Link>
          </ui.Button>
        </ui.Grid>
    );
  }
  return (
    <div>
      <Navbar/>
      <div className={styles.container}>
        <Head>
          <title>Create Next App</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={styles.main}>
          <img src="/assets/eatwell.png" width="50%"/>

          <h1 className={styles.title}>
            Welcome to EatWell!
          </h1>

          <Login/>
          {user && 
            <div>
              {user.enrolledProgram}
            </div>
          }
        </main>
      </div>
      <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
        <DialogTitle id="form-dialog-title">Login</DialogTitle>
          <DialogContent>
            <FirebaseAuth/>
					</DialogContent>
      </Dialog>
    </div>
  )
}

export default Index
