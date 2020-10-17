import Head from 'next/head'
import * as ui from '@material-ui/core';
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

      <iframe src={data.videoUrl} width="100%" height={(width*0.625)} frameBorder="0" align="center" position="sticky" allow="autoplay; fullscreen"></iframe>
    </div>
  );
}