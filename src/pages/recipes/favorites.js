import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Navbar from "../../components/Navbar";
import _ from "underscore";
import firebase from "firebase";
import { useRouter } from "next/router";
import RecipeCard from "../../components/recipeCard";
import SkillCard from "../../components/skillCard";
import TipCard from "../../components/tipCard";
import { Grid } from "@material-ui/core";
import useSWR from "swr";
import { useUser } from "../../utils/auth/useUser";
import {
	getRatingsFromCookie,
	getUserFromCookie,
} from "../../utils/cookies";

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
	const { user } = useUser();
	const [value, setValue] = React.useState("one");
	const [recipes, setRecipes] = React.useState(null)
	const { data: recipesDic } = useSWR(`/api/recipes/getAllRecipesDic`, fetcher);
	const [favRecipes, setFavRecipes] = React.useState([]);
	const [notes, setNotes] = React.useState({});
	const recipeRatings = getRatingsFromCookie() || {};
	const [skills, setSkills] = React.useState(null)
	const { data: skillsDic } = useSWR(`/api/skills/getAllSkillsDic`, fetcher);
	const [favSkills, setFavSkills] = React.useState([]);
	const [tips, setTips] = React.useState(null)
	const { data: tipsDic } = useSWR(`/api/tips/getAllTipsDic`, fetcher);
	const [favTips, setFavTips] = React.useState([]);
	const [doneRunning, setDoneRunning] = React.useState(false);

	// this useEffect will load the user's favorites
	useEffect(() => {
		firebase.auth().onAuthStateChanged(async function (user) {
			if (user) { // user signed in
				// get all the user's favorites
				await firebase
					.firestore()
					.collection("users")
					.doc(user.uid)
					.get()
					.then((querySnapshot) => {
						let data = querySnapshot.data();
						// set the user's favorite recipes
						setFavRecipes(data.favoriteRecipes);
						setFavSkills(data.favoriteSkills);
						setFavTips(data.favoriteTips);
						setNotes(data.notes); // set the user's recipe notes
					})
					.catch((error) => {
						console.log(error);
					});
				setDoneRunning(true)
			} else { // No user is signed in.
				router.push("/");
			}
		});
	}, []);

	// handle tab click change
	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	if (!recipesDic || !recipes || !skillsDic || !skills || !tipsDic || !tips || !user || doneRunning == false) {
		if (!recipesDic) {
			return "Loading recipesDic...";
		} if (!skillsDic) {
			return "Loading recipesDic...";
		} if (!tipsDic) {
			return "Loading recipesDic...";
		} if (!user) {
			return "Loading user...";
		} if (doneRunning == false) {
			return "Loading fav and notes...";
		}

		setRecipes(Object.values(recipesDic).filter(recipes => favRecipes.indexOf(recipes["id"]) !== -1));
		setSkills(Object.values(skillsDic).filter(skills => favSkills.indexOf(skills["skillID"]) !== -1));
		setTips(Object.values(tipsDic).filter(tips => favTips.indexOf(tips["tipID"]) !== -1));
		if (!recipes) {
			return "Loading recipes...";
		} if (!skills) {
			return "Loading skills...";
		} if (!tips) {
			return "Loading tips...";
		}
	}

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
					{recipes.map((fav, idx) => {
						// each returned element is a recipe card
						return (
							<Grid item container xs={12} md={6} justify="center">
								<RecipeCard
									key={fav.id}
									object={fav}
									isFav={true}
									onFavClick={() => {
										const idx = recipes.indexOf(fav)
										setRecipes(recipes.slice(0, idx).concat(recipes.slice(idx + 1)))
									}}
									inFavoritesPage={true}
									initNotes={notes}
									initRating={
										fav.id in recipeRatings ? recipeRatings[fav.id] : 0
									}
								/>
							</Grid>
						);
					})}
				</Grid>
			</TabPanel>

			{/* Favorite Skills Panel */}
			<TabPanel value={value} index="two">
				<Grid container className={classes.gridContainerMain}>
					{skills.map((fav, idx) => {
						// each returned element is a skill card
						return (
							<Grid item container xs={12} md={6} justify="center">
								<SkillCard
									key={fav.skillID}
									object={fav}
									isFav={true}
									onFavClick={() => {
										const idx = skills.indexOf(fav)
										setSkills(skills.slice(0, idx).concat(skills.slice(idx + 1)))
									}}
									inFavoritesPage={true}
								/>
							</Grid>
						);
					})}
				</Grid>
			</TabPanel>

			{/* Favorite Tips Panel */}
			<TabPanel value={value} index="three">
				<Grid item container className={classes.gridContainerMain}>
					{tips.map((fav, idx) => {
						// each returned element is a tip card
						return (
							<Grid item container xs={12} md={6} justify="center">
								<TipCard
									key={fav.tipID}
									object={fav}
									isFav={true}
									onFavClick={() => {
										const idx = tips.indexOf(fav)
										setTips(tips.slice(0, idx).concat(tips.slice(idx + 1)))
									}}
									inFavoritesPage={true}
								/>
							</Grid>
						);
					})}
				</Grid>
			</TabPanel>
		</div>
	);
}
