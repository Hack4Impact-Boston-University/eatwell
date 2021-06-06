import React from "react";
import { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography } from "@material-ui/core";
import useSWR from "swr";
import { useUser } from "../../utils/auth/useUser";
import RecipeCard from "../../components/recipeCard";
import {
	getRatingsFromCookie,
	getUserFromCookie,
	editUserCookie
} from "../../utils/cookies";
import Navbar from "../../components/Navbar";
import styles from "../../styles/Home.module.css";
import _, { map } from "underscore";
import { useRouter } from "next/router";

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
		justifyContent: "center",
	},
	viewTabLabel: { textTransform: "none" },
}));

export default function RecipeReviewCard({
	home
}) {
	const classes = useStyles();
	const [uploadDate, setUploadDate] = React.useState(Date.now());
	const { user, upload } = useUser();
	const [recipes, setRecipes] = React.useState("")
	const { data: recipesDic } = useSWR(`/api/recipes/getAllRecipesDic`, fetcher);
	const { data: programsDic } = useSWR(`/api/programs/getAllProgramsDic`, fetcher);
	// const recipeRatings = getRatingsFromCookie() || {};
	const [favs, setFavs] = React.useState([]);
	const [notes, setNotes] = React.useState({});
	const [ratings, setRatings] = React.useState({});
	const [doneRunning, setDoneRunning] = React.useState(false);
	const router = useRouter();

	// this useEffect will load the user's favorite recipes
	useEffect(() => {
		firebase.auth().onAuthStateChanged(async function (user) {
			if (user) {
				// get all the user's favorite recipes
				await firebase
					.firestore()
					.collection("users")
					.doc(user.uid)
					.get()
					.then((querySnapshot) => {
						let data = querySnapshot.data();
						setFavs(data.favoriteRecipes); // set the user's favorite recipes
						setNotes(data.notes); // set the user's recipe notes
						setRatings(data.ratings); // set the user's recipe ratings
					})
					.catch((error) => {
						console.log(error);
					});
				setDoneRunning(true)
			} else {
				// No user is signed in.
				router.push("/");
			}
		});
	}, []);

	const userData = getUserFromCookie();
	if (!userData || "code" in userData) {
		// router.push("/");
	} else if (!("firstname" in userData)) {
		router.push("/profile/makeProfile");
	}

	if (!recipes || !recipesDic || !programsDic || !user || (doneRunning == false && home == false)) {
		if (!recipesDic) {
			return "Loading recipesDic...";
		} if (!programsDic) {
			return "Loading programsDic...";
		} if (!user) {
			return "Loading user...";
		} if (doneRunning == false) {
			return "Loading fav, notes, ratings...";
		}
		setRecipes(Object.keys(recipesDic).map(function (key) {
			return recipesDic[key];
		}));
		if (!recipes) {
			return "Loading recipes...";
		}
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
						var d = Date.parse(
							programsDic[user.program].programRecipes[keysList[i]] +
							"T00:00:00.0000"
						);
						if (d < uploadDate) {
							console.log(recipesUser)
							recipesUser.push(recipesDic[keysList[i]]);
						}
					}
				}
			}
		}
	}

	const inFav = (objID) => {
		var i;
		for (i = 0; i < favs.length; i++) {
			if (objID == favs[i]) {
				return true;
			}
		}
		return false;
	}
	
	console.log(recipesDic)


	return (
		<div className={styles.container}>
			{user.role == "admin" ? (
				!_.isEqual(recipes, []) ? (
					<Grid container xs={12} sm={11} lg={8} className={classes.gridContainerMain}>
						{recipes.map((obj, idx) => {
							if (!obj.nameOfDish || !obj.id) { return; }
							return (
								<Grid item container xs={12} sm={6} justify="center">
									<RecipeCard
										key={obj.id}
										object={obj}
										isFav={inFav(obj.id)}
										inFavoritesPage={false}
										initNotes={notes}
										initRatings={ratings}
										initRating={
											obj.id in ratings ? ratings[obj.id] : 0
										}
										isHome={home}
									/>
								</Grid>
							);
						})}
					</Grid>
				) : (
					<Grid>
						<h4>No recipes to display</h4>
					</Grid>
				)
			) : !_.isEqual(recipesUser, []) || !_.isEqual(user?.prevPrograms, []) ? (
				<Grid container className={classes.gridContainerMain}>
					<Grid item container xs={12} sm={11} lg={8}>
						{recipesUser.map((obj, idx) => {
							if (!obj.nameOfDish || !obj.id) { return; }
							//if (!favs || obj.id in favRecipes) {
							displayedRecipes[obj.id] = "";
							return (
								<Grid item container xs={12} sm={6} justify="center">
									<RecipeCard
										key={obj.id}
										object={obj}
										isFav={inFav(obj.id)}
										inFavoritesPage={false}
										initNotes={notes}
										initRatings={ratings}
										initRating={
											obj.id in ratings ? ratings[obj.id] : 0
										}
										isHome={home}
									/>
								</Grid>
							);
						})}
					</Grid>
					{user?.prevPrograms && 
						<Grid item container direction="column" alignItems="center">
							<Grid item ><Typography>Ended Programs</Typography></Grid>
							<Grid item container justify="center">
								{user.prevPrograms.map((program, _) => {
										let recipeIDs = Object.keys(programsDic[program]?.programRecipes)
										return (
											<Grid item container xs={12} sm={11} lg={8} direction="column">
												<Grid item><Typography>{programsDic[program]?.programName}</Typography></Grid>
												<Grid item container direction="row">
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
																<Grid item container xs={12} sm={6} justify="center">
																	<RecipeCard
																		key={obj.id}
																		object={obj}
																		isFav={inFav(obj.id)}
																		inFavoritesPage={false}
																		initNotes={notes}
																		initRatings={ratings}
																		initRating={
																			obj.id in ratings ? ratings[obj.id] : 0
																		}
																		isHome={home}
																	/>
																</Grid>
															);
														}
													})}`
												</Grid>
											</Grid>
										)
									}
								)}
							</Grid>
						</Grid>
					}
				</Grid>
			) : (
				<Grid>
					<h4>No recipes to display</h4>
				</Grid>
			)}

			<div className={styles.nav}>
				<Navbar />
			</div>
		</div>
	);
}
