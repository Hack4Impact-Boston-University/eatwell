import Head from "next/head";
import React from "react";
import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import { Grid } from "@material-ui/core";
import useSWR from "swr";
import { useUser } from "../../utils/auth/useUser";
import TipCard from "../../components/tipCard";
import {
	getFavsTipsFromCookie,
	getNotesTipsFromCookie,
	getRatingsTipsFromCookie,
	getUserFromCookie,
} from "../../utils/cookies";
import Navbar from "../../components/Navbar";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import PropTypes from "prop-types";
import styles from "../../styles/Home.module.css";
import { uploadTipsRating } from "../../utils/tips.js";
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
	const { data: tips } = useSWR(`/api/tips/getAllTips`, fetcher);
	const { data: tipsDic } = useSWR(`/api/tips/getAllTipsDic`, fetcher);
	const { data: programsDic } = useSWR(
		`/api/programs/getAllProgramsDic`,
		fetcher
	);
	let favTips = getFavsTipsFromCookie() || {};
	const tipNotes = getNotesTipsFromCookie() || {};
	const tipRatings = getRatingsTipsFromCookie() || {};
	const [value, setValue] = React.useState(0);
	const [dummy, setDummy] = React.useState(true);
	const router = useRouter();

	useEffect(() => {
		window.addEventListener("beforeunload", () => {
			if (!_.isEqual(getFavsTipsFromCookie(), undefined)) {
				upload({
					notes: getNotesTipsFromCookie(),
					ratings: getRatingsTipsFromCookie(),
				});
			}
		});
	});

	const onFavClick = () => {
		setDummy(!dummy);
		favTips = getFavsTipsFromCookie() || {};
	};

	if (!tips || !tipsDic || !programsDic || !user || !favTips) {
		return "Loading tips...";
	}

	if (getUserFromCookie() && !("firstname" in getUserFromCookie())) {
		router.push("/profile/makeProfile");
		return <div></div>;
	}

	return (
		<div className={styles.container}>
			{!_.isEqual(tips, []) ? (
				<Grid container className={classes.gridContainerMain}>
					{tips.map((obj, idx) => {
						if (!obj.tipName || !obj.tipID) {
							return;
						}
						return (
							<Grid item container xs={12} md={6} justify="center">
								<TipCard
									key={idx}
									object={obj}
									initNotes={obj.tipID in tipNotes ? tipNotes[obj.tipID] : []}
									initRating={obj.id in tipRatings ? tipRatings[obj.id] : 0}
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
				<Navbar />
			</div>
		</div>
	);
}
