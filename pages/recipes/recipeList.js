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

export default function RecipeReviewCard() {
  const classes = useStyles();

  const {user, upload} =  useUser()
  const { data: _data } = useSWR(`/api/recipes/getAllRecipes`, fetcher);
  const favRecipes = getFavsFromCookie() || {};
  //const { data: userData } = useSWR(`/api/favoriteRecipes/${favoriteRecipe}`, fetcher);


  
  useEffect(() => {
    window.addEventListener('beforeunload', () => {
      upload({favoriteRecipes: Object.keys(getFavsFromCookie())})
    })
  })


  if ((!_data) || (!favRecipes)) {
    return "Loading...";
  }

  return (<div>
    <Navbar/>
    <Grid container spacing={10} className={classes.gridContainerMain} >
      {
        _data.map((obj, idx) => {
          if (!obj.name || !obj.id) return;
          //<RecipeCard obj={_data[4]} isFav = {favRecipes.favRec.includes(_data[4].dishID)} />
          return(<RecipeCard key={obj.id} obj={obj} isFav = {obj.id in favRecipes} />)
        })
      }

    </Grid>
  </div>);
}