import React, { useState, useEffect } from "react";
import * as ui from "@material-ui/core";
import * as firebase from "firebase";
import "firebase/firestore";
import initFirebase from "../../utils/auth/initFirebase";
import { DropzoneArea } from "material-ui-dropzone";
import { PictureAsPdf, Router } from "@material-ui/icons";
import Navbar from "../../components/Navbar";
import useSWR from "swr";
import styles from "../../styles/Home.module.css";
import { Alert } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import {MenuItem,AppBar,Tabs,Tab,InputLabel} from "@material-ui/core";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import InboxIcon from "@material-ui/icons/Inbox";
import StarIcon from "@material-ui/icons/Star";
import SendIcon from "@material-ui/icons/Send";
import DraftsIcon from "@material-ui/icons/Send";
import SwipeableViews from "react-swipeable-views";
import PropTypes from "prop-types";
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
          <ui.Box p={3}>
            <ui.Typography>{children}</ui.Typography>
          </ui.Box>
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

const fetcher = async (...args) => {
    const res = await fetch(...args);
    return res.json();
};

const UploadForm = () => {
	const [value, setValue] = React.useState(0);
	const theme = ui.useTheme();
	const [recipeName, setRecipeName] = useState("");
	const [videoID, setVideoID] = useState("");
	const [recipeImg, setRecipeImg] = useState({});
	const [description, setDescription] = useState("");
	const [videoSkill, setVideoSkill] = useState('')
    const [skillName, setSkillName] = useState('')
    const [tipName, setTipName] = useState('')
    const [videoTip, setVideoTip] = useState('')
	const [images, setImages] = useState({});
	const [nutrionalImgs, setNutrionalImgs] = useState({});
	const [openConfirm, setOpenConfirm] = React.useState(false);
	var uploadedRecipeImgs = [];
	var uploadedImages = [];
	var uploadedNutrionalImgs = [];

	const handleChangeToggle = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };

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

	// recipe
	function upload() {
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
			videoRecipe: videoID,
			recipeImgs: uploadedRecipeNames,
			dateUploaded: Date.now(),
			videoSkills: videoSkill,
			videoTips: videoTip,
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
		setVideoSkill("");
		setVideoTip("");
		setImages({});
		setOpenConfirm(false);
	}

	// skill
    const { data: skills } = useSWR(`/api/skills/getAllSkills`, fetcher);
    const [skill, setSkill] = React.useState('');
    const [openSkill, setOpenSkill] = React.useState(false);
    const [descriptionSkill, setDescriptionSkill] = useState('')
    const [imagesSkill, setImagesSkill] = useState({});

    const handleChangeSkill = (event) => {
      setSkill(event.target.value);
    };
  
    const handleCloseSkill = () => {
      setOpenSkill(false);
    };
  
    const handleOpenSkill = () => {
      setOpenSkill(true);
    };

    const handleSubmitSkill = () => {
        const db = firebase.firestore();
        const ref = db.collection('skills').doc();
        const id = ref.id;
        const name = skillName;
        const link = videoSkill;
        const videoUrl = "https://player.vimeo.com/video/"
        var uploadedImages = Object.values(imagesSkill);

        firebase.firestore().collection('skills').doc(id).set({
            skillID:id,
            skillName:name,
            url:videoUrl+link,
            dateUploaded: Date.now(),
            images: uploadedImages,
            numRatings: 1,
            avgRating: 5
        })
        firebase.storage().ref().child(id+".jpg").putString(uploadedImages[0], 'data_url').on(firebase.storage.TaskEvent.STATE_CHANGED, {
            'complete': function() {
            }
        })
        alert("successfully added new skill!");
        setSkillName('');
        setVideoSkill('');
        setDescriptionSkill('');
        setImagesSkill({});
        setOpenSkill(false);
    };

    // tip
    const { data: tips } = useSWR(`/api/tips/getAllTips`, fetcher);
    const [tip, setTip] = React.useState('');
    const [openTip, setOpenTip] = React.useState(false);
    const [descriptionTip, setDescriptionTip] = useState('')
    const [imagesTip, setImagesTip] = useState({});

    const handleChangeTip = (event) => {
      setTip(event.target.value);
    };
      
    const handleCloseTip = () => {
        setOpenTip(false);
    };
      
    const handleOpenTip = () => {
        setOpenTip(true);
    };

    const handleSubmitTip = () => {
        const db = firebase.firestore();
        const ref = db.collection('tips').doc();
        const id = ref.id;
        const name = tipName;
        const link = videoTip;
        const videoUrl = "https://player.vimeo.com/video/"
        var uploadedImages = Object.values(imagesTip);

        firebase.firestore().collection('tips').doc(id).set({
            tipID:id,
            tipName:name,
            url:videoUrl+link,
            dateUploaded: Date.now(),
            images: uploadedImages,
            numRatings: 1,
            avgRating: 5
        })
        firebase.storage().ref().child(id+".jpg").putString(uploadedImages[0], 'data_url').on(firebase.storage.TaskEvent.STATE_CHANGED, {
            'complete': function() {
            }
        })
        alert("successfully added new tip!");
        setTipName('');
        setVideoTip('');
        setDescriptionTip('');
        setImagesTip({});
        setOpenTip(false);
    };

	useEffect(() => {
		const userData = getUserFromCookie();

		if(!userData || "code" in userData || userData["role"] != "admin") {
			router.push("/");
		}
		else if(!("firstname" in userData)) {
			router.push("/profile/makeProfile");
		}
	});

	if (!skills || !tips) {
        if (!skills) {
          return "Loading skills...";
        } else {
          return "Loading tips...";
        }
    }

	return (
		<div className={styles.container}>
		<div
            style={{
            paddingTop: "5vh",
            width: "100%",
            minWidth: "29%",
            }}
        ></div>
		
		<React.Fragment>
			<SwipeableViews axis={theme.direction === "rtl" ? "x-reverse" : "x"} index={value} onChangeIndex={handleChangeIndex}>
                <TabPanel value={value} index={0} dir={theme.direction}>
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
                        <InputLabel id="demo-simple-select-label">Skill</InputLabel>
                        <ui.Select
                            autoWidth="false"
                            labelId="demo-controlled-open-select-label"
                            id="demo-controlled-open-select"
                            open={openSkill}
                            onClose={handleCloseSkill}
                            onOpen={handleOpenSkill}
                            value={skill}
                            onChange={handleChangeSkill}
                            >
                            <ui.MenuItem value="">
                                <em>None</em>
                            </ui.MenuItem>
                            {skills.map((skillss) =>
                                <MenuItem value={skillss["skillID"]}> {skillss["skillName"]} </MenuItem>)
                            }
                        </ui.Select>
                    </ui.Grid>        

                    <ui.Grid item xs={12} sm={6}>
                        <InputLabel id="demo-simple-select-label">Tip</InputLabel>
                        <ui.Select
                            autoWidth="false"
                            labelId="demo-controlled-open-select-label"
                            id="demo-controlled-open-select"
                            open={openTip}
                            onClose={handleCloseTip}
                            onOpen={handleOpenTip}
                            value={tip}
                            onChange={handleChangeTip}
                            >
                            <ui.MenuItem value="">
                                <em>None</em>
                            </ui.MenuItem>
                            {tips.map((tipss) =>
                                <MenuItem value={tipss["tipID"]}> {tipss["tipName"]} </MenuItem>)
                            }
                        </ui.Select>
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

					{/* upload recipe result image */}
					<ui.Grid container item justify="center">
						<ui.Grid item xs={12}>
							<ui.Typography variant="h6" align="center" gutterBottom>
								Upload Nutrional Facts!
							</ui.Typography>
						</ui.Grid>
						<ui.Grid item sm={10} xs={12}>
							<MultiImageInput
								images={nutrionalImgs}
								setImages={setNutrionalImgs}
								cropConfig={{ crop, ruleOfThirds: true }}
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
				</TabPanel>

                <TabPanel value={value} index={1} dir={theme.direction}>
                    <ui.Typography align="center" variant="h6" gutterBottom>
                        Upload New Skill
                    </ui.Typography>
                    <ui.Grid container spacing={3}>
                        <ui.Grid item xs={12} sm={6}>
                            <ui.TextField
                                required
                                value={skillName}
                                label="Skill name"
                                onChange={(e) => setSkillName(e.target.value)}
                                fullWidth
                                variant="outlined"
                            />
                        </ui.Grid>
                        <ui.Grid item xs={12} sm={6}>
                            <ui.TextField
                                required
                                value={videoSkill}
                                label="Vimeo Skill Video ID"
                                onChange={(e) => setVideoSkill(e.target.value)}
                                fullWidth
                                variant="outlined"
                            />
                        </ui.Grid>
                        <ui.Grid item xs={12} sm={6}>
                            <ui.TextField
                                value={descriptionSkill}
                                label="Skill Description"
                                multiline
                                onChange={(e) => setDescriptionSkill(e.target.value)}
                                fullWidth
                                variant="outlined"
                            />
                        </ui.Grid>
                        <ui.Grid item xs={12} sm={6}>
                            <MultiImageInput
                                images={imagesSkill}
                                setImages={setImagesSkill}
                                cropConfig={{ crop, ruleOfThirds: true }}
                                inputId
                                max = {1}
                            />
                        </ui.Grid>
                        <ui.Button onClick={() => handleSubmitSkill()} variant="contained" color="primary" disableElevation>
                            Submit Skill
                        </ui.Button>
                    </ui.Grid>
                </TabPanel>

                <TabPanel value={value} index={2} dir={theme.direction}>
                    <ui.Typography align="center" variant="h6" gutterBottom>
                        Upload New Tip
                    </ui.Typography>
                    <ui.Grid container spacing={3}>
                        <ui.Grid item xs={12} sm={6}>
                            <ui.TextField
                                required
                                value={tipName}
                                label="Tip name"
                                onChange={(e) => setTipName(e.target.value)}
                                fullWidth
                                variant="outlined"
                            />
                        </ui.Grid>
                        <ui.Grid item xs={12} sm={6}>
                            <ui.TextField
                                required
                                value={videoTip}
                                label="Vimeo Tip Video ID"
                                onChange={(e) => setVideoTip(e.target.value)}
                                fullWidth
                                variant="outlined"
                            />
                        </ui.Grid>
                        <ui.Grid item xs={12} sm={6}>
                            <ui.TextField
                                value={descriptionTip}
                                label="Tip Description"
                                multiline
                                onChange={(e) => setDescriptionTip(e.target.value)}
                                fullWidth
                                variant="outlined"
                            />
                        </ui.Grid>
                        <ui.Grid item xs={12} sm={6}>
                            <MultiImageInput
                                images={imagesTip}
                                setImages={setImagesTip}
                                cropConfig={{ crop, ruleOfThirds: true }}
                                inputId
                                max = {1}
                            />
                        </ui.Grid>
                        <ui.Button onClick={() => handleSubmitTip()} variant="contained" color="primary" disableElevation>
                            Submit Tip 
                        </ui.Button>
                    </ui.Grid>
                </TabPanel>
            </SwipeableViews>

			<div className={styles.nav}>
				<Navbar />

				<AppBar position="static" color="default">
					<Tabs
						value={value} onChange={handleChangeToggle}
						indicatorColor="primary" textColor="primary" variant="fullWidth" aria-label="full width tabs example"
					>
						<Tab label="Upload Recipes" {...a11yProps(0)} />
						<Tab label="Upload Skills" {...a11yProps(1)} />
						<Tab label="Upload Tips" {...a11yProps(2)} />
					</Tabs>
				</AppBar>
			</div>
		</React.Fragment>
		</div>
	);
};

export default UploadForm;