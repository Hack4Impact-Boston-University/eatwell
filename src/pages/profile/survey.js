/* survey.js embeds the https://docs.google.com/forms/d/e/1FAIpQLSdkoKfBcKm8Yc4dLt0mJ4SidcdwwbeKxzdp6RVdXfRKYqPMkw/viewform Google Form */

import { Box, Fab, makeStyles } from "@material-ui/core";
import { useRouter } from 'next/router'
import { getUserFromCookie } from "../../utils/cookies";
import React, { useState, useEffect } from "react";
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
      width: undefined,
      height: undefined,
    });
    useEffect(() => {
      // only execute all the code below in client side
      if (typeof window !== "undefined") {
        // Handler to call on window resize
        function handleResize() {
          // Set window width/height to state
          setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
          });
        }
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
      }
    }, []);
    return windowSize;
}

const useStyles = makeStyles((theme) => ({
    container: {
      backgroundColor: '#c8e6c9',
          textAlign: "center",
          width: "100%"
    },
    fab: {
        position: 'fixed',
        bottom: theme.spacing(3),
        right: theme.spacing(3),
        color: "#FFFFFF",
        backgroundColor: "#126500",
        "&:hover": {
          color: "#FFFFFF",
          backgroundColor: "#126500"
        },
    }
}));

const Survey = () => {
    const router = useRouter();
    const classes = useStyles();
    const { height } = useWindowSize();

    const submit = () => {
        router.push('/');
    }
    
    let userData = {};

    useEffect(() => {
      userData = getUserFromCookie()
    }, [userData])

    return(
      <div className={classes.container}>
          <Box height={20}></Box>
          <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSdkoKfBcKm8Yc4dLt0mJ4SidcdwwbeKxzdp6RVdXfRKYqPMkw/viewform?embedded=true" width="100%" height={height} frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>
          <Box height={20}></Box>
          <Fab variant="extended" className={classes.fab} onClick={() => submit()}>
              <Box width={5}></Box>
              Completed Survey
              <ArrowRightIcon />
          </Fab>
      </div>
    )
};

export default Survey;