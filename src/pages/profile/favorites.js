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
import useSWR from "swr";
import _ from "underscore";
import firebase from "firebase";
import { useRouter } from "next/router";

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

export default function UserFavorites() {
	// get all the recipes
	// const { userRecipes } = useSWR(`/api/recipes/getUsersFavorites`, fetcher);
	const router = useRouter();
	// state for MUI tab panels
	const [value, setValue] = React.useState("one");
	const [userRecipes, setUserRecipes] = React.useState([]);

	// this useEffect will load the user's favorites
	useEffect(() => {
		firebase.auth().onAuthStateChanged(function (user) {
			if (user) {
				// User is signed in.
				firebase
					.firestore()
					.collection("users")
					.doc(user.uid)
					.get()
					.then((querySnapshot) => {
						let data = querySnapshot.data();
						// set the user's favorite recipes
						setUserRecipes(data.favoriteRecipes);
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

	// handle tab click change
	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	// loading if certain data isnt finished loading
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

			{/* Favorite Recipes Panel */}
			<TabPanel value={value} index="one">
				Recipes
				{console.log(userRecipes)}
			</TabPanel>

			{/* Favorite Skills Panel */}
			<TabPanel value={value} index="two">
				Skills
			</TabPanel>

			{/* Favorite Tips Panel */}
			<TabPanel value={value} index="three">
				Tips
			</TabPanel>
		</div>
	);
}
