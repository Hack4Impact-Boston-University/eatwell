import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import styles from "../styles/Home.module.css";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Navbar from "../components/Navbar";
import _ from "underscore";
import firebase from "firebase";
import { useRouter } from "next/router";
import RecipeCard from "../components/recipeCard";
import SkillCard from "../components/skillCard";
import TipCard from "../components/tipCard";
import { Grid } from "@material-ui/core";
import useSWR from "swr";
import { useUser } from "../utils/auth/useUser";
import {
	getRatingsFromCookie,
	getUserFromCookie,
} from "../utils/cookies";

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
				<div p={3}>
					<Typography>{children}</Typography>
				</div>
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
		// paddingLeft: "calc(max(5vw,50vw - 450px))",
		// paddingRight: "calc(max(5vw,50vw - 450px))",
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
	const { data: programsDic } = useSWR(`/api/programs/getAllProgramsDic`, fetcher);

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

	const getTimeString = (timestamp) => {
		let date = new Date(timestamp);
		let month = date.getMonth() + 1;
		let day = date.getDate();
		let hour = date.getHours();
		let min = date.getMinutes();
		let sec = date.getSeconds();
		month = (month < 10 ? "0" : "") + month;
		day = (day < 10 ? "0" : "") + day;
		hour = (hour < 10 ? "0" : "") + hour;
		min = (min < 10 ? "0" : "") + min;
		sec = (sec < 10 ? "0" : "") + sec;
		let str =
			hour +
			":" +
			min +
			":" +
			sec +
			" on " +
			month +
			"/" +
			day +
			"/" +
			date.getFullYear();
		return str;
	}

	if (!recipesDic || !recipes || !skillsDic || !skills || !tipsDic || !tips || !user || doneRunning == false || !programsDic) {
		if (!recipesDic) {
			return "Loading recipesDic...";
		} if (!skillsDic) {
			return "Loading skillsDic...";
		} if (!tipsDic) {
			return "Loading tipsDic...";
		} if (!user) {
			return "Loading user...";
		} if (doneRunning == false) {
			return "Loading fav and notes...";
		} if (!programsDic) {
			return "Loading programsDic...";
		}
		setRecipes(Object.values(recipesDic).filter(recipes => favRecipes?.indexOf(recipes["id"]) !== -1));
		setSkills(Object.values(skillsDic).filter(skills => favSkills?.indexOf(skills["skillID"]) !== -1));
		setTips(Object.values(tipsDic).filter(tips => favTips?.indexOf(tips["tipID"]) !== -1));
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
			{/* Favorite Recipes Panel */}
			<TabPanel value={value} index="one">
				<div className={styles.container3}>
				<Grid item container className={classes.gridContainerMain}>
					{recipes.map((fav, idx) => {
						// each returned element is a recipe card
						return (
							<Grid item container xs={12} md={6} justify="center">
								{user.role == "admin" ? 
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
									dateRecipes={getTimeString(fav.dateUploaded)}
								/> :
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
									dateRecipes={programsDic[user.program]?.programRecipes[fav.id]}
								/>
							}
							</Grid>
						);
					})}
				</Grid>
				</div>
			</TabPanel>

			{/* Favorite Skills Panel */}
			<TabPanel value={value} index="two">
				<div className={styles.container3}>
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
				</div>
			</TabPanel>

			{/* Favorite Tips Panel */}
			<TabPanel value={value} index="three">
				<div className={styles.container3}>
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
				</div>
			</TabPanel>

			<div className={styles.nav}>
				<Navbar currentPage={5}/>
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
			</div>
		</div>
	);
}
