import Head from "next/head";
import React from "react";
import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import { Grid } from "@material-ui/core";
import useSWR from "swr";
import { useUser } from "../../utils/auth/useUser";
import SkillCard from "../../components/skillCard";
import {
	getFavsSkillsFromCookie,
	getNotesSkillsFromCookie,
	getRatingsSkillsFromCookie,
	getUserFromCookie,
} from "../../utils/cookies";
import Navbar from "../../components/Navbar";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import PropTypes from "prop-types";
import styles from "../../styles/Home.module.css";
// import { uploadSkillsRating } from "../../utils/skills.js";
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

// function TabPanel(props) {
// 	const { children, value, index, ...other } = props;

// 	return (
// 		<div
// 			role="tabpanel"
// 			hidden={value !== index}
// 			id={`full-width-tabpanel-${index}`}
// 			aria-labelledby={`full-width-tab-${index}`}
// 			{...other}
// 		>
// 			{value === index && (
// 				<Box p={3}>
// 					<Typography>{children}</Typography>
// 				</Box>
// 			)}
// 		</div>
// 	);
// }

// TabPanel.propTypes = {
// 	children: PropTypes.node,
// 	index: PropTypes.any.isRequired,
// 	value: PropTypes.any.isRequired,
// };

// function a11yProps(index) {
// 	return {
// 		id: `full-width-tab-${index}`,
// 		"aria-controls": `full-width-tabpanel-${index}`,
// 	};
// }

export default function SkillReviewCard() {
	const classes = useStyles();
	const [uploadDate, setUploadDate] = React.useState(Date.now())
	const { user, upload } = useUser();
	const { data: skills } = useSWR(`/api/skills/getAllSkills`, fetcher);
	const { data: skillsDic } = useSWR(`/api/skills/getAllSkillsDic`, fetcher);
	const { data: programsDic } = useSWR(`/api/programs/getAllProgramsDic`, fetcher);
	let favSkills = getFavsSkillsFromCookie() || {};
	const skillNotes = getNotesSkillsFromCookie() || {};
	const skillRatings = getRatingsSkillsFromCookie() || {};
	//const { data: userData } = useSWR(`/api/favoriteSkills/${favoriteSkill}`, fetcher);
	const [value, setValue] = React.useState(0);
	//const [favs, setFavs] = React.useState(value == 1);
	const [dummy, setDummy] = React.useState(true);

	const router = useRouter();

	// const handleChange = (event, newValue) => {
	// 	setValue(newValue);
	// 	setFavs(newValue == 1);
	// };

	useEffect(() => {
		window.addEventListener("beforeunload", () => {
			if (!_.isEqual(getFavsSkillsFromCookie(), undefined)) {
				upload({
					// favoriteSkills: Object.keys(getFavsSkillsFromCookie()),
					notes: getNotesSkillsFromCookie(),
					ratings: getRatingsSkillsFromCookie(),
				});
				// uploadSkillsRating(getRatingsSkillsFromCookie(), skillRatings, skills);
			}
		});
	});

	const onFavClick = () => {
		setDummy(!dummy);
		favSkills = getFavsSkillsFromCookie() || {};
		// uploadSkillsRating(getRatingsSkillsFromCookie(), skillRatings, skills);
	};

	if (!skills || !skillsDic || !programsDic || !user || !favSkills) {
		return "Loading skills...";
	}

	// const skillsUser = [];
	// if (!user.program == "") {
	// 	const keysList = Object.keys(programsDic[user.program]?.programSkills)
	// 	if (_.isEqual(user?.role, "user")) {
	// 		if (!_.isEqual(user.program, "")) {
				// if (programsDic[user.program]?.programSkills != null || programsDic[user.program]?.programSkills != []) {
				// 	var i;
				// 	for (i = 0; i < keysList.length; i++) {
				// 		console.log(programsDic[user.program].programSkills[keysList[i]])
				// 		var d = Date.parse(programsDic[user.program].programSkills[keysList[i]]+"T00:00:00.0000");
				// 		if (d < uploadDate) {
				// 			skillsUser.push(
				// 				skillsDic[keysList[i]]
				// 			);
				// 		}
				// 	}
				// }
			// }
	// 	}
	// }	


	if (getUserFromCookie() && !("firstname" in getUserFromCookie())) {
		router.push("/profile/makeProfile");
		return <div></div>;
	}

	return (
		<div className={styles.container}>
			{/* {user.role == "admin" ? ( */}
				{!_.isEqual(skills, []) ? (
					<Grid container spacing={1000} className={classes.gridContainerMain}>
						{skills.map((obj, idx) => {
							if (!obj?.skillName || !obj?.skillID) {return;}
							//if (!favs || obj.id in favSkills) {
								return (
									<SkillCard
										key={obj.skillID}
										object={obj}
										isFav={obj.skillID in favSkills}
										onFavClick={() => onFavClick()}
										// initNotes={obj.skillID in skillNotes ? skillNotes[obj.skillID] : []}
										// initRating={
										// 	obj.skillID in skillRatings ? skillRatings[obj.skillID] : 0
										// }
									/>
								);
							//} else {
								//return;
							//}
							//<SkillCard obj={skillsUser[4]} isFav = {favSkills.favRec.includes(skillsUser[4].skillID)} />
						})}
					</Grid>
				) : (
					<Grid>
						<h4>No skills to display</h4>
					</Grid>
				)
			/* // ) : !_.isEqual(skillsUser, []) ? (
			// 	<Grid container spacing={1000} className={classes.gridContainerMain}>
			// 		{skillsUser.map((obj, idx) => {
			// 			if (!obj.nameOfDish || !obj.id) return;
			// 			if (!favs || obj.id in favSkills) {
			// 				return (
			// 					<skillCard
			// 						key={obj.id}
			// 						object={obj}
			// 						isFav={obj.id in favSkills}
			// 						onFavClick={() => onFavClick()}
			// 						initNotes={obj.id in skillNotes ? skillNotes[obj.id] : []}
			// 						initRating={
			// 							obj.id in skillRatings ? skillRatings[obj.id] : 0
			// 						}
			// 					/>
			// 				);
			// 			} else {
			// 				return;
			// 			}
			// 			//<SkillCard obj={skillsUser[4]} isFav = {favSkills.favRec.includes(skillsUser[4].skillID)} />
			// 		})}
			// 	</Grid>
			// ) : (
			// 	<Grid>
			// 		<h4>No skills to display</h4>
			// 	</Grid>
			// )} */}

			<div className={styles.nav}>
				<Navbar />

				{/* <AppBar position="static" color="default">
					<Tabs
						value={value}
						onChange={handleChange}
						indicatorColor="primary"
						textColor="primary"
						variant="fullWidth"
						aria-label="full width tabs example"
					>
						<Tab
							label="All Skills"
							{...a11yProps(0)}
							className={classes.viewTabLabel}
						/>
						<Tab
							label="Favorites Only"
							{...a11yProps(1)}
							className={classes.viewTabLabel}
						/>
					</Tabs>
				</AppBar> */}
			</div>
		</div>
	);
}
