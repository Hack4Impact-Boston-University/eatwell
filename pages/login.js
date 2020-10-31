import React, {useState} from 'react'
import styles from '../styles/Home.module.css'
import * as ui from '@material-ui/core'
import FirebaseAuth from '../components/FirebaseAuth'
import Navbar from "../components/Navbar";
import { makeStyles } from "@material-ui/core";
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

const Login = () => {
  return (
    <ui.Card className={styles.container}>
        <FirebaseAuth/>
    </ui.Card>
  )
}

export default Login
