import Head from 'next/head'
import * as ui from '@material-ui/core';
import React from 'react';
import { useState, useEffect } from 'react';

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
  console.log(windowSize);
  return windowSize;
}

export default function userAuth() {
  const { width } = useWindowSize();

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

        <iframe src="https://player.vimeo.com/video/76979871" width="100%" height={(width*0.625)} frameBorder="0" align="center" position="sticky" allow="autoplay; fullscreen"></iframe>

    </div>
  )
}
