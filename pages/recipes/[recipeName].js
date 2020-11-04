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
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';


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

// function useToggle() {
//   const [value, setValue] = React.useState(2);

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   return value;
// }

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
    width: 500,
  },
}));

export default function Recipe() {
  const router = useRouter();
  const { recipeName } = router.query;
  const { data } = useSWR(`/api/recipes/${recipeName}`, fetcher);
  const { width } = useWindowSize();

  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  if (!data) {
    return 'Loading...';
  }

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ui.AppBar position="sticky" width="100%">
        <ui.Toolbar>
          <ui.Typography variant="h6">
          View Recipe Page
          </ui.Typography>
        </ui.Toolbar>
      </ui.AppBar>

      
      {/* <ui.Paper square>
        <ui.Tabs
          // value={value}
          indicatorColor="primary"
          textColor="primary"
          // onChange={handleChange}
          aria-label="disabled tabs example"
        >
          <AssignmentIcon/><ui.Tab label="Recipe" />
          <BuildIcon/><ui.Tab label="Skill"/>
          <EmojiObjectsIcon/><ui.Tab label="Tip" />
        </ui.Tabs>
      </ui.Paper> */}

      {/* <toggle.ToggleButtonGroup aria-label="text formatting">
        <toggle.ToggleButton value="bold" aria-label="bold">
          <AssignmentIcon/><text>Recipe</text>
        </toggle.ToggleButton>
        <toggle.ToggleButton value="italic" aria-label="italic">
          <BuildIcon/><text>Skill</text>
        </toggle.ToggleButton>
        <toggle.ToggleButton value="underlined" aria-label="underlined">
          <EmojiObjectsIcon/><text>Tip</text>
        </toggle.ToggleButton>
      </toggle.ToggleButtonGroup> */}

<div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Recipe" {...a11yProps(0)} />
          <Tab label="Skill" {...a11yProps(1)} />
          <Tab label="Tip" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
        <iframe src={data.videoRecipe} width="100%" height={(width*0.625)} frameBorder="0" align="center" position="sticky" allow="autoplay; fullscreen"></iframe>
        <iframe src={data.pdfRecipe} width="100%" height={width} frameBorder="0" align="center" position="relative"></iframe>
        
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
        <iframe src={data.videoSkills} width="100%" height={(width*0.625)} frameBorder="0" align="center" position="sticky" allow="autoplay; fullscreen"></iframe>

        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
        <iframe src={data.videoTips} width="100%" height={(width*0.625)} frameBorder="0" align="center" position="sticky" allow="autoplay; fullscreen"></iframe>

        </TabPanel>
      </SwipeableViews>
    </div>

    </div>
  );
}