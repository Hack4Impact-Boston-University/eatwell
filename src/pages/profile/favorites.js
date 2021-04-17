import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Navbar from "../../components/Navbar";
import styles from "../../styles/Home.module.css";
import useSWR from "swr";
import { useUser } from "../../utils/auth/useUser";
import _, { map } from "underscore";
import { Grid } from "@material-ui/core";
import RecipeCard from "../../components/recipeCard";
import {
	getFavsFromCookie,
	getNotesFromCookie,
	getRatingsFromCookie,
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

const useStyles = makeStyles((theme) => ({}));

export default function TabsWrappedLabel() {
	const { user, upload } = useUser();
	const { data: recipes } = useSWR(`/api/recipes/getAllRecipes`, fetcher);
	const favRecipes = getFavsFromCookie() || {};
	const recipeNotes = getNotesFromCookie() || {};
	const recipeRatings = getRatingsFromCookie() || {};
	const classes = useStyles();
	const [value, setValue] = React.useState("one");
	const [dummy, setDummy] = React.useState(true);
	const [favs, setFavs] = React.useState(value == 1);

	// handle clicking favorites icon
	const onFavClick = () => {
		setDummy(!dummy);
		favRecipes = getFavsFromCookie() || {};
		//uploadRating(getRatingsFromCookie(), recipeRatings, recipes);
	};

	// handle tab click change
	const handleChange = (event, newValue) => {
		setValue(newValue);
		setFavs(newValue == 1);
	};

	// loading if certain data isnt finished loading
	if (!user || !recipes) return "Loading...";

	return (
		<div className={styles.nav}>
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
			<TabPanel value={value} index="one">
				{user.role == "admin" ? (
					!_.isEqual(recipes, []) ? (
						<Grid
							container
							spacing={1000}
							className={classes.gridContainerMain}
						>
							{recipes.map((obj, idx) => {
								if (!obj.nameOfDish || !obj.id) return;
								if (!favs || obj.id in favRecipes) {
									return (
										<RecipeCard
											key={obj.id}
											object={obj}
											isFav={obj.id in favRecipes}
											onFavClick={() => onFavClick()}
											initNotes={
												obj.id in recipeNotes ? recipeNotes[obj.id] : []
											}
											initRating={
												obj.id in recipeRatings ? recipeRatings[obj.id] : 0
											}
										/>
									);
								} else {
									return;
								}
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
							if (!obj.nameOfDish || !obj.id) return;
							if (!favs || obj.id in favRecipes) {
								return (
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
								);
							} else {
								return;
							}
							//<RecipeCard obj={recipesUser[4]} isFav = {favRecipes.favRec.includes(recipesUser[4].dishID)} />
						})}
					</Grid>
				) : (
					<Grid>
						<h4>No recipes to display</h4>
					</Grid>
				)}
			</TabPanel>
			<TabPanel value={value} index="two">
				Skills
			</TabPanel>
			<TabPanel value={value} index="three">
				Tips
			</TabPanel>
		</div>
	);
}
