import Head from "next/head";
import React from "react";
import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import * as firebase from "firebase";
import { Grid } from "@material-ui/core";
import useSWR from "swr";
import { useUser } from "../../utils/auth/useUser";
import TipCard from "../../components/tipCard";
import {
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

export default function TipReviewCard() {
	const classes = useStyles();
	const [uploadDate, setUploadDate] = React.useState(Date.now());
	const { user, upload } = useUser();
	const { data: tipsDic } = useSWR(`/api/tips/getAllTipsDic`, fetcher);
	const { data: programsDic } = useSWR(
		`/api/programs/getAllProgramsDic`,
		fetcher
	);
	const [tips, setTips] = React.useState('')
	const [favTips, setFavTips] = React.useState([]);
	const [doneRunning, setDoneRunning] = React.useState(false);
	const [value, setValue] = React.useState(0);
	const [dummy, setDummy] = React.useState(true);
	const router = useRouter();

	// this useEffect will load the user's favorite tips
	useEffect(() => {
		firebase.auth().onAuthStateChanged(async function (user) {
			if (user) {
				// get all the user's favorite tips
				await firebase
					.firestore()
					.collection("users")
					.doc(user.uid)
					.get()
					.then((querySnapshot) => {
						let data = querySnapshot.data();
						setFavTips(data.favoriteTips); // set the user's favorite recipes
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
		for (i = 0; i < favTips.length; i++) {
			if (objID == favTips[i]) {
				return true;
			}
		}
		return false;
	}

	if (!tips || !tipsDic || !programsDic || !user || doneRunning == false) {
		if (!tipsDic) {
			return "Loading tipsDic...";
		} if (!programsDic) {
			return "Loading programsDic...";
		} if (!user) {
			return "Loading user...";
		} if (doneRunning == false) {
			return "Loading fav tips...";
		}
		setTips(Object.keys(tipsDic).map(function (key, i) {
			return tipsDic[key];
		}));
		if (!tips) {
			return "Loading tips...";
		}
	}

	if (getUserFromCookie() && !("firstname" in getUserFromCookie())) {
		router.push("/profile/makeProfile");
		return <div></div>;
	}

	return (
		<div className={styles.container}>
			{/* {user.role == "admin" ? ( */}
			{!_.isEqual(tips, []) ? (
				<Grid container className={classes.gridContainerMain}>
					{tips.map((obj, idx) => {
						if (!obj?.tipName || !obj?.tipID) {
							return;
						}
						return (
							<Grid item container xs={12} md={6} justify="center">
								<TipCard
									key={obj.tipID}
									object={obj}
									inFavoritesPage={false}
									isFav={inFav(obj.tipID)}
								/>
							</Grid>
						);
					})}
				</Grid>
			) : (
				<Grid>
					<h4>No tips to display</h4>
				</Grid>
			)}

			<div className={styles.nav}>
				<Navbar currentPage={4}/>
			</div>
		</div>
	);
}
