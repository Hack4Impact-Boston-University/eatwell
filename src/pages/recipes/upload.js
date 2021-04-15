import React, { useState, useEffect } from "react";
import * as ui from "@material-ui/core";
import * as firebase from "firebase";
import "firebase/firestore";
import initFirebase from "../../utils/auth/initFirebase";
import { DropzoneArea } from "material-ui-dropzone";
import { PictureAsPdf, Router } from "@material-ui/icons";
import Navbar from "../../components/Navbar";
import styles from "../../styles/Home.module.css";
import { Alert } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import IconButton from "@material-ui/core/IconButton";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import InboxIcon from "@material-ui/icons/Inbox";
import StarIcon from "@material-ui/icons/Star";
import SendIcon from "@material-ui/icons/Send";
import DraftsIcon from "@material-ui/icons/Send";
import MultiImageInput from "react-multiple-image-input";

import { getUserFromCookie } from "../../utils/cookies";
import { useRouter } from "next/router";

initFirebase();

const handlePreviewIcon = (fileObject, classes) => {
	const iconProps = {
		className: image,
	};
	return <PictureAsPdf {...iconProps} />;
};

const UploadForm = () => {
	const [recipeName, setRecipeName] = useState("");
	const [videoID, setVideoID] = useState("");
	const [recipeImg, setRecipeImg] = useState({});
	const [description, setDescription] = useState("");
	const [videoSkills, setVideoSkills] = useState("");
	const [videoTips, setVideoTips] = useState("");
	const [images, setImages] = useState({});
	const [openConfirm, setOpenConfirm] = React.useState(false);
	var uploadedRecipeImgs = [];
	var uploadedImages = [];

	const router = useRouter();

	const crop = {
		unit: "%",
		aspect: 4 / 3,
		width: "100",
	};

	const handleClickOpenConfirm = () => {
		setOpenConfirm(true);
	};

	const handleCloseConfirm = () => {
		setOpenConfirm(false);
	};

	function upload() {
		const videoUrl = "https://player.vimeo.com/video/";

		var recipe = recipeName.toLowerCase();
		recipe = recipe.replace(/ /g, "_");

		var i;
		var uploadedImages = Object.values(images);
		var uploadedRecipeImgs = Object.values(recipeImg);
		var uploadedRecipeNames = [];

		var document = firebase.firestore().collection("recipes").doc();
		for (i = 0; i < uploadedRecipeImgs.length; i++) {
			uploadedRecipeNames.push(document.id + i + ".pdf");
		}
		var data = {
			id: document.id,
			nameOfDish: recipeName,
			description: description,
			images: uploadedImages,
			videoRecipe: videoUrl + videoID,
			recipeImgs: uploadedRecipeNames,
			dateUploaded: Date.now(),
			videoSkills: videoUrl + videoSkills,
			videoTips: videoUrl + videoTips,
			numRatings: 1,
			avgRating: 5,
		};

		document.set(data);
		for (i = 0; i < uploadedRecipeImgs.length; i++) {
			firebase
				.storage()
				.ref()
				.child(document.id + i + ".pdf")
				.putString(uploadedRecipeImgs[i], "data_url")
				.on(firebase.storage.TaskEvent.STATE_CHANGED, {
					complete: function () {},
				});
		}
		for (i = 0; i < uploadedImages.length; i++) {
			firebase
				.storage()
				.ref()
				.child(document.id + i + ".jpg")
				.putString(uploadedImages[i], "data_url")
				.on(firebase.storage.TaskEvent.STATE_CHANGED, {
					complete: function () {},
				});
		}

		setRecipeName("");
		setVideoID("");
		setRecipeImg({});
		setDescription("");
		setVideoSkills("");
		setVideoTips("");
		setImages({});
		setOpenConfirm(false);
	}

	const userData = getUserFromCookie();

	if(!userData || "code" in userData || userData["role"] != "admin") {
		router.push("/");
	}
	else if(!("firstname" in userData)) {
		router.push("/profile/makeProfile");
	}

	return (
		<div className={styles.container}>
			<React.Fragment>
				<ui.Typography variant="h6" gutterBottom>
					Upload New Recipe
				</ui.Typography>
				<ui.Grid container spacing={3}>
					<ui.Grid item xs={12} sm={6}>
						<ui.TextField
							required
							value={recipeName}
							label="Recipe Name"
							onChange={(e) => setRecipeName(e.target.value)}
							fullWidth
							variant="outlined"
						/>
					</ui.Grid>
					<ui.Grid item xs={12} sm={6}>
						<ui.TextField
							required
							value={videoID}
							label="Vimeo Recipe Video ID"
							onChange={(e) => setVideoID(e.target.value)}
							fullWidth
							variant="outlined"
						/>
					</ui.Grid>
					<ui.Grid item xs={12} sm={6}>
						<ui.TextField
							value={videoSkills}
							label="Vimeo Skills Video ID"
							onChange={(e) => setVideoSkills(e.target.value)}
							fullWidth
							variant="outlined"
						/>
					</ui.Grid>
					<ui.Grid item xs={12} sm={6}>
						<ui.TextField
							value={videoTips}
							label="Vimeo Tips Video ID"
							onChange={(e) => setVideoTips(e.target.value)}
							fullWidth
							variant="outlined"
						/>
					</ui.Grid>
					<ui.Grid item xs={12}>
						<ui.TextField
							value={description}
							label="Recipe Description"
							multiline
							onChange={(e) => setDescription(e.target.value)}
							fullWidth
							variant="outlined"
						/>
					</ui.Grid>

					{/* upload recipe result image */}
					<ui.Grid container item justify="center">
						<ui.Grid item xs={12}>
							<ui.Typography variant="h6" align="center" gutterBottom>
								Upload what the food will look like!
							</ui.Typography>
						</ui.Grid>
						<ui.Grid item sm={10} xs={12}>
							<MultiImageInput
								images={images}
								setImages={setImages}
								cropConfig={{ crop, ruleOfThirds: true }}
								inputId
							/>
						</ui.Grid>
					</ui.Grid>

					{/* upload recipe instructions image */}
					<ui.Grid container item justify="center">
						<ui.Grid item xs={12}>
							<ui.Typography variant="h6" align="center" gutterBottom>
								Upload recipe instructions here!
							</ui.Typography>
						</ui.Grid>
						<ui.Grid item sm={10} xs={12}>
							<MultiImageInput
								images={recipeImg}
								setImages={setRecipeImg}
								allowCrop={false}
								inputId
							/>
						</ui.Grid>
					</ui.Grid>

					<ui.Grid container item justify="center">
						<ui.Grid item sm={10} xs={12}>
							<ui.Button
								variant="outlined"
								fullWidth
								onClick={() => handleClickOpenConfirm()}
							>
								Upload
							</ui.Button>
						</ui.Grid>
						{/* {recipeName == "" || uploadedImages == [] || videoID == "" ? ( */}
						{recipeName == "" ||
						uploadedImages == [] ||
						uploadedRecipeImgs == [] ||
						videoID == "" ? (
							<ui.Dialog
								disableBackdropClick
								disableEscapeKeyDown
								open={openConfirm}
								onClose={handleCloseConfirm}
							>
								<ui.DialogActions>
									<h4>Please fill in all the required information</h4>
									<ui.Button onClick={handleCloseConfirm} color="primary">
										Back
									</ui.Button>
								</ui.DialogActions>
							</ui.Dialog>
						) : (
							<ui.Dialog
								disableBackdropClick
								disableEscapeKeyDown
								open={openConfirm}
								onClose={handleCloseConfirm}
							>
								<ui.DialogActions>
									<h4>Data ready to be stored!</h4>
									<ui.Button onClick={handleCloseConfirm} color="primary">
										Cancel
									</ui.Button>
									<ui.Button onClick={() => upload()} color="primary">
										Confirm
									</ui.Button>
								</ui.DialogActions>
							</ui.Dialog>
						)}
					</ui.Grid>
				</ui.Grid>
				<div className={styles.nav}>
					<Navbar />
				</div>
			</React.Fragment>
		</div>
	);
};

export default UploadForm;
