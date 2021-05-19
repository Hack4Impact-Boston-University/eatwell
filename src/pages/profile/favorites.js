import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Navbar from "../../components/Navbar";
import styles from "../../styles/Home.module.css";
import _ from "underscore";
import firebase from "firebase";
import { useRouter } from "next/router";
import RecipeCard from "../../components/recipeCard";
import SkillCard from "../../components/skillCard";
import TipCard from "../../components/tipCard";
import { Grid } from "@material-ui/core";

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`wrapped-tabpanel-${index}`}
			aria-labelledby={`wrapped-tab-${index}`}
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
		id: `wrapped-tab-${index}`,
		"aria-controls": `wrapped-tabpanel-${index}`,
	};
}

// fetcher for useSWR
const fetcher = async (...args) => {
	const res = await fetch(...args);

	return res.json();
};

const useStyles = makeStyles((theme) => ({
	gridContainerMain: {
		paddingLeft: "calc(max(5vw,50vw - 450px))",
		paddingRight: "calc(max(5vw,50vw - 450px))",
	},
	viewTabLabel: { textTransform: "none" },
}));

export default function UserFavorites() {
	// get all the recipes
	const router = useRouter();

	// css classes for mui
	const classes = useStyles();

	// state for MUI tab panels
	const [value, setValue] = React.useState("one");
	const [userRecipes, setUserRecipes] = React.useState([]);
	const [allRecipes, setAllRecipes] = React.useState({});
	const [userSkills, setUserSkills] = React.useState([]);
	const [allSkills, setAllSkills] = React.useState({});
	const [userTips, setUserTips] = React.useState([]);
	const [allTips, setAllTips] = React.useState({});

	// this useEffect will load the user's favorites
	useEffect(() => {
		firebase.auth().onAuthStateChanged(function (user) {
			if (user) {
				// User is signed in.

				// get all the user's favorites
				firebase
					.firestore()
					.collection("users")
					.doc(user.uid)
					.get()
					.then((querySnapshot) => {
						let data = querySnapshot.data();
						// set the user's favorite recipes
						setUserRecipes(data.favoriteRecipes);
						setUserSkills(data.favoriteSkills);
						setUserTips(data.favoriteTips);
					})
					.catch((error) => {
						console.log(error);
					});

				// get all the favorite recipes
				firebase
					.firestore()
					.collection("recipes")
					.orderBy("dateUploaded", "desc")
					.get()
					.then((querySnapshot) => {
						let all = {};
						querySnapshot.forEach((doc) => {
							all[doc.id] = doc.data();
						});
						setAllRecipes(all);
					})
					.catch((error) => {
						console.log(error);
					});

				// get all the favorite skills
				firebase
					.firestore()
					.collection("skills")
					.orderBy("dateUploaded", "desc")
					.get()
					.then((querySnapshot) => {
						let all = {};
						querySnapshot.forEach((doc) => {
							all[doc.id] = doc.data();
						});
						setAllSkills(all);
					})
					.catch((error) => {
						console.log(error);
					});

				// get all the favorite tips
				firebase
					.firestore()
					.collection("tips")
					.orderBy("dateUploaded", "desc")
					.get()
					.then((querySnapshot) => {
						let all = {};
						querySnapshot.forEach((doc) => {
							all[doc.id] = doc.data();
						});
						setAllTips(all);
					})
					.catch((error) => {
						console.log(error);
					});
			} else {
				// No user is signed in.
				router.push("/");
			}
		});
	}, []);

	useEffect(() => { }, [userRecipes]);
	useEffect(() => {
		console.log(userSkills);
	}, [userSkills]);
	useEffect(() => { }, [userTips]);


	// handle tab click change
	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	// loading if certain data isnt finished loading
	return (
		<div>
			{/* navbar */}
			<Navbar />

			{/* MUI Tab panel */}
			<AppBar position="static" color="default">
				<Tabs
					value={value}
					onChange={handleChange}
					indicatorColor="primary"
					textColor="primary"
					variant="fullWidth"
					aria-label="wrapped label tabs example"
				>
					<Tab value="one" label="Recipes" wrapped {...a11yProps("one")} />
					<Tab value="two" label="Skills" {...a11yProps("two")} />
					<Tab value="three" label="Tips" {...a11yProps("three")} />
				</Tabs>
			</AppBar>

			{/* Favorite Recipes Panel */}
			<TabPanel value={value} index="one">
				<Grid item container className={classes.gridContainerMain}>
					{userRecipes.map((fav, idx) => {
						if (fav in allRecipes) {
							// each returned element is a recipe card
							return (
								<Grid item container xs={12} md={6} justify="center">
									<RecipeCard
										key={fav}
										object={allRecipes[fav]}
										isFav={true}
										inFavoritesPage={true}
										// remove the favorite if we click it
										onFavClick={() => {
											const idx = userRecipes.indexOf(fav)
											setUserRecipes(userRecipes.slice(0, idx).concat(userRecipes.slice(idx + 1)))
										}}
										initNotes={[]}
										initRating={0}
									/>
								</Grid>
							);
						}
					})}
				</Grid>
			</TabPanel>

			{/* Favorite Skills Panel */}
			<TabPanel value={value} index="two">
				<Grid container className={classes.gridContainerMain}>
					{userSkills.map((fav, idx) => {
						if (fav in allSkills) {
							// each returned element is a skill card
							return (
								<Grid item container xs={12} md={6} justify="center">
									<SkillCard
										key={fav}
										object={allSkills[fav]}
										isFav={true}
										inFavoritesPage={true}
										// remove the favorite if we click it
										// onFavClick={() => {
										// 	setUserSkills(userSkills.splice(userSkills.indexOf(fav), 1))
										// }}
										onFavClick={() => {
											const idx = userSkills.indexOf(fav)
											setUserSkills(userSkills.slice(0, idx).concat(userSkills.slice(idx + 1)))
										}}
									/>
								</Grid>
							);
						}
					})}
				</Grid>
			</TabPanel>

			{/* Favorite Tips Panel */}
			<TabPanel value={value} index="three">
				<Grid item container className={classes.gridContainerMain}>
					{userTips.map((fav, idx) => {
						if (fav in allTips) {
							// each returned element is a tip card
							return (
								<Grid item container xs={12} md={6} justify="center">
									<TipCard
										key={fav}
										object={allTips[fav]}
										isFav={true}
										inFavoritesPage={true}
										// remove the favorite if we click it
										onFavClick={() => {
											const idx = userTips.indexOf(fav)
											setUserTips(userTips.slice(0, idx).concat(userTips.slice(idx + 1)))
										}}
									/>
								</Grid>
							);
						}
					})}
				</Grid>
			</TabPanel>
		</div>
	);
}
