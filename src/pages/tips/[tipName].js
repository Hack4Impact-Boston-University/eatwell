import Head from 'next/head'
import * as ui from '@material-ui/core';
import * as toggle from '@material-ui/lab';
import AssignmentIcon from '@material-ui/icons/Assignment';
import BuildIcon from '@material-ui/icons/Build';
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';
import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
import {
  AppBar,
  Box,
  Grid,
  Tabs,
  Tab,
  Typography,
} from '@material-ui/core';
import Navbar from "../../components/Navbar";
import * as firebase from 'firebase'
import 'firebase/firestore'
import initFirebase from '../../utils/auth/initFirebase'
import styles from '../../styles/Home.module.css'

import {getUserFromCookie} from "../../utils/cookies";


const fetcher = async (...args) => {
  const res = await fetch(...args);

  return res.json();
};

function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // only execute all the code below in client side
    if (typeof window !== 'undefined') {
      // Handler to call on window resize
      function handleResize() {
        // Set window width/height to state
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
    
      // Add event listener
      window.addEventListener("resize", handleResize);
     
      // Call handler right away so state gets updated with initial window size
      handleResize();
    
      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}


const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: "100%",
    paddingTop: "9vh"
  },
  video: {
    marginTop: "3vh",
    marginBottom: "3vh"
  }
}));

// functional component for individual tip
export default function Tip() {
  const router = useRouter();
  const { tipName } = router.query;
  const { data } = useSWR(`/api/tips/${tipName}`, fetcher);
  const { width } = useWindowSize();

  const classes = useStyles();

    if(getUserFromCookie() && !("firstname" in getUserFromCookie())) {
        router.push("/profile/makeProfile");
        return (<div></div>);
    }

  if (!data) {
    return 'Loading...';
  }
    return (
      <div className={classes.root}>
          <h1 align="center">{data.tipName}</h1>
          <div position="fixed" className={classes.video}>
                <iframe position="fixed" src={"https://player.vimeo.com/video/"+data.url} width="100%" height={(width*0.4)} frameBorder="0" align="center" position="sticky" allow="autoplay; fullscreen"></iframe>
          </div>

          <div className={styles.nav}>
            <div style={{
              width: "100%",
              minWidth: "29%",
            }}>
            <Navbar currentPage={4}/>
          </div>
        </div>     
      </div>
      
    );
}
