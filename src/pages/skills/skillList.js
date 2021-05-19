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
	const { data: skills } = useSWR(`/api/skills/getAllSkills`, fetcher);
	const { data: skillsDic } = useSWR(`/api/skills/getAllSkillsDic`, fetcher);
	const { data: programsDic } = useSWR(
		`/api/programs/getAllProgramsDic`,
		fetcher
	);
	let favSkills = getFavsSkillsFromCookie() || {};
	const skillNotes = getNotesSkillsFromCookie() || {};
	const skillRatings = getRatingsSkillsFromCookie() || {};
	const [value, setValue] = React.useState(0);
	const [dummy, setDummy] = React.useState(true);
	const router = useRouter();


	useEffect(() => {
		window.addEventListener("beforeunload", () => {
			if (!_.isEqual(getFavsSkillsFromCookie(), undefined)) {
				upload({
					notes: getNotesSkillsFromCookie(),
					ratings: getRatingsSkillsFromCookie(),
				});
			}
		});
	});

	if (!skills || !skillsDic || !programsDic || !user || !favSkills) {
		return "Loading skills...";
	}

	if (getUserFromCookie() && !("firstname" in getUserFromCookie())) {
		router.push("/profile/makeProfile");
		return <div></div>;
	}

	return (
		<div className={styles.container}>
			{/* {user.role == "admin" ? ( */}
			{
				!_.isEqual(skills, []) ? (
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
										isFav={obj.skillID in favSkills}
									/>
								</Grid>
							);
						})}
					</Grid>
				) : (
					<Grid>
						<h4>No skills to display</h4>
					</Grid>
				)
			}

			<div className={styles.nav}>
				<Navbar />
			</div>
		</div>
	);
}
