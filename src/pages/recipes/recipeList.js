import Head from "next/head";
import React from "react";
import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import { Grid, Typography } from "@material-ui/core";
import useSWR from "swr";
import { useUser } from "../../utils/auth/useUser";
import RecipeCard from "../../components/recipeCard";
import {
	getFavsFromCookie,
	getNotesFromCookie,
	getRatingsFromCookie,
	getUserFromCookie,
	editUserCookie
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

import * as firebase from "firebase";
import "firebase/firestore";
import initFirebase from "../../utils/auth/initFirebase";
initFirebase();
var db = firebase.firestore();

const fetcher = async (...args) => {
	const res = await fetch(...args);

	return res.json();
};

const useStyles = makeStyles((theme) => ({
	gridContainerMain: {
		// paddingLeft: "calc(max(5vw,50vw - 450px))",
		// paddingRight: "calc(max(5vw,50vw - 450px))",
		justifyContent: "space-around",
	},
	viewTabLabel: { textTransform: "none" },
}));

export default function RecipeReviewCard() {
	const classes = useStyles();
	const [uploadDate, setUploadDate] = React.useState(Date.now());
	const { user, upload } = useUser();
	const { data: recipes } = useSWR(`/api/recipes/getAllRecipes`, fetcher);
	const { data: recipesDic } = useSWR(`/api/recipes/getAllRecipesDic`, fetcher);
	const { data: programsDic } = useSWR(`/api/programs/getAllProgramsDic`, fetcher);
	let favRecipes = getFavsFromCookie() || {};
	const recipeNotes = getNotesFromCookie() || {};
	const recipeRatings = getRatingsFromCookie() || {};
	//const { data: userData } = useSWR(`/api/favoriteRecipes/${favoriteRecipe}`, fetcher);
	const [value, setValue] = React.useState(0);
	//	const [favs, setFavs] = React.useState(value == 1);
	const [dummy, setDummy] = React.useState(true);
//	const [prevPrograms, setPrevPrograms] = React.useState([]);

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

	if (!recipes || !recipesDic || !programsDic || !user || !favRecipes) {
		return "Loading recipes...";
	}

	const recipesUser = [];
	const displayedRecipes = {};

	// useEffect(() => {
	// 	const getPrevPrograms = async () => await db.collection("users").doc(user.id).get().get("prevPrograms");
	// 	setPrevPrograms(getPrevPrograms())
	// }, [prevPrograms])


	if (user.program != "") {
		const endDate = programsDic[user.program]?.programEndDate
		if(endDate && endDate <= Date.now()) {
			const getUserData = async () => {
				const data = await db.collection("users").doc(user.id).get();
				let prevPrograms = data.get("prevPrograms")
				if (!prevPrograms || _.isEqual(prevPrograms, [])) {
					prevPrograms = [user.program]
				} else if(!prevPrograms.includes(user.program)) {
					prevPrograms.push(user.program)
				}
				await db
					.collection("users")
					.doc(user.id)
					.update({ prevPrograms: prevPrograms, program: "" })
				editUserCookie({ prevPrograms: prevPrograms, program: "" })
			}
			getUserData();
		}
		
		const keysList = programsDic[user.program]?.programRecipes ? Object.keys(programsDic[user.program]?.programRecipes) : [];
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
					<Grid container xs={12} className={classes.gridContainerMain}>
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
			) : !_.isEqual(recipesUser, []) || !_.isEqual(user?.prevPrograms, []) ? (
				<Grid container className={classes.gridContainerMain}>
					{recipesUser.map((obj, idx) => {
						if (!obj.nameOfDish || !obj.id) { return; }
						//if (!favs || obj.id in favRecipes) {
						displayedRecipes[obj.id] = "";
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
					{ user?.prevPrograms && (
						<div>
							{/* <Typography>Ended Programs</Typography> */}
							{user.prevPrograms.map((program, _) => {
								let recipeIDs = Object.keys(programsDic[program]?.programRecipes)
								return (
									<div>
										{recipeIDs.map((id, _) => {
											let obj = recipesDic[id];
											if (!obj.nameOfDish || !obj.id) { return; }
											//if (!favs || obj.id in favRecipes) {
											if (obj.id in displayedRecipes) {
												console.log("null")
												return;
											} else {
												displayedRecipes[obj.id] = "";
												console.log(obj)
												return (
													<Grid item container xs={12} md={12} justify="center">
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
											}
										})}
									</div>
								)
							})}
						</div>	
					)}
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
