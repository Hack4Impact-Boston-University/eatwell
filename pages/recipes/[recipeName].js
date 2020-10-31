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


export default function Recipe() {
  const router = useRouter();
  const { recipeName } = router.query;
  const { data } = useSWR(`/api/recipes/${recipeName}`, fetcher);
  const { width } = useWindowSize();

  if (!data) {
    return 'Loading...';
  }

  const [value, setValue] = React.useState(2);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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

      <toggle.ToggleButtonGroup aria-label="text formatting">
        <toggle.ToggleButton value="bold" aria-label="bold">
          <AssignmentIcon/><text>Recipe</text>
        </toggle.ToggleButton>
        <toggle.ToggleButton value="italic" aria-label="italic">
          <BuildIcon/><text>Skill</text>
        </toggle.ToggleButton>
        <toggle.ToggleButton value="underlined" aria-label="underlined">
          <EmojiObjectsIcon/><text>Tip</text>
        </toggle.ToggleButton>
      </toggle.ToggleButtonGroup>

      <div id="recipe">
        <iframe src={data.videoUrl} width="100%" height={(width*0.625)} frameBorder="0" align="center" position="sticky" allow="autoplay; fullscreen"></iframe>
      </div>
    </div>
  );
}