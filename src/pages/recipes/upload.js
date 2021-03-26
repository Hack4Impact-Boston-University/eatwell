import React, {useState} from 'react'
import * as ui from '@material-ui/core'
import * as firebase from 'firebase'
import 'firebase/firestore'
import initFirebase from '../../utils/auth/initFirebase'
import { DropzoneArea } from 'material-ui-dropzone'
import { PictureAsPdf, Router } from '@material-ui/icons'
import Navbar from "../../components/Navbar";
import styles from '../../styles/Home.module.css'
import useSWR from "swr";
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import InboxIcon from '@material-ui/icons/Inbox';
import StarIcon from '@material-ui/icons/Star';
import SendIcon from '@material-ui/icons/Send';
import DraftsIcon from '@material-ui/icons/Send';
import MultiImageInput from 'react-multiple-image-input';
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import {AppBar,Tabs,Tab,InputLabel,MenuItem} from "@material-ui/core";

import {getUserFromCookie} from "../../utils/cookies";
import { useRouter } from 'next/router';

initFirebase()

const handlePreviewIcon = (fileObject, classes) => {
    const iconProps = {
      className : classes.image,
    }
    return <PictureAsPdf {...iconProps} />
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
    const [recipeName, setRecipeName] = useState('')
    const [videoID, setVideoID] = useState('')
    const [pdfFile, setPdfFile] = useState('')
    const [description, setDescription] = useState('')
    const [videoSkill, setVideoSkill] = useState('')
    const [skillName, setSkillName] = useState('')
    const [tipName, setTipName] = useState('')
    const [videoTip, setVideoTip] = useState('')
    const [images, setImages] = useState({});
    const [openConfirm, setOpenConfirm] = React.useState(false);
    var uploadedImages = []

    const handleChangeToggle = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };
    
    const router = useRouter();

    // skills
    const { data: skills } = useSWR(`/api/programs/getAllSkills`, fetcher);
    const [skill, setSkill] = React.useState('');
    const [openSkill, setOpenSkill] = React.useState(false);
  
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

        firebase.firestore().collection('skills').doc(id).set({skillID:id, skillName:name, url:videoUrl+link})
        alert("successfully added new skill!");
        setSkillName('');
        setVideoSkills('');
        setOpenSkill(false);
    };

    // tips
    const { data: tips } = useSWR(`/api/programs/getAllTips`, fetcher);
    const [tip, setTip] = React.useState('');
    const [openTip, setOpenTip] = React.useState(false);
      
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

        firebase.firestore().collection('tips').doc(id).set({skillID:id, skillName:name, url:videoUrl+link})
        alert("successfully added new tip!");
        setTipName('');
        setVideoTip('');
        setOpenTip(false);
    };    



       const handleSubmitDeleteUser = () => {
    firebase.firestore().collection("users").doc(currentUser).delete();
    setOpenDeleteUser(false);
    alert("successfully deleted the user.");
  };

    const crop = {
        unit: '%',
        aspect: 4 / 3,
        width: '100'
    };

    const handleClickOpenConfirm = () => {
        setOpenConfirm(true);
    };
    
    const handleCloseConfirm = () => {        
        setOpenConfirm(false);
    };
    
    function upload() {

        const videoUrl = "https://player.vimeo.com/video/"

        var recipe = recipeName.toLowerCase()
        recipe = recipe.replace(/ /g, "_")
        
        var i;
        var uploadedImages = Object.values(images);

        var document = firebase.firestore().collection('recipes').doc();
        var data = {
            id:document.id,
            nameOfDish: recipeName,
            description: description,
            images: uploadedImages,
            videoRecipe: videoUrl + videoID,
            pdfRecipe: recipe+".pdf",
            dateUploaded: Date.now(),
            // videoSkills: skill,
            // videoTips: tips,
            numRatings: 1,
            avgRating: 5
        }

        document.set(data)
        firebase.storage().ref().child(recipe+".pdf").put(pdfFile).on(firebase.storage.TaskEvent.STATE_CHANGED, {
            'complete': function() {
            }
        })
        for (i = 0; i < uploadedImages.length ; i++) {
            firebase.storage().ref().child(recipe+i+".jpg").putString(uploadedImages[i], 'data_url').on(firebase.storage.TaskEvent.STATE_CHANGED, {
                'complete': function() {
                }
            })
        }

        setRecipeName('')
        setVideoID('')
        setPdfFile('')
        setDescription('')
        setVideoSkill('')
        setVideoTip('')
        setImages({});
        setOpenConfirm(false);
    }

	if(getUserFromCookie() && !("firstname" in getUserFromCookie())) {
		router.push("/profile/makeProfile");
		return (<div></div>);
	}

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
                <ui.Typography align="center" variant="h6" gutterBottom>
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
                        <InputLabel id="demo-simple-select-label">Skills</InputLabel>
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
                        <InputLabel id="demo-simple-select-label">Tips</InputLabel>
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

                    <ui.Grid item xs={12} sm={6}>
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
                        <MultiImageInput
                            images={images}
                            setImages={setImages}
                            cropConfig={{ crop, ruleOfThirds: true }}
                            inputId
                        />
                    </ui.Grid>

                    <ui.Grid item xs={12} sm={6}>
                        <DropzoneArea
                            accept="application/pdf"
                            maxFileSize={10485760}
                            dropzoneText="Click to select or drag and drop recipe PDF"
                            filesLimit={1}
                            getPreviewIcon={handlePreviewIcon}
                            onChange={(files) => setPdfFile(files[0])}
                        />
                    </ui.Grid>
                    
                    <ui.Grid item xs={12}>
                        <ui.Button variant="outlined" fullWidth onClick={() => handleClickOpenConfirm()}>
                            Upload
                        </ui.Button>
                        {(recipeName==''||uploadedImages==[]||videoID=='') ? 
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
                            :
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
                        }
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
                            value={skillName}
                            label="Skill name"
                            onChange={(e) => setSkillName(e.target.value)}
                            fullWidth
                            variant="outlined"
                        />
                        <ui.TextField
                            value={videoSkill}
                            label="Vimeo Skill Video ID"
                            onChange={(e) => setVideoSkill(e.target.value)}
                            fullWidth
                            variant="outlined"
                        />
                        <ui.Button onClick={() => handleSubmitSkill()} variant="contained" color="primary" disableElevation>
                            Submit Skill
                        </ui.Button>
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
                            value={tipName}
                            label="Tip name"
                            onChange={(e) => setTipName(e.target.value)}
                            fullWidth
                            variant="outlined"
                        />
                        <ui.TextField
                            value={videoTip}
                            label="Vimeo Tip Video ID"
                            onChange={(e) => setVideoTip(e.target.value)}
                            fullWidth
                            variant="outlined"
                        />
                        <ui.Button onClick={() => handleSubmitTip()} variant="contained" color="primary" disableElevation>
                            Submit Tip 
                        </ui.Button>
                    </ui.Grid>
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

            {/* <div className={styles.nav}>
                <Navbar/>
            </div> */}
        </React.Fragment>
        </div>
    )
}

export default UploadForm