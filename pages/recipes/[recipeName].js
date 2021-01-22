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

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: "100%",
    paddingTop: "5vh"
  },
  video: {
    marginTop: "12vh",
    marginBottom: "3vh"
  }
}));

export default function Recipe() {
  const router = useRouter();
  const { recipeName } = router.query;
  const { data } = useSWR(`/api/recipes/${recipeName}`, fetcher);
  const { width } = useWindowSize();

  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const [pdf_url, setPdfURL] = useState('')

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  if (!data) {
    return 'Loading...';
  }

  else {
    initFirebase()
    firebase.storage().ref().child(data.pdfRecipe).getDownloadURL().then(function(url) {
      // update url
      setPdfURL(url)
    }).catch(function(error) {
    
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/object-not-found':
          // File doesn't exist
          break;
    
        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          break;
    
        case 'storage/canceled':
          // User canceled the upload
          break;
    
        case 'storage/unknown':
          // Unknown error occurred, inspect the server response
          break;
      }
    });
    return (
      <div className={classes.root}>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={value}
          onChangeIndex={handleChangeIndex}>
        
          <TabPanel value={value} index={0} dir={theme.direction}>
          <div position="fixed" className={classes.video}>
                <iframe position="fixed" src={data.videoRecipe} width="100%" height={(width*0.4)} frameBorder="0" align="center" position="sticky" allow="autoplay; fullscreen"></iframe>
          </div>
          <iframe src={pdf_url} width="100%" height={width} frameBorder="0" align="center" position="relative"></iframe>
          </TabPanel>
          {data.videoSkills != "https://player.vimeo.com/video/" &&
            <TabPanel value={value} index={1} dir={theme.direction}>
              <iframe src={data.videoSkills} width="100%" height={(width*0.4)} frameBorder="0" align="center" position="sticky" allow="autoplay; fullscreen"></iframe>
            </TabPanel>
          }
          {data.videoTips != "https://player.vimeo.com/video/" &&
            <TabPanel value={value} index={2} dir={theme.direction}>
              <iframe src={data.videoTips} width="100%" height={(width*0.4)} frameBorder="0" align="center" position="sticky" allow="autoplay; fullscreen"></iframe>
            </TabPanel>
          }
          <TabPanel value={value} index={2} dir={theme.direction}>
          <iframe src={data.videoTips} width="100%" height={(width*0.4)} frameBorder="0" align="center" position="sticky" allow="autoplay; fullscreen"></iframe>
          </TabPanel>
        </SwipeableViews>  


          <div className={styles.nav}>
            <div style={{
              width: "100%",
              minWidth: "29%",
            }}>

              <Navbar/>
              <AppBar position = "static"  color="default">
                <Tabs
                  value={value}
                  onChange={handleChange}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="fullWidth"
                  aria-label="full width tabs example"
                >
                  <Tab label="Recipe" {...a11yProps(0)} />
                  {data.videoSkills != "https://player.vimeo.com/video/" &&
                    <Tab label="Skill" {...a11yProps(1)} />
                  }
                  {data.videoTips != "https://player.vimeo.com/video/" &&
                    <Tab label="Tip" {...a11yProps(2)} />
                  }
                </Tabs>
              </AppBar>
          </div>
        </div>     
      </div>
      
    );
  }
}
