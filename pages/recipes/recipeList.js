import Head from 'next/head'
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import useSWR from 'swr';
import { useUser } from "../../utils/auth/useUser";
import RecipeCard, { recipeCard} from "./recipeCard";



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

  const {user:_user} =  useUser()
  const { data: _data } = useSWR(`/api/recipes/getAllRecipes`, fetcher);
  const { data: favRecipes } = useSWR(`/api/recipes/favoriteRecipe`, fetcher);
  //const { data: userData } = useSWR(`/api/favoriteRecipes/${favoriteRecipe}`, fetcher);


  if ((!_data) || (!favRecipes)) {
    return "Loading...";
  }

  //console.log(_data[4]);


  return (
    <Grid container spacing={10} className={classes.gridContainerMain} >
      
      {
        _data.map((obj, idx) => {
          if (!obj.name || !obj.dishID) return;
          //<RecipeCard obj={_data[4]} isFav = {favRecipes.favRec.includes(_data[4].dishID)} />
          return(<RecipeCard key={obj.dishID} obj={obj} isFav = {favRecipes.favRec.includes(obj.dishID)} />)
        })
      }

    </Grid>
  );
}

