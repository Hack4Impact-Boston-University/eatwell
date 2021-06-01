import Head from "next/head";
import React from "react";
import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import * as firebase from "firebase";
import { Grid } from "@material-ui/core";
import useSWR from "swr";
import { useUser } from "../../utils/auth/useUser";
import SkillCard from "../../components/skillCard";
import {
	getRatingsSkillsFromCookie,
	getUserFromCookie,
} from "../../utils/cookies";
import Navbar from "../../components/Navbar";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import PropTypes from "prop-types";
import styles from "../../styles/Home.module.css";
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

export default function SkillReviewCard() {
	const classes = useStyles();
	const [uploadDate, setUploadDate] = React.useState(Date.now());
	const { user, upload } = useUser();
	const { data: skillsDic } = useSWR(`/api/skills/getAllSkillsDic`, fetcher);
	const { data: programsDic } = useSWR(
		`/api/programs/getAllProgramsDic`,
		fetcher
	);
	const [skills, setSkills] = React.useState('')
	const [favSkills, setFavSkills] = React.useState([]);
	const skillRatings = getRatingsSkillsFromCookie() || {};
	const [doneRunning, setDoneRunning] = React.useState(false);
	const [value, setValue] = React.useState(0);
	const [dummy, setDummy] = React.useState(true);
	const router = useRouter();

	// this useEffect will load the user's favorite skills
	useEffect(() => {
		firebase.auth().onAuthStateChanged(async function (user) {
			if (user) {
				// get all the user's favorite skills
				await firebase
					.firestore()
					.collection("users")
					.doc(user.uid)
					.get()
					.then((querySnapshot) => {
						let data = querySnapshot.data();
						setFavSkills(data.favoriteSkills); // set the user's favorite recipes
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

	const inFav = (objID) => {
		var i;
		for (i = 0; i < favSkills.length; i++) {
			if (objID == favSkills[i]) {
				return true;
			}
		}
		return false;
	}

	if (!skills || !skillsDic || !programsDic || !user || doneRunning == false) {
		if (!skillsDic) {
			return "Loading skillsDic...";
		} if (!programsDic) {
			return "Loading programsDic...";
		} if (!user) {
			return "Loading user...";
		} if (doneRunning == false) {
			return "Loading fav skills...";
		}
		setSkills(Object.keys(skillsDic).map(function (key, i) {
			return skillsDic[key];
		}));
		if (!skills) {
			return "Loading skills...";
		}
	}

	if (getUserFromCookie() && !("firstname" in getUserFromCookie())) {
		router.push("/profile/makeProfile");
		return <div></div>;
	}

	return (
		<div className={styles.container}>
			{/* {user.role == "admin" ? ( */}
			{!_.isEqual(skills, []) ? (
				<Grid container className={classes.gridContainerMain}>
					{skills.map((obj, idx) => {
						if (!obj?.skillName || !obj?.skillID) {
							return;
						}
						return (
							<Grid item container xs={12} md={6} justify="center">
								<SkillCard
									key={obj.skillID}
									object={obj}
									inFavoritesPage={false}
									isFav={inFav(obj.skillID)}
								/>
							</Grid>
						);
					})}
				</Grid>
			) : (
				<Grid>
					<h4>No skills to display</h4>
				</Grid>
			)}

			<div className={styles.nav}>
				<Navbar />
			</div>
		</div>
	);
}
