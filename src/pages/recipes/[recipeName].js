import Head from "next/head";
import * as ui from "@material-ui/core";
import * as toggle from "@material-ui/lab";
import AssignmentIcon from "@material-ui/icons/Assignment";
import BuildIcon from "@material-ui/icons/Build";
import EmojiObjectsIcon from "@material-ui/icons/EmojiObjects";
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import PropTypes from "prop-types";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import SwipeableViews from "react-swipeable-views";
import { AppBar, Box, Grid, Tabs, Tab, Typography } from "@material-ui/core";
import Navbar from "../../components/Navbar";
import * as firebase from "firebase";
import "firebase/firestore";
import initFirebase from "../../utils/auth/initFirebase";
import styles from "../../styles/Home.module.css";

import { getUserFromCookie } from "../../utils/cookies";
import Slider from "react-slick";
import _ from "underscore";

const fetcher = async (...args) => {
	const res = await fetch(...args);

	return res.json();
};

function useWindowSize() {
	// Initialize state with undefined width/height so server and client renders match
	// Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
	const [windowSize, setWindowSize] = useState({
		width: undefined,
		height: undefined,
	});

	useEffect(() => {
		// only execute all the code below in client side
		if (typeof window !== "undefined") {
			// Handler to call on window resize
			function handleResize() {
				// Set window width/height to state
				setWindowSize({
					width: window.innerWidth,
					height: window.innerHeight,
				});
			}

			// Add event listener
			window.addEventListener("resize", handleResize);

			// Call handler right away so state gets updated with initial window size
			handleResize();

			// Remove event listener on cleanup
			return () => window.removeEventListener("resize", handleResize);
		}
	}, []); // Empty array ensures that effect is only run on mount
	return windowSize;
}

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
					<Typography component={'span'}>{children}</Typography>
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

const useStyles = makeStyles((theme) => ({
	root: {
		backgroundColor: theme.palette.background.paper,
		width: "100%",
		paddingTop: "5vh",
	},
	video: {
		marginTop: "12vh",
		marginBottom: "3vh",
	},
	lst: {
		listStyle: "none",
	}
}));

export default function Recipe() {
	const router = useRouter();
	const { recipeName } = router.query;
	const { data } = useSWR(`/api/recipes/${recipeName}`, fetcher);
	const { data: skillsDic } = useSWR(`/api/skills/getAllSkillsDic`, fetcher);
    const { data: tipsDic } = useSWR(`/api/tips/getAllTipsDic`, fetcher);
	const { width } = useWindowSize();
	const classes = useStyles();
	const theme = useTheme();
	const [value, setValue] = React.useState(0);
	const [testImg, setTestImg] = React.useState("");

	// image slideshow for recipe instructions
	const [imgList, setImgList] = React.useState([]);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const handleChangeIndex = (index) => {
		setValue(index);
	};

	// styling and settings for React slider
	var settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
	};

	const cssstyle = `
    .container {
      margin: 0 auto;
      padding: 0px 40px 40px 40px;
    }
    h3 {
        background: #5f9ea0;
        color: #fff;
        font-size: 36px;
        line-height: 100px;
        margin: 10px;
        padding: 2%;
        position: relative;
        text-align: center;
    }
    .slick-next:before, .slick-prev:before {
        color: #000;
    }`;

	useEffect(() => {
		// function for firebase storage
		const getImg = async (i, vals) => {
			var storageRef = firebase.storage().ref();
			// Create a reference to the file we want to download
			var imgRef = storageRef.child(data.id + i + ".pdf");
			// Get the download URLs for each image
			await imgRef
				.getDownloadURL()
				.then((url) => {
					// append new image url to state var
					if (vals.includes(data.id + i + ".pdf")) {
						setImgList((imgList) => [...imgList, url]);
					} else {
						setImgList((imgList) => [...imgList, ""]);
					}
				})
				.catch((error) => {
					console.log(error);
				});
		};

		// make sure data exists before trying to fetch all the images
		// from firebase storage
		const start = async () => {
			if (data) {
				var vals = Object.values(data.recipeImgs)
				for (let i = 0; i < data.recipeImgs.length; i++) {
					await getImg(i, vals);
				}
			}
		}

		start()
	}, [data]);

	const userData = getUserFromCookie();
	if (!userData || "code" in userData) {
		// router.push("/");
	} else if (!("firstname" in userData)) {
		router.push("/profile/makeProfile");
	}

	// wait for data to finish loading
	if (!data) {
		return "Loading...";
	} else if (!skillsDic) {
		return "Loading skillsDic...";
	} else if (!tipsDic) {
		return "Loading tipsDic...";
	}

	return (
		<div className={classes.root}>
			{/* these are the stylesheets for React Slider */}
			<link
				rel="stylesheet"
				type="text/css"
				charset="UTF-8"
				href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
			/>
			<link
				rel="stylesheet"
				type="text/css"
				href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
			/>
			<style>{cssstyle}</style>
			{/* end stylesheets */}

			<TabPanel value={value} index={0} dir={theme.direction}>
				<div position="fixed" className={classes.video}>
					<iframe position="fixed" src={"https://player.vimeo.com/video/"+data.videoRecipe} width="100%" height={(width*0.4)} frameBorder="0" align="center" position="sticky" allow="autoplay; fullscreen"></iframe>
				</div>
				{/* map out the image urls to img tags */}
				<ui.Grid container justify="center">
					<ol className={classes.lst}>
						{imgList.map((url) => {
					      if (!_.isEqual(url, "")) {
							return ( <li><img display="block" src={url} alt="Recipe image" /></li> )}
						  }
						)}
					</ol>
				</ui.Grid>
			</TabPanel>

			{data.videoSkills != "" && (
				<TabPanel value={value} index={1} dir={theme.direction}>
					<div position="fixed" className={classes.video}>
						<iframe position="fixed" src={"https://player.vimeo.com/video/"+skillsDic[data.videoSkills].url} width="100%" height={(width*0.4)} frameBorder="0" align="center" position="sticky" allow="autoplay; fullscreen"></iframe>
					</div>
				</TabPanel>
			)}
			{data.videoTips != "" && (
				<TabPanel value={value} index={2} dir={theme.direction}>
					<div position="fixed" className={classes.video}>
						<iframe position="fixed" src={"https://player.vimeo.com/video/"+tipsDic[data.videoTips].url} width="100%" height={(width*0.4)} frameBorder="0" align="center" position="sticky" allow="autoplay; fullscreen"></iframe>
					</div>
				</TabPanel>
			)}

			<div className={styles.nav}>
				<div
					style={{
						width: "100%",
						minWidth: "29%",
					}}
				>
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
							<Tab label={"Recipe: " + data.nameOfDish} {...a11yProps(0)} />
							{data.videoSkills != "" && (
								<Tab label={"Skill: " + skillsDic[data.videoSkills].skillName} {...a11yProps(1)} />
							)}
							{data.videoTips != "" && (
								<Tab label={"Tip: " + tipsDic[data.videoTips].tipName}  {...a11yProps(2)} />
							)}
						</Tabs>
					</AppBar>
				</div>
			</div>
		</div>
	);
}
