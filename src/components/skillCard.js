import React from "react";
import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
	Button,
	Card,
	CardContent,
	CardActions,
	Collapse,
	Grid,
	IconButton,
	TextField,
	Typography,
	Box,
} from "@material-ui/core";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import * as ui from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import clsx from "clsx";
import Link from "next/link";
import {
	getFavsSkillsFromCookie,
	editFavSkillsCookie,
	editNotesSkillsCookie,
	editRatingsSkillsCookie,
} from "../utils/cookies";
import ClearIcon from "@material-ui/icons/Clear";
import StarIcon from "@material-ui/icons/Star";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import { getRecipe, setRecipeListener } from "../utils/skills.js";
import Slider from "react-slick";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import initFirebase from "../utils/auth/initFirebase";
import ReactCardFlip from "react-card-flip";
import { useUser } from "../utils/auth/useUser";
import _, { map } from "underscore";

initFirebase();
var db = firebase.firestore();
var auth = firebase.auth();
const useStyles = makeStyles((theme) => ({
	btn: {
		width: "4rem",
		display: "block",
		textAlign: "center",
	},
	card: {
		boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
		"&:hover": {
			boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)",
		},
	},

	media: {
		maxWidth: "100%",
	},
	expand: {
		transform: "rotate(0deg)",
		marginLeft: "auto",
		transition: theme.transitions.create("transform", {
			duration: theme.transitions.duration.shortest,
		}),
	},
	expandOpen: {
		transform: "rotate(180deg)",
	},
	notes: {
		width: 100,
	},
	formItems: {
		marginTop: theme.spacing(0),
	},
	icon: {
		fontSize: "calc(max(2vw,30px))",
	},
	iconContainer: {
		// width: "3vw",
		// height: "3vw",
	},
	viewButtonLabel: { textTransform: "none" },
	text: {
		fontSize: "calc(min(2.7vw, 17px))",
	},
	label: {
		fontSize: "calc(min(3vw, 20px))",
	},
}));

// functional component for individual skills card
export default function SkillCard({ object, isFav, inFavoritesPage, onFavClick }) {
	const classes = useStyles();
	const { user, upload } = useUser();
	const [expanded, setExpanded] = React.useState(false);
	const [favorited, setFav] = React.useState(isFav);
	const handleExpandClick = () => {
		setExpanded(!expanded);
	};
	const maxChar = 30.0;
	const [, updateState] = React.useState();

	const [imgList, setImages] = React.useState(object.images);
	useEffect(() => {
		setImages(object.images);
	}, [object.images]);

	// this useEffect is to properly show status of favorited
	// icons on page or card load
	useEffect(() => {
		auth.onAuthStateChanged(function (user) {
			if (user) {
				const getUserData = async () => {
					// get the current user's document
					const data = await db.collection("users").doc(user.uid).get();
					const skills = data.get("favoriteSkills");

					// if user has no favoriteSkills
					if (!skills || _.isEqual(skills, [])) {
						setFav(false);
					} else {
						if (skills.includes(object.skillID)) setFav(true);
						else setFav(false);
					}
				};

				getUserData();
			} else {
				console.log("User isnt logged in!!!");
			}
		});
	}, []);

	// settings and css for react slider/slideshow
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

	
	// clicking fave button
	const favButtonClick = () => {
		auth.onAuthStateChanged(function (user) {
			if (user) {
				const getUserData = async () => {
					// if on favorites page, we want this card to disappear
					if (favorited && inFavoritesPage) {
						onFavClick();
					}

					// update click
					setFav(!favorited);

					// get the current user's document
					const data = await db.collection("users").doc(user.uid).get();

					const skills = data.get("favoriteSkills");
					// if user has no favoriteSkills
					if (!skills || _.isEqual(skills, [])) {
						// get current skill's ID from props and set it if no favoriteSKills yet
						await db
							.collection("users")
							.doc(user.uid)
							.update({ favoriteSkills: [object.skillID] });
						const rec = await db.collection('skills').doc(object.skillID).get()
						await db
							.collection("skills")
							.doc(object.skillID)
							.update({ numFavorites: rec.data().numFavorites + 1 });
					} else {
						if (!skills.includes(object.skillID)) {
							skills.push(object.skillID);
							await db
								.collection("users")
								.doc(user.uid)
								.update({ favoriteSkills: skills });
							const rec = await db.collection('skills').doc(object.skillID).get()
							await db
								.collection("skills")
								.doc(object.skillID)
								.update({ numFavorites: rec.data().numFavorites + 1 });
						} else {
							skills.splice(skills.indexOf(object.skillID), 1);
							await db
								.collection("users")
								.doc(user.uid)
								.update({ favoriteSkills: skills });
							const rec = await db.collection('skills').doc(object.skillID).get()
							await db
								.collection("skills")
								.doc(object.skillID)
								.update({ numFavorites: rec.data().numFavorites - 1 });
						}
					}
				};

				getUserData();
			} else {
				console.log("User isnt logged in!!!");
			}
		});
	};

	if (Object.keys(object) == 0) {
		return null;
	}

	return (
		<Grid item xs={11} >
			<Box pb={3} mr={0.5} ml={0.5}>
				<div>
					<Card className={classes.card}>
						<CardContent p={0}>
							<Box m={"0.25vw"}>
								<Grid container>
									<Grid item xs={2} sm={1}>
										<IconButton
											onClick={favButtonClick}
											aria-label="add to favorites"
											color={favorited ? "secondary" : "default"}
											className={classes.iconContainer}
										>
											<FavoriteIcon className={classes.icon} />
										</IconButton>
									</Grid>
									<Grid
										container
										item
										xs={10}
										alignItems="center"
										justify="center"
									>
										{inFavoritesPage == true ? 
											<Link href={"skills/"+object.skillID}>
												{object.skillName.length > 16 ?
													<Typography align="center" style={{paddingLeft: "calc(max(2vw,10px))", fontSize: "calc(max(2vw,25px))", fontWeight: 300,}}>
														{object.skillName}
													</Typography> :
													<Typography align="center" style={{fontSize: "calc(max(2vw,25px))", fontWeight: 300,}}>
														{object.skillName}
													</Typography>
												}
											</Link> :
											<Link href={object.skillID}>
												{object.skillName.length > 16 ?
													<Typography align="center" style={{paddingLeft: "calc(max(2vw,10px))", fontSize: "calc(max(2vw,25px))", fontWeight: 300,}}>
														{object.skillName}
													</Typography> :
													<Typography align="center" style={{fontSize: "calc(max(2vw,25px))", fontWeight: 300,}}>
														{object.skillName}
													</Typography>
												}
											</Link>
										}
										
									</Grid>
								</Grid>
								<Grid container justify="center">
									{object.images == undefined ? (
										<Grid item xs={12}></Grid>
									) : (
										<Grid item xs={9}>
											<link
												rel="stylesheet"
												type="text/css"
												charSet="UTF-8"
												href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
											/>
											<link
												rel="stylesheet"
												type="text/css"
												href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
											/>
											<style>{cssstyle}</style>
											<img className={classes.media} src={imgList[0]} />
										</Grid>
									)}
								</Grid>
								<Grid container item xs={12} justify="center">
									<Button
										variant="contained"
										color="secondary"
										classes={{ label: classes.viewButtonLabel }}
									>
										{inFavoritesPage == true
											? <Link href={"skills/"+object?.skillID}>Watch Video</Link>
											: <Link href={object?.skillID}>Watch Video</Link>
										}
										
									</Button>
								</Grid>
							</Box>
						</CardContent>
					</Card>
				</div>
			</Box>
		</Grid>
	);
}
