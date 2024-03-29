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
import { Rating } from "@material-ui/lab";
import clsx from "clsx";
import Link from "next/link";
import {
	editRatingsCookie,
} from "../utils/cookies";
import ClearIcon from "@material-ui/icons/Clear";
import {
	uploadRating,
} from "../utils/recipes.js";
import Slider from "react-slick";
import * as firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import initFirebase from "../utils/auth/initFirebase";
import ReactCardFlip from "react-card-flip";
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
		// width: 60,
    	// height: 60,
	},
	viewButtonLabel: { textTransform: "none" },
	text: {
		fontSize: "calc(min(2.7vw, 17px))",
	},
	label: {
		fontSize: "calc(min(3vw, 20px))",
	},
}));

function Test({
	object,
	isFav,
	onFavClick,
	initNotes,
	initRating,
	isHome,
	inFavoritesPage
}) {
return <Typography>{JSON.stringify(_.omit(object, ['images', 'nutritionalImgs', 'recipeImgs']))}</Typography>
}

// functional component for each individual recipe card
export default function RecipeCard({
	object,
	isFav,
	onFavClick,
	initNotes,
	initRatings,
	initRating,
	isHome,
	inFavoritesPage,
	dateRecipes
}) {
	const classes = useStyles();
	const [home] = React.useState(isHome);
	const [obj, setObj] = React.useState(object);
	const [expanded, setExpanded] = React.useState(false);
	const [favorited, setFav] = React.useState(isFav);
	const handleExpandClick = () => {
		setExpanded(!expanded);
	};
	const [notes, setNotes] = React.useState(initNotes);
	const [note, setNote] = React.useState("");
	const [val, setVal] = React.useState("");
	const [valTemp, setValTemp] = React.useState("");
	const [editing, setEditing] = React.useState(false);
	const [ratings, setRatings] = React.useState(initRatings);
	const [rating, setRating] = React.useState(initRating);
	const [imgList, setImages] = React.useState(obj.images);
	const [nutritionalImgs, setNutritionalImgs] = React.useState([]);
	
	useEffect(() => {
		// function for firebase storage
		const getImg = async (i) => {
			var storageRef = firebase.storage().ref();
			// Create a reference to the file we want to download
			var imgRef = storageRef.child(obj.id + i + ".png");
			// Get the download URLs for each image
			await imgRef
				.getDownloadURL()
				.then((url) => {
					// append new image url to state var
					setNutritionalImgs((nutritionalImgs) => [...nutritionalImgs, url]);
				})
				.catch((error) => {
					console.log(error);
				});
		};
		// make sure data exists before trying to fetch all the images
		// from firebase storage
		if (obj && obj.nutritionalImgs != undefined) {
			for (let i = 0; i < obj?.nutritionalImgs?.length; i++) {
				getImg(i);
			}
		}
	}, [obj]);

	// settings and css for React slider/slideshow
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

	// handle when fave button is clicked
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
					const recipes = data.get("favoriteRecipes");
					// if user has no favoriteRecipes
					if (!recipes || _.isEqual(recipes, [])) {
						// get current recipe's ID from props and set it if no favoriteSKills yet
						await db
							.collection("users")
							.doc(user.uid)
							.update({ favoriteRecipes: [obj.id] });
						const rec = await db.collection('recipes').doc(obj.id).get()
						await db
							.collection("recipes")
							.doc(obj.id)
							.update({ numFavorites: rec.data().numFavorites+ 1 });
					} else {
						if (!recipes.includes(obj.id)) {
							// if recipe not already favorited, add recipe to list
							recipes.push(obj.id);
							await db
								.collection("users")
								.doc(user.uid)
								.update({ favoriteRecipes: recipes });
							const rec = await db.collection('recipes').doc(obj.id).get()
							await db
								.collection("recipes")
								.doc(obj.id)
								.update({ numFavorites:rec.data().numFavorites + 1 });
						} else {
							// if recipe already favorited, remove recipe from list
							recipes.splice(recipes.indexOf(obj.id), 1);
							await db
								.collection("users")
								.doc(user.uid)
								.update({ favoriteRecipes: recipes })
							const rec = await db.collection('recipes').doc(obj.id).get()
							await db
								.collection("recipes")
								.doc(obj.id)
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

	// submitted a recipe note
	function handleSubmitNote() {
		auth.onAuthStateChanged(function (user) {
			if (user) {
				if (note != "") {
					const getUserData = async () => {
						// get the current user's document
						const data = await db.collection("users").doc(user.uid).get();
						// if user has no notes
						if (_.isEqual(notes, {})) {
							// get current recipe's ID from props and set it if no favoriteSKills yet
							notes[obj.id] = [note]
							await db
								.collection("users")
								.doc(user.uid)
								.update({ notes: notes });
						} else {
							if (notes[obj.id] != undefined) {
								// if recipe already has note, add to recipe
								notes[obj.id].push(note);
								await db
									.collection("users")
									.doc(user.uid)
									.update({ notes: notes });
							} else {
								// if recipe doesn't already have note, add recipe
								notes[obj.id] = [note]
								await db
									.collection("users")
									.doc(user.uid)
									.update({ notes: notes });
							}
						}
						// setStr(note, notes.length);
						setNote("");
					};
					getUserData();
				}
			} else {
				console.log("User isnt logged in!!!");
			}
		});
	}

	// editing a recipe note
	function submitEdit(note, index) {
		auth.onAuthStateChanged(function (user) {
			if (note != "") {
				const getUserData = async () => {
					notes[obj.id][index] = note
					await db
						.collection("users")
						.doc(user.uid)
						.update({ notes: notes });
					
					// setStr(note, notes.length);
					setNotes(notes);
					setNote("");
				};

				getUserData();
			} else {
				console.log("note cannot be empty string");
			}
		});
		setNotes(Object.assign({}, notes));
		setVal("")
		setValTemp("")
		alert("edited notes!")
	}

	// delete recipe note
	function deleteNote(index) {
		auth.onAuthStateChanged(function (user) {
			const getUserData = async () => {
				notes[obj.id].splice(index,1)
				await db
					.collection("users")
					.doc(user.uid)
					.update({ notes: notes });
				setNotes(notes);
			};

			getUserData();
		});
		setNotes(Object.assign({}, notes));
		alert("deleted notes!")
	}

	// update recipe rating
	function changeRating(val) {
		auth.onAuthStateChanged(function (user) {
			if (user) {
				const getUserData = async () => {
					// get the current user's document
					// const data = await db.collection("users").doc(user.uid).get();
					ratings[obj.id] = parseFloat(val)
					await db
						.collection("users")
						.doc(user.uid)
						.update({ ratings: ratings })
				};
				getUserData();
			} else {
				console.log("User isnt logged in!!!");
			}
		});
		uploadRating(obj, parseFloat(val), parseFloat(rating), setObj)
		.catch((err) => {
			console.log(err)
		});
		setRating(val);
	}

	if (Object.keys(obj) == 0) {
		return null;
	}

	const [isFlipped, setIsFlipped] = useState(false);

	const flipClick = () => {
		setIsFlipped(!isFlipped);
	};
	return (
		<Grid item xs={11}>
			{home != true ? (
				// RECIPES TAB CARD DISPLAY
				<Box pb={3} mr={0.5} ml={0.5}>
					<ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
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
												{obj.nameOfDish.length > 16 ?
													<Typography align="center" style={{paddingLeft: "calc(max(2vw,10px))", fontSize: "calc(max(2vw,25px))", fontWeight: 300}}>
														{obj.nameOfDish}
													</Typography> :
													<Typography align="center" style={{fontSize: "calc(max(2vw,25px))", fontWeight: 300,}}>
														{obj.nameOfDish}
													</Typography>
												}
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
														charset="UTF-8"
														href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
													/>
													<link
														rel="stylesheet"
														type="text/css"
														href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
													/>
													<style>{cssstyle}</style>

													{/* {Array.isArray(imgList) && imgList.length > 0 &&
														<img
															className={classes.media}
															src={obj.images[0]}
														/>
													} */}
													<Slider {...settings}>
														{Array.isArray(imgList) &&
															obj.images.map((cell, index) => {
																return (
																	<img
																		className={classes.media}
																		src={obj.images[index]}
																	/>
																);
															})}
													</Slider>
												</Grid>
											)}
										</Grid> 
										<Grid container item xs={12} justify="center">
											<Button
												variant="contained"
												color="secondary"
												classes={{ label: classes.viewButtonLabel }}
											>
												{
													(home == true || inFavoritesPage == true) ? <Link href={"recipes/"+obj?.id}>Make this Recipe</Link>
													: <Link href={obj?.id}>Make this Recipe</Link>
												}
											</Button>
										</Grid>
										<Grid
											container
											justify="center"
											style={{ marginTop: "3vh", marginBottom: "1vh" }}
										>
											<Grid
												item
												xs={4}
												container
												direction="column"
												justify="center"
												alignItems="center"
											>
												<Grid item>
													<Typography
														style={{
															fontSize: "calc(min(4vw, 20px))",
															fontWeight: 300,
														}}
													>
														Date:
													</Typography>
												</Grid>
												<Grid item>
													<Typography
														style={{
															fontSize: "calc(min(4vw, 20px))",
															fontWeight: 300,
														}}
													>
														{dateRecipes}
													</Typography>
												</Grid>
											</Grid>
											<Grid
												item
												container
												xs={6}
												justify="center"
												direction="column"
												alignItems="center"
											>
												<Grid item>
													<Typography
														style={{
															fontSize: "calc(min(4vw, 20px))",
															fontWeight: 300,
														}}
													>
														Average: {Math.round(obj.avgRating * 100) / 100.0} /
														5
													</Typography>
												</Grid>
												<Grid item>
													<Rating
														// defaultValue={0}
														precision={0.5}
														onChange={(e) => {
															changeRating(e.target.value);
														}}
														value={rating}
														style={{ fontSize: "calc(min(6vw, 20px))" }}
													/>
													{rating > 0 && (
														<ClearIcon
															onClick={() => {
																changeRating(0);
															}}
															style={{ fontSize: "calc(min(5vw, 20px))" }}
														/>
													)}
												</Grid>
												<Grid item>
													<Typography
														style={{
															fontSize: "calc(min(4vw, 20px))",
															fontWeight: 300,
														}}
													>
														{obj?.numRatings} Rating
														{obj?.numRatings > 1 ? "s" : ""}
													</Typography>
												</Grid>
											</Grid>
										</Grid>
										<Grid container spacing={3}>
											<Grid item xs={12}>
												<Typography
													style={{
														fontSize: "calc(min(4vw, 20px))",
														fontWeight: 300,
													}}
												>
													{obj?.description}
												</Typography>
											</Grid>
										</Grid>
									</Box>
								</CardContent>

								{/* click to flip button */}
								<CardContent style={{ padding: "0px" }}>
									<Grid container item xs={12} justify="center" p={0}>
										<Button
											variant="contained"
											color="secondary"
											classes={{ label: classes.viewButtonLabel }}
											onClick={flipClick}
										>
											Click to Flip!
										</Button>
									</Grid>
								</CardContent>

								{/* Submit a notes section */}
								<CardActions disableSpacing>
									<Grid
										container
										direction="row"
										alignItems="center"
										justify="center"
									>
										<Typography
											style={{
												fontSize: "calc(min(2.7vw, 18px))",
												fontWeight: 300,
											}}
										>
											Notes
										</Typography>
									</Grid>
									<IconButton
										className={clsx(classes.expand, {
											[classes.expandOpen]: expanded,
										})}
										onClick={handleExpandClick}
										aria-expanded={expanded}
										aria-label="show more"
									>
										<ExpandMoreIcon />
									</IconButton>
								</CardActions>
								<Collapse in={expanded} timeout="auto" unmountOnExit>
									<Grid
										container
										direction="column"
										alignItems="center"
										justify="center"
									>
										<Grid
											justify="center"
											direction="row"
											className={classes.formItems}
											container
										>
											<TextField
												value={note}
												onChange={(e) => setNote(e.target.value)}
												label="Note"
												placeholder="Add a Note"
												InputProps={{
													classes: { input: classes.text },
												}}
												InputLabelProps={{
													classes: { root: classes.label },
												}}
											/>
											<Button
												color="primary"
												className={classes.btn}
												style={{ marginTop: "1rem" }}
												onClick={() => handleSubmitNote()}
											>
												<Typography
													style={{
														fontSize: "calc(min(2.7vw, 17px))",
														fontWeight: 1000,
													}}
												>
													Submit
												</Typography>
											</Button>
										</Grid>
										<Box m={"3vh"}>
											{notes[obj.id] != undefined ? notes[obj.id].map((str, index) => {
												return (
													<Grid container spacing={0} direction="column" alignItems="center" justify="center" style={{ minHeight: "1vh" }}>
														{editing && valTemp == str ? (
															<Grid justify="center" direction="row" className={classes.formItems} container>
																<TextField defaultValue={str} onChange={(e) => setVal(e.target.value)}
																	label="Note" placeholder="Add a Note"
																	InputProps={{
																		classes: { input: classes.text, label: classes.label },
																	}}
																	InputLabelProps={{
																		classes: { root: classes.label },
																	}}
																/>
																<Button color="primary" className={classes.btn}
																	onClick={() => {
																		setEditing(false);
																		submitEdit(val, index);
																	}}
																>
																	<Typography style={{ fontSize: "calc(min(2.7vw, 17px))", fontWeight: 1000 }}>
																		Submit
																	</Typography>
																</Button>
																<Button color="primary" className={classes.btn}
																	onClick={() => {setEditing(false); setNote(""); setVal(""); setValTemp("")}}
																>
																	<Typography style={{ fontSize: "calc(min(2.7vw, 17px))", fontWeight: 1000 }}>
																		Cancel
																	</Typography>
																</Button>
															</Grid>
														) : (
															<Grid justify="center" direction="row" className={classes.formItems} container>
																<Grid justify="center"
																	style={{
																		marginRight: "1rem",
																		marginTop: "0.3rem",
																		maxWidth: "60vw",
																	}}
																>
																	<Typography style={{ fontSize: "calc(min(2.7vw, 17px))", fontWeight: 300 }}>
																		{str}
																	</Typography>
																</Grid>
																<Button color="primary" className={classes.btn} onClick={() => {setVal(str); setValTemp(str); setEditing(true)}}>
																	<Typography style={{ fontSize: "calc(min(2.7vw, 17px))", fontWeight: 1000 }}>
																		Edit
																	</Typography>
																</Button>
																<Button color="primary" className={classes.btn} onClick={() => deleteNote(index)}>
																	<Typography style={{ fontSize: "calc(min(2.7vw, 17px))", fontWeight: 1000 }}>
																		Delete
																	</Typography>
																</Button>
															</Grid>
														)}
													</Grid>
												);
											}) : [].map((str, idx) => {
												return (
													<Grid></Grid>
												);
											})}
										</Box>
									</Grid>
								</Collapse>
								{/* end of submit a note */}
							</Card>
						</div>

						{/* BACKSIDE OF THE CARD */}
						<div>
							<Card className={classes.card}>
								<CardContent p={0}>
									<Box m={"0.25vw"}>
										<Grid container>
											<Grid item xs={2} sm={1}>
												<IconButton
													onClick={favButtonClick}
													aria-label="Back Side"
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
												{obj.nameOfDish.length > 16 ?
													<Typography align="center" style={{paddingLeft: "calc(max(2vw,10px))", fontSize: "calc(max(2vw,25px))", fontWeight: 300,}}>
														{obj.nameOfDish}
													</Typography> :
													<Typography align="center" style={{fontSize: "calc(max(2vw,25px))", fontWeight: 300,}}>
														{obj.nameOfDish}
													</Typography>
												}
											</Grid>
										</Grid>
										<Grid
											item
											xs={12}
											style={{
												minHeight: "180px",
												marginTop: "3vh",
												marginBottom: "1vh",
											}}
										>
											<style>{cssstyle}</style>
											{/* slider for the nutritional facts */}
											<Slider {...settings}>
												{Array.isArray(nutritionalImgs) &&
													nutritionalImgs.map((url) => {
														return (
															<img className={classes.media} src={url}/>
														);
													})}
											</Slider>
										</Grid>
										<Grid container spacing={3}>
											<Grid item xs={12}>
												<Typography
													style={{
														fontSize: "calc(min(4vw, 20px))",
														fontWeight: 500,
													}}
												>
													Ingredients / Allergens:
												</Typography>
												<Typography
													style={{
														fontSize: "calc(min(4vw, 20px))",
														fontWeight: 300,
													}}
												>
													{obj?.descriptionIngredients}
												</Typography>
											</Grid>
										</Grid>
										<Grid container spacing={3}>
											<Grid item xs={12}>
												<Typography
													style={{
														fontSize: "calc(min(4vw, 20px))",
														fontWeight: 500,
													}}
												>
													Recipe Facts:
												</Typography>
												<Typography
													style={{
														fontSize: "calc(min(4vw, 20px))",
														fontWeight: 300,
													}}
												>
													{obj?.recipeFact}
												</Typography>
											</Grid>
										</Grid>
										<Grid container item xs={12} justify="center" p={0}>
											<Button
												variant="contained"
												color="secondary"
												classes={{ label: classes.viewButtonLabel }}
												onClick={flipClick}
											>
												Click to Flip!
											</Button>
										</Grid>
									</Box>
								</CardContent>
							</Card>
						</div>
						{/* END OF BACKSIDE OF CARD */}
					</ReactCardFlip>
				</Box>
			) : (

				// HOME PAGE CARD DISPLAY
				<Box pb={3} mr={0.5} ml={0.5}>
					<Card className={classes.card}>
						<CardContent p={0}>
							<Box m={"0.25vw"}>
								<Grid container>
									<Grid item xs={2} sm={1}>
										<IconButton
											aria-label="add to favorites"
											color={favorited ? "secondary" : "default"}
											className={classes.iconContainer}
										>
										</IconButton>
									</Grid>
									<Grid container item xs={10} alignItems="center" justify="center">
										{obj.nameOfDish.length > 16 ?
											<Typography align="center" style={{paddingLeft: "calc(max(2vw,10px))", fontSize: "calc(max(2vw,25px))", fontWeight: 300}}>
												{obj.nameOfDish}
											</Typography> :
											<Typography align="center" style={{fontSize: "calc(max(2vw,25px))", fontWeight: 300,}}>
												{obj.nameOfDish}
											</Typography>
										}
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
												charset="UTF-8"
												href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
											/>
											<link
												rel="stylesheet"
												type="text/css"
												href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
											/>
											<style>{cssstyle}</style>
											<Slider {...settings}>
												{Array.isArray(imgList) &&
													obj.images.map((cell, index) => {
														return (
															<img
																className={classes.media}
																src={obj.images[index]}
															/>
														);
													})}
											</Slider>
										</Grid>
									)}
								</Grid>
								<Grid container item xs={12} justify="center">
									<Button variant="contained" color="secondary"
										classes={{ label: classes.viewButtonLabel }}
									>
										{
											(home == true || inFavoritesPage == true) ? <Link href={"recipes/"+obj?.id}>Make this Recipe</Link>
											: <Link href={obj?.id}>Make this Recipe</Link>
										}
									</Button>
								</Grid>
							</Box>
						</CardContent>
					</Card>
				</Box>
			)}
		</Grid>
	);
}