import React, { useState, useEffect } from "react";
import * as ui from "@material-ui/core";
import * as firebase from "firebase";
import "firebase/firestore";
import initFirebase from "../../utils/auth/initFirebase";
import { DropzoneArea } from "material-ui-dropzone";
import { PictureAsPdf, Router, ShowChart } from "@material-ui/icons";
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
import DeleteIcon from "@material-ui/icons/Delete";
import SwipeableViews from "react-swipeable-views";
import PropTypes from "prop-types";
import MultiImageInput from "react-multiple-image-input";
import * as _ from 'underscore'

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
	const [skills, setSkills] = React.useState([])
  	const [tips, setTips] = React.useState([])
	const { data: skillsDic } = useSWR(`/api/skills/getAllSkillsDic`, fetcher);
  	const { data: tipsDic } = useSWR(`/api/tips/getAllTipsDic`, fetcher);
	const [value, setValue] = React.useState(0);
	const theme = ui.useTheme();

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
	const [recipeName, setRecipeName] = useState("");
	const [videoID, setVideoID] = useState("");
	const [description, setDescription] = useState("");
	const [skill, setSkill] = React.useState('');
	const [tip, setTip] = React.useState('');
	const [images, setImages] = useState({});
	const [recipeImgs, setRecipeImgs] = useState({});
	const [nutritionalImgs, setNutritionalImgs] = useState({});
	const [descriptionIngredients, setDescriptionIngredients] = useState("");
	const [recipeFact, setRecipeFact] = useState("");
	const [surveyURL, setSurveyURL] = useState("");
	const [openConfirm, setOpenConfirm] = React.useState(false);
	var uploadedImages = [];
	var uploadedRecipeImgs = [];
	var uploadedNutritionalImgs = [];
	const [selectedRecipeImages, setSelectedRecipeImages] = useState([]);
	const [uploadedRecipeImagesURL, setUploadedRecipeImagesURL] = useState([]);
	const [selectedNutritionalImages, setSelectedNutritionalImages] = useState([]);
	const [uploadedNutritionalURL, setUploadedNutritionalURL] = useState([]);

	const handleRecipeImagesChange = (e) => {
		if (e.target.files) {
			const filesArray = Array.from(e.target.files).map((file) =>
				URL.createObjectURL(file)
			)
			setSelectedRecipeImages((prevImages) => prevImages.concat(filesArray));

			for (var i = 0; i < e.target.files.length; i++) {
				recipeImgs[Object.values(recipeImgs).length] = e.target.files[i]
				setRecipeImgs(recipeImgs)
			}
		};
	};

	const renderRecipeImages = (source) => {
		return source.map((photo) => {
			return (
				<div float="left">
					<img height="200px" display="block" src={photo} alt="" key={photo} />
					<ui.IconButton onClick={() => deleteRecipeImage(photo)}> <DeleteIcon /> </ui.IconButton>
				</div>
			)
		});
	};

	const deleteRecipeImage = (photo) => {
		if (photo) {
			setSelectedRecipeImages(selectedRecipeImages.filter(function(x) { 
				return x !== photo
			}))
		}
	}

	const handleNutritionalChange = (e) => {
		if (e.target.files) {
			const filesArray = Array.from(e.target.files).map((file) =>
				URL.createObjectURL(file)
			)
			setSelectedNutritionalImages((prevImages) => prevImages.concat(filesArray));
			for (var i = 0; i < e.target.files.length; i++) {
				nutritionalImgs[Object.values(nutritionalImgs).length] = e.target.files[i]
				setNutritionalImgs(nutritionalImgs)
			}
		};
	};

	const renderNutritional = (source) => {
		return source.map((photo) => {
			return (
				<div float="left">
					<img height="200px" display="block" src={photo} alt="" key={photo} />
					<ui.IconButton onClick={() => deleteNutritional(photo)}> <DeleteIcon /> </ui.IconButton>
				</div>
			)
		});
	};

	const deleteNutritional = (photo) => {
		if (photo) {
			setSelectedNutritionalImages(selectedNutritionalImages.filter(function(x) { 
				return x !== photo
			}))
		}
	}

	async function upload() {
		var recipe = recipeName.toLowerCase();
		recipe = recipe.replace(/ /g, "_");

		var i;
		var uploadedImages = Object.values(images);
		var uploadedRecipeImgs = Object.values(recipeImgs);
		var uploadedNutritionalImgs = Object.values(nutritionalImgs);

		var document = firebase.firestore().collection("recipes").doc();
		
		for (i = 0; i < uploadedImages.length; i++) {
			if (uploadedImages[i].length > 1048576) {
				var img = resizebase64(uploadedImages[i], 486, 720);
				uploadedImages[i] = img
			}
			firebase
				.storage()
				.ref()
				.child(document.id + i + ".jpg")
				.putString(uploadedImages[i], "data_url")
				.on(firebase.storage.TaskEvent.STATE_CHANGED, {
					complete: function () {},
				});
		}

		for (i = 0; i < uploadedRecipeImgs.length; i++) {
			firebase.storage().ref().child(document.id + i + ".pdf")
			.put(uploadedRecipeImgs[i]).on(firebase.storage.TaskEvent.STATE_CHANGED, {
				complete: function () {},
			});
			uploadedRecipeImagesURL[i] = document.id + i + ".pdf"
			setUploadedRecipeImagesURL(uploadedRecipeImagesURL)
		}

		for (i = 0; i < uploadedNutritionalImgs.length; i++) {
			firebase.storage().ref().child(document.id + i + ".png")
			.put(uploadedNutritionalImgs[i]).on(firebase.storage.TaskEvent.STATE_CHANGED, {
				complete: function () {},
			});
			uploadedNutritionalURL[i] = document.id + i + ".png"
			setUploadedNutritionalURL(uploadedNutritionalURL)
		}

		var data = {
			id: document.id,
			nameOfDish: recipeName,
			description: description,
			descriptionIngredients: descriptionIngredients,
			recipeFact: recipeFact,
			surveyURL: surveyURL.split('?')[0] + "?embedded=true",
			videoRecipe: videoID,
			images: uploadedImages,
			recipeImgs: uploadedRecipeImagesURL,
			nutritionalImgs: uploadedNutritionalURL,
			dateUploaded: Date.now(),
			videoSkills: skill,
			videoTips: tip,
			numRatings: 1,
			avgRating: 5,
			numFavorites: 0,
		};

		document.set(data);

		setRecipeName("");
		setVideoID("");
		setSkill("");
		setTip("");
		setDescription("");
		setDescriptionIngredients("");
		setRecipeFact("");
		setSurveyURL("");
		setImages({});
		setRecipeImgs({});
		setNutritionalImgs({});
		setOpenConfirm(false);
		setSelectedRecipeImages([]);
		setUploadedRecipeImagesURL([]);
		uploadedRecipeImgs = [];
		setSelectedNutritionalImages([]);
		setUploadedNutritionalURL([]);
		uploadedNutritionalImgs = [];
	}

	// skill
    const [skillName, setSkillName] = useState('')
	const [videoSkill, setVideoSkill] = useState('')
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
        var uploadedImages = Object.values(imagesSkill);

        firebase.firestore().collection('skills').doc(id).set({
            skillID:id,
            skillName:name,
            url:videoSkill,
            dateUploaded: Date.now(),
            images: uploadedImages,
            numRatings: 1,
            avgRating: 5,
			numFavorites: 0,
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
		setOpenConfirm(false);
    };

    // tip
	const [tipName, setTipName] = useState('')
    const [videoTip, setVideoTip] = useState('')
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
        var uploadedImages = Object.values(imagesTip);

        firebase.firestore().collection('tips').doc(id).set({
            tipID:id,
            tipName:name,
            url:videoTip,
            dateUploaded: Date.now(),
            images: uploadedImages,
            numRatings: 1,
            avgRating: 5,
			numFavorites: 0
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
		setOpenConfirm(false);
    };

	useEffect(() => {
		const userData = getUserFromCookie();

		if (!userData || "code" in userData || userData["role"] != "admin") {
			router.push("/");
		} else if (!("firstname" in userData)) {
			router.push("/profile/makeProfile");
		}
	});

	if (_.isEqual(skills,[]) || !skillsDic || _.isEqual(tips,[]) || !tipsDic) {
		if (!skillsDic) {
			return "Loading skillsDic...";
		} if (!tipsDic) {
			return "Loading tipsDic...";
		}
		setSkills(Object.keys(skillsDic).map(function (key) {
			return skillsDic[key];
		}));
		setTips(Object.keys(tipsDic).map(function (key) {
			return tipsDic[key];
		}));
		if (_.isEqual(skills,[])) {
			return "Loading skills...";
		} if (_.isEqual(tips,[])) {
			return "Loading tips...";
		}
	}

	return (
		<div className={styles.container4}>
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
							placeholder="for example: 76979871"
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
					<ui.Grid item xs={12} sm={6}>
						<ui.TextField
							value={descriptionIngredients}
							label="Ingredients / Allergens"
							required={true}
							multiline
							onChange={(e) => setDescriptionIngredients(e.target.value)}
							fullWidth
							variant="outlined"
						/>
					</ui.Grid>
					<ui.Grid item xs={12} sm={6}>
						<ui.TextField
							value={recipeFact}
							label="Recipe Fact"
							required={true}
							multiline
							onChange={(e) => setRecipeFact(e.target.value)}
							fullWidth
							variant="outlined"
						/>
					</ui.Grid>
					<ui.Grid item xs={12}>
						<ui.TextField
							value={surveyURL}
							label="Survey URL"
							placeholder="for example: https://docs.google.com/forms/d/e/1FAIpQLSeS3NqouOsyK3_HN5PYCVguszD6pUyIv5w5RPIS77cwrqNaVg/viewform?usp=sf_link"
							multiline
							onChange={(e) => setSurveyURL(e.target.value)}
							fullWidth
							variant="outlined"
						/>
					</ui.Grid>
					{/* upload recipe result image */}
					<ui.Grid container item justify="center">
						<ui.Grid item xs={12}>
							<ui.Typography variant="h6" align="center" gutterBottom>
								Upload what the food will look like! (cover photo)
							</ui.Typography>
						</ui.Grid>
						<ui.Grid item sm={10} xs={12}>
							<MultiImageInput
								images={images}
								setImages={setImages}
								cropConfig={{ crop }}
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
							<input type="file" id="file" accept="image/*" multiple onChange={handleRecipeImagesChange} />
							<div className="result">{renderRecipeImages(selectedRecipeImages)}</div>
						</ui.Grid>
					</ui.Grid>
					{/* upload recipe result image */}
					<ui.Grid container item justify="center">
						<ui.Grid item xs={12}>
							<ui.Typography variant="h6" align="center" gutterBottom>
								Upload Nutritional Facts!
							</ui.Typography>
						</ui.Grid>
						<ui.Grid item sm={10} xs={12}>
							<input type="file" id="file" accept="image/*" multiple onChange={handleNutritionalChange} />
							<div className="result">{renderNutritional(selectedNutritionalImages)}</div>
						</ui.Grid>
					</ui.Grid>
					<ui.Grid container item justify="center">
						<ui.Grid item sm={10} xs={12}>
							<ui.Button variant="outlined" fullWidth onClick={() => handleClickOpenConfirm()}>
								UPLOAD
							</ui.Button>
						</ui.Grid>
						{recipeName == "" ||
						videoID == [] ||
						descriptionIngredients == "" ||
						recipeFact == "" ||
						_.isEmpty(images) ||
						_.isEmpty(recipeImgs) ||
						_.isEmpty(nutritionalImgs) ? (
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
							cropConfig={{ crop }}
							inputId
							max = {1}
						/>
					</ui.Grid>
					<ui.Grid container item justify="center">
						<ui.Grid item sm={10} xs={12}>
							<ui.Button variant="outlined" fullWidth onClick={() => handleClickOpenConfirm()}>
								Submit Skill
							</ui.Button>
						</ui.Grid>
						{skillName == "" ||
						videoSkill == "" ||
						_.isEmpty(imagesSkill) ? (
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
									<ui.Button onClick={() => handleSubmitSkill()} color="primary">
										Confirm
									</ui.Button>
								</ui.DialogActions>
							</ui.Dialog>
						)}
					</ui.Grid>
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
							cropConfig={{ crop }}
							inputId
							max = {1}
						/>
					</ui.Grid>
					<ui.Grid container item justify="center">
						<ui.Grid item sm={10} xs={12}>
							<ui.Button variant="outlined" fullWidth onClick={() => handleClickOpenConfirm()}>
								Submit Tip
							</ui.Button>
						</ui.Grid>
						{tipName == "" ||
						videoTip == "" ||
						_.isEmpty(imagesTip) ? (
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
									<ui.Button onClick={() => handleSubmitTip()} color="primary">
										Confirm
									</ui.Button>
								</ui.DialogActions>
							</ui.Dialog>
						)}
					</ui.Grid>
				</ui.Grid>
            </TabPanel>

			<div className={styles.nav}>
				<Navbar currentPage={6}/>
				<AppBar position="static" color="default">
					<Tabs
						value={value}
						onChange={handleChangeToggle}
						indicatorColor="primary"
						textColor="primary"
						variant="fullWidth"
						aria-label="wrapped label tabs example"
					>
						<Tab label="Upload Recipes" {...a11yProps(0)} />
						<Tab label="Upload Skills" {...a11yProps(1)} />
						<Tab label="Upload Tips" {...a11yProps(2)} />
					</Tabs>
				</AppBar>
			</div>
		</div>
	);
};

export default UploadForm;
