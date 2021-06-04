import React from "react";
import { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import * as firebase from "firebase";
import { Grid } from "@material-ui/core";
import useSWR from "swr";
import { useUser } from "../../utils/auth/useUser";
import RecipeCard from "../../components/recipeCard";
import {
	getRatingsFromCookie,
	getUserFromCookie,
} from "../../utils/cookies";
import Navbar from "../../components/Navbar";
import styles from "../../styles/Home.module.css";
import _, { map } from "underscore";
import { useRouter } from "next/router";

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

	const inFav = (objID) => {
		var i;
		for (i = 0; i < favs.length; i++) {
			if (objID == favs[i]) {
				return true;
			}
		}
		return false;
	}
	
	return (
		<div className={styles.container}>
			{user.role == "admin" ? (
				!_.isEqual(recipes, []) ? (
					<Grid container className={classes.gridContainerMain}>
						{recipes.map((obj, idx) => {
							if (!obj.nameOfDish || !obj.id) { return; }
							return (
								<Grid item container xs={12} md={6} justify="center">
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
			) : !_.isEqual(recipesUser, []) ? (
				<Grid container spacing={1000} className={classes.gridContainerMain}>
					{recipesUser.map((obj, idx) => {
						if (!obj.nameOfDish || !obj.id) { return; }
						return (
							<Grid item container xs={12} md={6} justify="center">
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
			)}

			<div className={styles.nav}>
				<Navbar />
			</div>
		</div>
	);
}
