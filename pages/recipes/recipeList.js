import Head from 'next/head'
import React from 'react';
import { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import useSWR from 'swr';
import { useUser } from "../../utils/auth/useUser";
import RecipeCard, { recipeCard} from "./recipeCard";
import {
	getFavsFromCookie,
} from "../../utils/cookies";
import Navbar from "../../components/Navbar";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PropTypes from 'prop-types';
import styles from '../../styles/Home.module.css'



const fetcher = async (...args) => {
  const res = await fetch(...args);

  return res.json();
};

const useStyles = makeStyles((theme) => ({

  gridContainerMain: {
    paddingLeft: 200,
    paddingRight: 200,
  },

}));

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

export default function RecipeReviewCard() {
  const classes = useStyles();

  const {user, upload} =  useUser()
  const { data: _data } = useSWR(`/api/recipes/getAllRecipes`, fetcher);
  let favRecipes = getFavsFromCookie() || {};
  //const { data: userData } = useSWR(`/api/favoriteRecipes/${favoriteRecipe}`, fetcher);
  const [value, setValue] = React.useState(0);
  const [favs, setFavs] = React.useState(value == 1);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setFavs(newValue == 1)
  };
  
  useEffect(() => {
    window.addEventListener('beforeunload', () => {
      upload({favoriteRecipes: Object.keys(getFavsFromCookie())})
    })
  })

  const onFavClick = () => {
    let val = value
    setValue(value ? 0 : 1)
    setValue(val)
    favRecipes = getFavsFromCookie() || {};
  }
  if ((!_data) || (!favRecipes)) {
    return "Loading...";
  }

  return (
  <div>
    
    <Grid container spacing={1000} className={classes.gridContainerMain} >
      {
        _data.map((obj, idx) => {
          if (!obj.name || !obj.id) return;
          var isFav = obj.id in favRecipes;
          if (!favs || obj.id in favRecipes) {
            return(<RecipeCard key={obj.id} obj={obj} isFav = {obj.id in favRecipes} onFavClick={() => onFavClick()}/>)
          }
          else {
            console.log(obj.id)
            return;
          }

          //<RecipeCard obj={_data[4]} isFav = {favRecipes.favRec.includes(_data[4].dishID)} />
          
        })
      }

    </Grid>

    <div className={styles.nav}>
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
          <Tab label="All Recipes" {...a11yProps(0)} />
          <Tab label="Favorites Only" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
    </div>
  </div>);
}