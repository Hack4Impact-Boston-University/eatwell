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
		justifyContent: "center",
	},
	viewTabLabel: { textTransform: "none" },
}));

export default function RecipeReviewCardClient({home}) {
	const classes = useStyles();
	const [uploadDate, setUploadDate] = React.useState(Date.now());
	const { user, upload } = useUser();
	const [recipes, setRecipes] = React.useState("")
	const { data: recipesDic } = useSWR(`/api/recipes/getAllRecipesDic`, fetcher);
	const { data: programsDic } = useSWR(`/api/programs/getAllProgramsDic`, fetcher);
    const [programs, setPrograms] = React.useState(null);
	const [favs, setFavs] = React.useState([]);
	const [notes, setNotes] = React.useState({});
	const [ratings, setRatings] = React.useState({});
	const [doneRunning, setDoneRunning] = React.useState(false);
    const masterRecipesUser = [];
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
                        setPrograms(data.program); // set the client's programs
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

    var recipesUser = [];
	const displayedRecipes = {};
    if (!_.isEqual(programs,null) && !_.isEqual(programsDic,undefined) && !_.isEqual(recipesDic,undefined)) {
        programs.forEach(program => {
            recipesUser = []
            if (program != "") {
                const endDate = programsDic[program]?.programEndDate
                if(endDate && endDate <= Date.now()) {
                    const getUserData = async () => {
                        const data = await db.collection("users").doc(user.id).get();
                        let prevPrograms = data.get("prevPrograms")
                        if (!prevPrograms || _.isEqual(prevPrograms, [])) {
                            prevPrograms = [program]
                        } else if(!prevPrograms.includes(program)) {
                            prevPrograms.push(program)
                        }
                        await db
                            .collection("users")
                            .doc(user.id)
                            .update({ prevPrograms: prevPrograms, program: "" })
                        editUserCookie({ prevPrograms: prevPrograms, program: "" })
                    }
                    getUserData();
                }
                
                const keysList = programsDic[program]?.programRecipes ? Object.keys(programsDic[program]?.programRecipes) : [];
                if (!_.isEqual(program, "")) {
                    if (
                        programsDic[program]?.programRecipes != null ||
                        programsDic[program]?.programRecipes != []
                    ) {
                        var i;
                        for (i = 0; i < keysList.length; i++) {
                            var d = Date.parse(
                                programsDic[program]?.programRecipes[keysList[i]] +
                                "T00:00:00.0000"
                            );
                            if (d < uploadDate) {
                                recipesUser.push(recipesDic[keysList[i]]);
                            }
                        }
                        masterRecipesUser.push(recipesUser)
                        // setMasterRecipesUser(masterRecipesUser)
                    }
                }
            }
        })
    }

	if (!recipes || !recipesDic || !programsDic || !user || (doneRunning == false && home == undefined) || !programs || (programs && programs.length > masterRecipesUser.length)) {
		if (!recipesDic) {
			return "Loading recipesDic...";
		} if (!programsDic) {
			return "Loading programsDic...";
		} if (!user) {
			return "Loading user...";
		} if (!programs) {
			return "Loading programs...";
		} if (doneRunning == false) {
			return "Loading fav, notes, ratings...";
		} if (programs.length > masterRecipesUser.length) {
			return "Loading masterRecipesUser...";
		}
		setRecipes(Object.keys(recipesDic).map(function (key) {
			return recipesDic[key];
		}));
		if (!recipes) {
			return "Loading recipes...";
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
            {masterRecipesUser.map((recipesUser,index) => {
                return (
                !_.isEqual(recipesUser, []) || !_.isEqual(user?.prevPrograms, []) ? (
                    <Grid container className={classes.gridContainerMain}>
                        <div style={{display: 'flex', alignItems:'center'}}>
                            <h1> Below are the recipes in the {programsDic[programs[index]]?.programName} program </h1>
                        </div>
                        <Grid item container xs={12} sm={11} lg={8}>
                            {recipesUser.sort((a, b) => programsDic[programs[index]]?.programRecipes[a.id] < programsDic[programs[index]]?.programRecipes[b.id] ? 1:-1).map((obj, idx) => {
                                if (!obj?.nameOfDish || !obj?.id) { return; }
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
                                            dateRecipes={programsDic[programs[index]]?.programRecipes[obj.id]}
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
                                                            if (!obj?.nameOfDish || !obj?.id) { return; }
                                                            //if (!favs || obj.id in favRecipes) {
                                                            if (obj.id in displayedRecipes) {
                                                                return;
                                                            } else {
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
                                                                            dateRecipes={programsDic[programs[index]]?.programRecipes[obj.id]}
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
                )
            )})
            }

			<div className={styles.nav}>
				<Navbar currentPage={2}/>
			</div>
		</div>
	);
}
