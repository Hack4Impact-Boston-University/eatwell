import Head from "next/head";
import React from "react";
import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import { Grid } from "@material-ui/core";
import useSWR from "swr";
import { useUser } from "../../utils/auth/useUser";
import RecipeCard from "../../components/recipeCard";
import {
	getFavsFromCookie,
	getNotesFromCookie,
	getRatingsFromCookie,
	getUserFromCookie,
} from "../../utils/cookies";
import Navbar from "../../components/Navbar";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import PropTypes from "prop-types";
import styles from "../../styles/Home.module.css";
import { uploadRating } from "../../utils/recipes.js";
import _, { map } from "underscore";

import { useRouter } from "next/router";
import { ColorLensOutlined } from "@material-ui/icons";

const fetcher = async (...args) => {
	const res = await fetch(...args);

	return res.json();
};

const useStyles = makeStyles((theme) => ({
	gridContainerMain: {
		paddingLeft: "calc(max(5vw,50vw - 450px))",
		paddingRight: "calc(max(5vw,50vw - 450px))",
		justifyContent: "space-around",
	},
	viewTabLabel: { textTransform: "none" },
}));

export default function RecipeReviewCard() {
	const classes = useStyles();
	const [uploadDate, setUploadDate] = React.useState(Date.now());
	const { user, upload } = useUser();
	const [recipes, setRecipes] = React.useState([])
	const { data: recipesDic } = useSWR(`/api/recipes/getAllRecipesDic`, fetcher);
	const { data: programsDic } = useSWR(`/api/programs/getAllProgramsDic`, fetcher);
	let favRecipes = getFavsFromCookie() || {};
	const recipeNotes = getNotesFromCookie() || {};
	const recipeRatings = getRatingsFromCookie() || {};
	//const { data: userData } = useSWR(`/api/favoriteRecipes/${favoriteRecipe}`, fetcher);
	const [value, setValue] = React.useState(0);
	//	const [favs, setFavs] = React.useState(value == 1);
	const [dummy, setDummy] = React.useState(true);

	const router = useRouter();

	// const handleChange = (event, newValue) => {
	// 	setValue(newValue);
	// 	setFavs(newValue == 1);
	// };

	useEffect(() => {
		const uploadData = () => {
			if (!_.isEqual(getFavsFromCookie(), undefined)) {
				upload({
					//favoriteRecipes: Object.keys(getFavsFromCookie()),
					notes: getNotesFromCookie(),
					ratings: getRatingsFromCookie(),
				});
				//uploadRating(getRatingsFromCookie(), recipeRatings, recipes);
			}
		};

		window.addEventListener("beforeunload", uploadData);

		return () => window.removeEventListener("beforeunload", uploadData);
	});

	const userData = getUserFromCookie();
	if (!userData || "code" in userData) {
		// router.push("/");
	} else if (!("firstname" in userData)) {
		router.push("/profile/makeProfile");
	}

	if (_.isEqual(recipes,[]) || !recipesDic || !programsDic || !user || !favRecipes) {
		if (!recipesDic) {
			return "Loading recipesDic...";
		} if (!programsDic) {
			return "Loading programsDic...";
		} if (!user) {
			return "Loading user...";
		} if (!favRecipes) {
			return "Loading favRecipes...";
		}
		setRecipes(Object.keys(recipesDic).map(function (key) {
			return recipesDic[key];
		}));
		if (_.isEqual(recipes,[])) {
			return "Loading recipes...";
		}
	}

	const recipesUser = [];
	if (!user.program == "") {
		const keysList = Object.keys(programsDic[user.program]?.programRecipes);
		if (_.isEqual(user?.role, "user")) {
			if (!_.isEqual(user.program, "")) {
				if (
					programsDic[user.program]?.programRecipes != null ||
					programsDic[user.program]?.programRecipes != []
				) {
					var i;
					for (i = 0; i < keysList.length; i++) {
						console.log(programsDic[user.program].programRecipes[keysList[i]]);
						var d = Date.parse(
							programsDic[user.program].programRecipes[keysList[i]] +
							"T00:00:00.0000"
						);
						if (d < uploadDate) {
							recipesUser.push(recipesDic[keysList[i]]);
						}
					}
				}
			}
		}
	}

	return (
		<div className={styles.container}>
			{user.role == "admin" ? (
				!_.isEqual(recipes, []) ? (
					<Grid container className={classes.gridContainerMain}>
						{recipes.map((obj, idx) => {
							if (!obj.nameOfDish || !obj.id) { return; }
							//if (!favs || obj.id in favRecipes) {
							return (
								<Grid item container xs={12} md={6} justify="center">
									<RecipeCard
										key={obj.id}
										object={obj}
										isFav={obj.id in favRecipes}
										inFavoritesPage={false}
										initNotes={
											obj.id in recipeNotes ? recipeNotes[obj.id] : []
										}
										initRating={
											obj.id in recipeRatings ? recipeRatings[obj.id] : 0
										}
									/>
								</Grid>
							);
							//} else {
							//	return;
							//}
							//<RecipeCard obj={recipesUser[4]} isFav = {favRecipes.favRec.includes(recipesUser[4].dishID)} />
						})}
					</Grid>
				) : (
					<Grid>
						<h4>No recipes to display</h4>
					</Grid>
				)
			) : !_.isEqual(recipesUser, []) ? (
				<Grid container spacing={1000} className={classes.gridContainerMain}>
					{recipesUser.map((obj, idx) => {
						if (!obj.nameOfDish || !obj.id) { return; }
						//if (!favs || obj.id in favRecipes) {
						return (
							<Grid item container xs={12} md={6} justify="center">
								<RecipeCard
									key={obj.id}
									object={obj}
									isFav={obj.id in favRecipes}
									onFavClick={() => onFavClick()}
									initNotes={obj.id in recipeNotes ? recipeNotes[obj.id] : []}
									initRating={
										obj.id in recipeRatings ? recipeRatings[obj.id] : 0
									}
								/>
							</Grid>
						);
						//} else {
						//	return;
						//}
						//<RecipeCard obj={recipesUser[4]} isFav = {favRecipes.favRec.includes(recipesUser[4].dishID)} />
					})}
				</Grid>
			) : (
				<Grid>
					<h4>No recipes to display</h4>
				</Grid>
			)}

			<div className={styles.nav}>
				<Navbar />

				{/* <AppBar position="static" color="default">
					<Tabs
						value={value}
						onChange={handleChange}
						indicatorColor="primary"
						textColor="primary"
						variant="fullWidth"
						aria-label="full width tabs example"
					>
						<Tab
							label="All Recipes"
							{...a11yProps(0)}
							className={classes.viewTabLabel}
						/>
						<Tab
							label="Favorites Only"
							{...a11yProps(1)}
							className={classes.viewTabLabel}
						/>
					</Tabs>
				</AppBar> */}
			</div>
		</div>
	);
}
