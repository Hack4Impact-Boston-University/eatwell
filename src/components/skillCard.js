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
import {
	// uploadSkillsRating,
	getRecipe,
	setRecipeListener,
} from "../utils/skills.js";
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
		fontSize: "calc(max(2vw,17px))",
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

export default function SkillCard({
	key,
	object,
	isFav,
	// initNotes,
	// initRating,
}) {
	const classes = useStyles();
	const { user, upload } = useUser();
	const [obj, setObj] = React.useState(object);
	const [expanded, setExpanded] = React.useState(false);
	const [favorited, setFav] = React.useState(isFav);
	const handleExpandClick = () => {
		setExpanded(!expanded);
	};

	// const [notes, setNotes] = React.useState(initNotes);
	// const [note, setNote] = React.useState("");

	const maxChar = 30.0;

	// const [rating, setRating] = React.useState(initRating);

	const [, updateState] = React.useState();

	const [imgList, setImages] = React.useState(obj.images);
	useEffect(() => {
		setImages(obj.images);
	}, [obj.images]);
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

	const getTimeString = (timestamp) => {
		let date = new Date(timestamp);
		let month = date.getMonth() + 1;
		let day = date.getDate();
		let hour = date.getHours();
		let min = date.getMinutes();
		let sec = date.getSeconds();

		month = (month < 10 ? "0" : "") + month;
		day = (day < 10 ? "0" : "") + day;
		hour = (hour < 10 ? "0" : "") + hour;
		min = (min < 10 ? "0" : "") + min;
		sec = (sec < 10 ? "0" : "") + sec;

		let str =
			hour +
			":" +
			min +
			":" +
			sec +
			" on " +
			month +
			"/" +
			day +
			"/" +
			date.getFullYear();
		return str;
	};

	const favButtonClick = () => {
		auth.onAuthStateChanged(function (user) {
			if (user) {
				const getUserData = async () => {
					// get the current user's document
					const data = await db.collection("users").doc(user.uid).get();

					const skills = data.get("favoriteSkills");
					// if user has no favoriteSkills
					if (!skills || _.isEqual(skills,[])) {
						setFav(!favorited);
						// get current skill's ID from props and set it if no favoriteSKills yet
						await db
							.collection("users")
							.doc(user.uid)
							.update({ favoriteSkills: [object.skillID] });
						console.log("favorited skill: ", object.skillID);
					} else {
						// update favorited click
						setFav(!favorited);
						
						console.log(skills)
						if (!skills.includes(object.skillID)) {
							skills.push(object.skillID)
							await db
								.collection("users")
								.doc(user.uid)
								.update({ favoriteSkills: skills });
						}
						
						if (favorited) {
						}
					}
				};

				getUserData();
			} else {
				console.log("User isnt logged in!!!");
			}
		});
	};

	function handleSubmit() {
		if (note != "") {
			setStr(note, notes.length);
			setNote("");
		}
	}

	function setStr(s, i) {
		var words = s.split(" ");
		var st = "";
		for (let i = 0; i < words.length; i++) {
			var word = "";
			for (let j = 0; j < Math.ceil(words[i].length / maxChar); j++) {
				word += words[i].substring(maxChar * j, maxChar * (j + 1)) + " ";
			}
			st += word;
		}
		st = st.substring(0, st.length - 1);
		setNotes(
			notes
				.slice(0, i)
				.concat([st])
				.concat(notes.slice(i + 1))
		);
		editNotesSkillsCookie(
			obj.id,
			notes
				.slice(0, i)
				.concat([s])
				.concat(notes.slice(i + 1))
		);
	}

	function deleteStr(i) {
		if (notes.slice(0, i).length != 0) {
			setNotes(notes.slice(0, i).concat(notes.slice(i + 1)));
			editNotesSkillsCookie(
				obj.id,
				notes.slice(0, i).concat(notes.slice(i + 1))
			);
		} else {
			setNotes(notes.slice(i + 1));
			editNotesSkillsCookie(obj.id, notes.slice(i + 1));
		}
	}

	// function changeRating(val) {
	// 	uploadSkillsRating(obj, parseFloat(val), parseFloat(rating), setObj);
	// 	setRating(val);
	// 	editRatingsSkillsCookie(obj.id, val);
	// }

	if (Object.keys(obj) == 0) {
		return null;
	}

	const [isFlipped, setIsFlipped] = useState(false);

	const flipClick = () => {
		setIsFlipped(!isFlipped);
	};

	return (
		<Grid item xs={5}>
			<Box pb={3} mr={0.5} ml={0.5}>
				{/* <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal"> */}
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
										<Link href={obj.id}>
											<Typography
												style={{
													fontSize: "calc(min(5vw, 35px))",
													fontWeight: 300,
												}}
											>
												{obj.skillName}
											</Typography>
										</Link>
									</Grid>
								</Grid>
								<Grid container justify="center">
									{obj.images == undefined ? (
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
										<Link href={obj?.skillID}>Watch Video</Link>
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
