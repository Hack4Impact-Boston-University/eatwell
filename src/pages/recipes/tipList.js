import Head from "next/head";
import React from "react";
import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import { Grid } from "@material-ui/core";
import useSWR from "swr";
import { useUser } from "../../utils/auth/useUser";
import TipCard from "../../components/tipCard";
import {
	getFavsFromCookie,
	getNotesFromCookie,
	getRatingsFromCookie,
	getUserFromCookie,
} from "../../utils/cookies";
import Navbar from "../../components/Navbar";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import PropTypes from "prop-types";
import styles from "../../styles/Home.module.css";
import { uploadRating } from "../../utils/tips.js";
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

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`full-width-tabpanel-${index}`}
			aria-labelledby={`full-width-tab-${index}`}
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
		id: `full-width-tab-${index}`,
		"aria-controls": `full-width-tabpanel-${index}`,
	};
}

export default function TipReviewCard() {
	const classes = useStyles();
	const [uploadDate, setUploadDate] = React.useState(Date.now())
	const { user, upload } = useUser();
	const { data: tips } = useSWR(`/api/recipes/getAllTips`, fetcher);
	const { data: tipsDic } = useSWR(`/api/recipes/getAllTipsDic`, fetcher);
	const { data: programsDic } = useSWR(`/api/programs/getAllProgramsDic`, fetcher);
	let favTips = getFavsFromCookie() || {};
	const tipNotes = getNotesFromCookie() || {};
	const tipRatings = getRatingsFromCookie() || {};
	//const { data: userData } = useSWR(`/api/favoriteTips/${favoriteTip}`, fetcher);
	const [value, setValue] = React.useState(0);
	const [favs, setFavs] = React.useState(value == 1);
	const [dummy, setDummy] = React.useState(true);

	const router = useRouter();

	const handleChange = (event, newValue) => {
		setValue(newValue);
		setFavs(newValue == 1);
	};

	useEffect(() => {
		window.addEventListener("beforeunload", () => {
			if (!_.isEqual(getFavsFromCookie(), undefined)) {
				upload({
					favoriteTips: Object.keys(getFavsFromCookie()),
					notes: getNotesFromCookie(),
					ratings: getRatingsFromCookie(),
				});
				//uploadRating(getRatingsFromCookie(), tipRatings, tips);
			}
		});
	});

	const onFavClick = () => {
		setDummy(!dummy);
		favTips = getFavsFromCookie() || {};
		//uploadRating(getRatingsFromCookie(), tipRatings, tips);
	};

	if (!tips || !tipsDic || !programsDic || !user || !favTips) {
		return "Loading tips...";
	}

	const tipsUser = [];
	// if (!user.program == "") {
	// 	const keysList = Object.keys(programsDic[user.program]?.programTips)
	// 	if (_.isEqual(user?.role, "user")) {
	// 		if (!_.isEqual(user.program, "")) {
	// 			if (programsDic[user.program]?.programTips != null || programsDic[user.program]?.programTips != []) {
	// 				var i;
	// 				for (i = 0; i < keysList.length; i++) {
	// 					console.log(programsDic[user.program].programTips[keysList[i]])
	// 					var d = Date.parse(programsDic[user.program].programTips[keysList[i]]+"T00:00:00.0000");
	// 					if (d < uploadDate) {
	// 						tipsUser.push(
	// 							tipsDic[keysList[i]]
	// 						);
	// 					}
	// 				}
	// 			}
	// 		}
	// 	}
	// }	


	if (getUserFromCookie() && !("firstname" in getUserFromCookie())) {
		router.push("/profile/makeProfile");
		return <div></div>;
	}

	return (
		<div className={styles.container2}>
			{user.role == "admin" ? (
				!_.isEqual(tips, []) ? (
					<Grid container spacing={1000} className={classes.gridContainerMain}>
						{tips.map((obj, idx) => {
							if (!obj.nameOfDish || !obj.id) return;
							if (!favs || obj.id in favTips) {
								return (
									<TipCard
										key={obj.id}
										object={obj}
										isFav={obj.id in favTips}
										onFavClick={() => onFavClick()}
										initNotes={obj.id in tipNotes ? tipNotes[obj.id] : []}
										initRating={
											obj.id in tipRatings ? tipRatings[obj.id] : 0
										}
									/>
								);
							} else {
								return;
							}
							//<TipCard obj={tipsUser[4]} isFav = {favTips.favRec.includes(tipsUser[4].dishID)} />
						})}
					</Grid>
				) : (
					<Grid>
						<h4>No tips to display</h4>
					</Grid>
				)
			) : !_.isEqual(tipsUser, []) ? (
				<Grid container spacing={1000} className={classes.gridContainerMain}>
					{/* {tipsUser.map((obj, idx) => {
						if (!obj.nameOfDish || !obj.id) return;
						if (!favs || obj.id in favTips) {
							return (
								<TipCard
									key={obj.id}
									object={obj}
									isFav={obj.id in favTips}
									onFavClick={() => onFavClick()}
									initNotes={obj.id in tipNotes ? tipNotes[obj.id] : []}
									initRating={
										obj.id in tipRatings ? tipRatings[obj.id] : 0
									}
								/>
							);
						} else {
							return;
						}
					})} */}
				</Grid>
			) : (
				<Grid>
					<h4>No tips to display</h4>
				</Grid>
			)}

			<div className={styles.nav}>
				<Navbar />

				<AppBar position="static" color="default">
					<Tabs
						value={value}
						onChange={handleChange}
						indicatorColor="primary"
						textColor="primary"
						variant="fullWidth"
						aria-label="full width tabs example"
					>
						<Tab
							label="All Tips"
							{...a11yProps(0)}
							className={classes.viewTabLabel}
						/>
						<Tab
							label="Favorites Only"
							{...a11yProps(1)}
							className={classes.viewTabLabel}
						/>
					</Tabs>
				</AppBar>
			</div>
		</div>
	);
}
