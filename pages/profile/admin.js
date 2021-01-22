import { useState, useEffect } from "react";
import {
  TextField, List, ListItemText, IconButton,
  Accordion, AccordionSummary, AccordionDetails,
  ListItemAvatar, Typography, Tabs, Tab, Box,
  Avatar, makeStyles, useTheme, Grid, ListItem,
  InputLabel, Input, MenuItem,
  Select, Button, Divider,
  Dialog, DialogActions, DialogContent, DialogTitle,
  FormControl,
  GridList
} from "@material-ui/core";
import { DropzoneArea } from 'material-ui-dropzone'
import DropDownMenu from "material-ui/DropDownMenu";
import useSWR from "swr";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import VisibilityIcon from '@material-ui/icons/Visibility';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AppBar from "@material-ui/core/AppBar";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import Navbar from "../../components/Navbar";
import styles from "../../styles/Home.module.css";
import * as firebase from "firebase";
import initFirebase from "../../utils/auth/initFirebase";
import { useRouter } from 'next/router';
import { PictureAsPdf, Router } from '@material-ui/icons'
import MultiImageInput from 'react-multiple-image-input';
import Slider from "react-slick";
import MultiSelect from "react-multi-select-component";
import _, { map } from 'underscore';
import {getUserFromCookie} from "../../utils/cookies";


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
      window.addEventListener("resize", handleResize);
      handleResize();
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);
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
          <Typography>{children}</Typography>
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

const handlePreviewIcon = (fileObject, classes) => {
  const iconProps = {
    className : classes.image,
  }
  return <PictureAsPdf {...iconProps} />
}

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    // maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  active: {
    backgroundColor: "gray"
  },
  noNum: {
    listStyle: "none"
  }
}));

const fetcher = async (...args) => {
  const res = await fetch(...args);
  return res.json();
};

export default function Admin() {

  const classes = useStyles();
  const [checked, setChecked] = React.useState([0]);
  const [search, setSearch] = React.useState("");
  const [value, setValue] = React.useState(1);
  const theme = useTheme();
  const { width } = useWindowSize();
  const [selectedProgramProgram, setSelectedProgramProgram] = useState({});
  // const [selectedUsersProgram, setSelectedUsersProgram] = useState({});
  const [currentUser, setCurrentUser] = React.useState("");
  const [uploadDate, setUploadDate] = React.useState("");
  const [searchRecipe, setSearchRecipe] = React.useState("");
  const [currentRecipe, setCurrentRecipe] = React.useState("");

  const { data: users } = useSWR(`/api/users/getAllUsers`, fetcher);
  const { data: programs } = useSWR(`/api/programs/getAllPrograms`, fetcher);
  const router = useRouter();
  const { data: recipes } = useSWR(`/api/recipes/getAllRecipes`, fetcher);
  const { data: recipesDic } = useSWR(`/api/recipes/getAllRecipesDic`, fetcher);
  const { data: usersDic } = useSWR(`/api/users/getAllUsersDic`, fetcher);
  const { data: programsTempDic } = useSWR(`/api/programs/getAllProgramsDic`, fetcher);
  const [programsDic, setProgramsDic] = React.useState("");
  useEffect(() => { setProgramsDic(programsTempDic)}, programsTempDic );
  
  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  const handleChangeToggle = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  // ---------------------- 0: ADMIN MANAGE USERS ----------------------

  // edit user role
  const [openRole, setOpenRole] = React.useState(false);
  const [role, setRole] = React.useState("");
  const [prevRole, setPrevRole] = React.useState("");

  const handleChangeRole = (event) => {
    setRole(event.target.value || "");
  };

  const handleClickOpenRole = (currentUser, prevRole) => {
    setOpenRole(true);
    setCurrentUser(currentUser);
    setPrevRole(prevRole);
  };

  const handleCloseRole = () => {
    setOpenRole(false);
  };

  const handleSubmitRole = (currentUser, currentUserRole) => {
    setRole(currentUserRole);
    firebase.firestore().collection("users").doc(currentUser).update({ role: currentUserRole });
    setOpenRole(false);
  };

  // edit user program
  const [openProgram, setOpenProgram] = React.useState(false);
  const [program, setProgram] = React.useState("");
  const [prevProgram, setPrevProgram] = React.useState("");

  const handleChangeProgram = (event) => {
    setProgram(event.target.value || "");
  };

  const handleClickOpenProgram = (currentUser,prev) => {
    setProgram(prev)
    setOpenProgram(true);
    setCurrentUser(currentUser);
    setPrevProgram(prev)
  };

  const handleCloseProgram = () => {
    setProgram("")
    setOpenProgram(false);
  };

  const handleSubmitProgram = (currentUser, currentUserProgram) => {
    
    if (prevProgram != undefined && programsDic[prevProgram] != undefined) {
      var index = Object.values(programsDic[prevProgram].programUsers).indexOf(currentUser);
      if (index.toString != "-1" && prevProgram != currentUserProgram) {
        delete programsDic[prevProgram].programUsers[index]
        firebase.firestore().collection("programs").doc(prevProgram).update({ programUsers: programsDic[prevProgram].programUsers });
        setProgramsDic(programsDic)
      }
    }
    
    if (!Object.values(programsDic[currentUserProgram].programUsers).includes(currentUser) && prevProgram != currentUserProgram) {
      programsDic[currentUserProgram].programUsers[Object.keys(programsDic[currentUserProgram].programUsers).length] = currentUser
      firebase.firestore().collection("programs").doc(currentUserProgram).update({ programUsers: programsDic[currentUserProgram].programUsers });
      setProgramsDic(programsDic)
    }

    if (prevProgram != currentUserProgram) {
      firebase.firestore().collection("users").doc(currentUser).update({ program: currentUserProgram, programName: programsDic[currentUserProgram].programName });
    }

    setProgramsDic(programsDic)
    setOpenProgram(false);
    setProgram("")

  };

  // delete user
  const [openDeleteUser, setOpenDeleteUser] = React.useState(false);

  const handleClickOpenDeleteUser = (currentUser) => {
    setOpenDeleteUser(true);
    setCurrentUser(currentUser);
  };

  const handleCloseDeleteUser = () => {
    setOpenDeleteUser(false);
  };

  const handleSubmitDeleteUser = () => {
    firebase.firestore().collection("users").doc(currentUser).delete();
    setOpenDeleteUser(false);
    alert("successfully deleted the user.");
  };


  // ---------------------- 1: ADMIN MANAGE PROGRAMS ----------------------
  const [searchProgram, setSearchProgram] = React.useState("");
  const [openAddProgram, setOpenAddProgram] = React.useState(false);
  const [addedProgram, setAddedProgram] = useState('')
  const [openDeleteProgram, setOpenDeleteProgram] = React.useState(false);
  const [viewRecipeImages, setViewRecipeImages] = React.useState([]);

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
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
    }`

  const handleClickOpenAddProgram = () => {
    setOpenAddProgram(true);
  };

  const handleCloseAddProgram = () => {
    setAddedProgram('');
    setOpenAddProgram(false);
  };

  const addProgram = () => {
    const db = firebase.firestore();
    const ref = db.collection('programs').doc();
    const id = ref.id;
    firebase.firestore().collection('programs').doc(id).set({programName:addedProgram,programID:id, programRecipes:[], programUsers:[]})
    alert("successfully added new program!");
    setAddedProgram('');
    setOpenAddProgram(false);
  };

  const handleClickOpenDeleteProgram = (disabled) => {
    setOpenDeleteProgram(true);
  };

  const handleCloseDeleteProgram = () => {
    setOpenDeleteProgram(false);
  };

  const deleteProgram = () => {
    firebase.firestore().collection('programs').doc(selectedProgramProgram.programID).delete()
    alert("successfully deleted the program.");
    setOpenDeleteProgram(false);
  };

  const [currentProgramRecipes, setCurrentProgramRecipes] = React.useState([]);
  const [openEditProgramRecipes, setOpenEditProgramRecipes] = React.useState(false);
  const [selectedRecipes, setSelectedRecipes] = useState([]);

  const handleClickOpenEditProgramRecipes = (programRecipesNow) => {
    setOpenEditProgramRecipes(true);
    var i;
    var originallySelected = []
    var temp = [];
    for (i = 0; i < recipes.length; i++) {
      if (selectedProgramProgram?.programRecipes.includes(recipes[i].id)) {
        originallySelected.push({label:recipes[i]?.nameOfDish,value:recipes[i].id})
      }
      temp.push({label:recipes[i]?.nameOfDish,value:recipes[i].id})
    }
    setSelectedRecipes(originallySelected)
    setCurrentProgramRecipes(temp)
  };

  const handleCloseEditProgramRecipes = () => {
    setCurrentProgramRecipes([])
    setOpenEditProgramRecipes(false);
  };

  const handleChangeEditProgramRecipes = (event) => {
    setProgramRecipes(event.target.value || "");
  };

  const handleSubmitEditProgramRecipes = () => {
    var i;
    var temp = [];
    for (i = 0; i < selectedRecipes.length; i++) {
      temp.push(selectedRecipes[i]?.value)
    }
    firebase.firestore().collection("programs").doc(selectedProgramProgram?.programID).update({ programRecipes: temp });
    setOpenEditProgramRecipes(false);
    setCurrentProgramRecipes([])
  };

  const [currentProgramUsers, setCurrentProgramUsers] = React.useState([]);
  const [openEditProgramUsers, setOpenEditProgramUsers] = React.useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleClickOpenEditProgramUsers = (programUsersNow) => {
    setOpenEditProgramUsers(true);
    var i;
    var originallySelected = []
    var temp = [];
    for (i = 0; i < users.length; i++) {
      if (users[i].role != "admin") {
        if (selectedProgramProgram?.programUsers.includes(users[i].id)) {
          originallySelected.push({label:(users[i]?.firstname+" "+users[i]?.lastname),value:users[i].id})
        }
        temp.push({label:(users[i]?.firstname+" "+users[i]?.lastname),value:users[i].id})
      }
    }
    setSelectedUsers(originallySelected)
    setCurrentProgramUsers(temp)
  };

  const handleCloseEditProgramUsers = () => {
    setCurrentProgramUsers([])
    setOpenEditProgramUsers(false);
  };

  const handleChangeEditProgramUsers = (event) => {
    setProgramUsers(event.target.value || "");
  };

  const handleSubmitEditProgramUsers = () => {
    var i;
    var temp = [];
    for (i = 0; i < selectedUsers.length; i++) {
      temp.push(selectedUsers[i]?.value)
    }
    firebase.firestore().collection("programs").doc(selectedProgramProgram?.programID).update({ programUsers: temp });
    setOpenEditProgramUsers(false);
    setCurrentProgramUsers([])
  };
  

  // ---------------------- 2: ADMIN MANAGE RECIPES ----------------------
  // edit recipe name
  const [recipeName, setRecipeName] = React.useState("");
  const [openRecipeName, setOpenRecipeName] = React.useState(false);
  
  const handleClickOpenRecipeName = (currentRecipe) => {
    setRecipeName(currentRecipe.nameOfDish)
    setOpenRecipeName(true);
    setCurrentRecipe(currentRecipe);
    var date = new Date()
    var dateUploaded = date.getFullYear().toString() + '/' +(date.getMonth()+1).toString() + '/' + date.getDate().toString()
    setUploadDate(dateUploaded)
  };

  const handleCloseRecipeName = () => {
    setOpenRecipeName(false);
  };

  const handleSubmitRecipeName = (currentRecipe) => {
    firebase.firestore().collection('recipes').doc(currentRecipe.id).update({nameOfDish:recipeName, dateUploaded: uploadDate})
    alert("successfully edited recipe name!");
    setRecipeName('');
    setOpenRecipeName(false);
  };

  // edit recipe description
  const [recipeDescription, setRecipeDescription] = React.useState("");
  const [openRecipeDescription, setOpenRecipeDescription] = React.useState(false);

  const handleClickOpenRecipeDescription = (currentRecipe) => {
    setRecipeDescription(currentRecipe.description)
    setOpenRecipeDescription(true);
    setCurrentRecipe(currentRecipe);
    var date = new Date()
    var dateUploaded = date.getFullYear().toString() + '/' +(date.getMonth()+1).toString() + '/' + date.getDate().toString()
    setUploadDate(dateUploaded)
  };

  const handleCloseRecipeDescription = () => {
    setOpenRecipeDescription(false);
  };

  const handleSubmitRecipeDescription = (currentRecipe) => {
    firebase.firestore().collection('recipes').doc(currentRecipe.id).update({description:recipeDescription, dateUploaded: uploadDate})
    alert("successfully edited recipe description!");
    setRecipeDescription('');
    setOpenRecipeDescription(false);
  };

  // edit recipe images
  const [recipeImages, setRecipeImages] = React.useState([]);
  const [openRecipeImages, setOpenRecipeImages] = React.useState(false);
  const crop = {
    unit: '%',
    aspect: 4 / 3,
    width: '100'
  };

  const handleClickOpenRecipeImages = (currentRecipe) => {
    setRecipeImages(currentRecipe.images)
    setOpenRecipeImages(true);
    setCurrentRecipe(currentRecipe);
    var date = new Date()
    var dateUploaded = date.getFullYear().toString() + '/' +(date.getMonth()+1).toString() + '/' + date.getDate().toString()
    setUploadDate(dateUploaded)
  };

  const handleClickOpenViewRecipeImages = (currentRecipe) => {
    setViewRecipeImages(recipesDic[currentRecipe].images)
    setOpenRecipeImages(true);
    setCurrentRecipe(currentRecipe);
  };

  const handleCloseRecipeImages = () => {
    setOpenRecipeImages(false);
  };

  const handleSubmitRecipeImages = (currentRecipe) => {
    firebase.firestore().collection('recipes').doc(currentRecipe.id).update({images:recipeImages, dateUploaded: uploadDate})
    alert("successfully edited recipe images!");
    setRecipeImages([]);
    setOpenRecipeImages(false);
  };

  // view / edit recipe pdf
  const [recipePdf, setRecipePdf] = React.useState("");
  const [pdfFile, setPdfFile] = useState('')
  const [pdf_url, setPdfURL] = useState('')
  const [openRecipePdf, setOpenRecipePdf] = React.useState(false);
  const [openViewRecipePdf, setOpenViewRecipePdf] = React.useState(false);

  const handleClickOpenViewRecipePdf = (currentRecipe) => {
    setRecipePdf(currentRecipe.pdfRecipe)
    setOpenViewRecipePdf(true);
    setCurrentRecipe(currentRecipe);
    var date = new Date()
    var dateUploaded = date.getFullYear().toString() + '/' +(date.getMonth()+1).toString() + '/' + date.getDate().toString()
    firebase.storage().ref().child(currentRecipe.pdfRecipe).getDownloadURL().then(function(url) {
      setPdfURL(url)
    })
    setUploadDate(dateUploaded)
  };

  const handleCloseViewRecipePdf = () => {
    setOpenViewRecipePdf(false);
  };

  const handleClickOpenRecipePdf = (currentRecipe) => {
    setRecipePdf(currentRecipe.pdfRecipe)
    setOpenRecipePdf(true);
    setCurrentRecipe(currentRecipe);
    var date = new Date()
    var dateUploaded = date.getFullYear().toString() + '/' +(date.getMonth()+1).toString() + '/' + date.getDate().toString()
    setUploadDate(dateUploaded)
  };

  const handleCloseRecipePdf = () => {
    setOpenRecipePdf(false);
  };

  const handleSubmitRecipePdf = (currentRecipe) => {
    firebase.storage().ref().child(recipePdf).delete().then(function() {}).catch(function(error) {});
    firebase.storage().ref().child(currentRecipe.id+".pdf").put(pdfFile).on(firebase.storage.TaskEvent.STATE_CHANGED, {
      'complete': function() {
      }
    })
    firebase.firestore().collection('recipes').doc(currentRecipe.id).update({pdfRecipe:recipePdf, dateUploaded: uploadDate})
    alert("successfully edited recipe pdf!");
    setRecipePdf('');
    setOpenRecipePdf(false);
  };

  // edit recipe video
  const [recipeVideo, setRecipeVideo] = React.useState("");
  const [openViewRecipeVideo, setOpenViewRecipeVideo] = React.useState(false);
  const [openRecipeVideo, setOpenRecipeVideo] = React.useState(false);

  const handleClickOpenViewRecipeVideo = (currentRecipe) => {
    setRecipeVideo(currentRecipe.videoRecipe)
    setOpenViewRecipeVideo(true);
    setCurrentRecipe(currentRecipe);
    var date = new Date()
    var dateUploaded = date.getFullYear().toString() + '/' +(date.getMonth()+1).toString() + '/' + date.getDate().toString()
    setUploadDate(dateUploaded)
  };

  const handleCloseViewRecipeVideo = () => {
    setOpenViewRecipeVideo(false);
  };
  
  const handleClickOpenRecipeVideo = (currentRecipe) => {
    setRecipeVideo(currentRecipe.videoRecipe)
    setOpenRecipeVideo(true);
    setCurrentRecipe(currentRecipe);
    var date = new Date()
    var dateUploaded = date.getFullYear().toString() + '/' +(date.getMonth()+1).toString() + '/' + date.getDate().toString()
    setUploadDate(dateUploaded)
  };

  const handleCloseRecipeVideo = () => {
    setOpenRecipeVideo(false);
  };

  const handleSubmitRecipeVideo = (currentRecipe) => {
    firebase.firestore().collection('recipes').doc(currentRecipe.id).update({videoRecipe:recipeVideo, dateUploaded: uploadDate})
    alert("successfully edited recipe video!");
    setRecipeVideo('');
    setOpenRecipeVideo(false);
  };

  // edit recipe skills
  const [recipeSkills, setRecipeSkills] = React.useState("");
  const [openViewRecipeSkills, setOpenViewRecipeSkills] = React.useState(false);
  const [openRecipeSkills, setOpenRecipeSkills] = React.useState(false);

  const handleClickOpenViewRecipeSkills = (currentRecipe) => {
    setRecipeSkills(currentRecipe.videoSkills)
    setOpenViewRecipeSkills(true);
    setCurrentRecipe(currentRecipe);
    var date = new Date()
    var dateUploaded = date.getFullYear().toString() + '/' +(date.getMonth()+1).toString() + '/' + date.getDate().toString()
    setUploadDate(dateUploaded)
  };

  const handleCloseViewRecipeSkills = () => {
    setOpenViewRecipeSkills(false);
  };
  
  const handleClickOpenRecipeSkills = (currentRecipe) => {
    setRecipeSkills(currentRecipe.videoSkills)
    setOpenRecipeSkills(true);
    setCurrentRecipe(currentRecipe);
    var date = new Date()
    var dateUploaded = date.getFullYear().toString() + '/' +(date.getMonth()+1).toString() + '/' + date.getDate().toString()
    setUploadDate(dateUploaded)
  };

  const handleCloseRecipeSkills = () => {
    setOpenRecipeSkills(false);
  };

  const handleSubmitRecipeSkills = (currentRecipe) => {
    firebase.firestore().collection('recipes').doc(currentRecipe.id).update({videoSkills:recipeSkills, dateUploaded: uploadDate})
    alert("successfully edited recipe skills!");
    setRecipeSkills('');
    setOpenRecipeSkills(false);
  };

  // edit recipe tips
  const [recipeTips, setRecipeTips] = React.useState("");
  const [openViewRecipeTips, setOpenViewRecipeTips] = React.useState(false);
  const [openRecipeTips, setOpenRecipeTips] = React.useState(false);

  const handleClickOpenViewRecipeTips = (currentRecipe) => {
    setRecipeTips(currentRecipe.videoTips)
    setOpenViewRecipeTips(true);
    setCurrentRecipe(currentRecipe);
    var date = new Date()
    var dateUploaded = date.getFullYear().toString() + '/' +(date.getMonth()+1).toString() + '/' + date.getDate().toString()
    setUploadDate(dateUploaded)
  };

  const handleCloseViewRecipeTips = () => {
    setOpenViewRecipeTips(false);
  };
  
  const handleClickOpenRecipeTips = (currentRecipe) => {
    setRecipeTips(currentRecipe.videoTips)
    setOpenRecipeTips(true);
    setCurrentRecipe(currentRecipe);
    var date = new Date()
    var dateUploaded = date.getFullYear().toString() + '/' +(date.getMonth()+1).toString() + '/' + date.getDate().toString()
    setUploadDate(dateUploaded)
  };

  const handleCloseRecipeTips = () => {
    setOpenRecipeTips(false);
  };

  const handleSubmitRecipeTips = (currentRecipe) => {
    firebase.firestore().collection('recipes').doc(currentRecipe.id).update({videoTips:recipeTips, dateUploaded: uploadDate})
    alert("successfully edited recipe skills!");
    setRecipeTips('');
    setOpenRecipeTips(false);
  };

  // delete recipe
  const [openDeleteRecipe, setOpenDeleteRecipe] = React.useState(false);

  const handleClickOpenDeleteRecipe = (currentRecipe) => {
    setOpenDeleteRecipe(true);
    setCurrentRecipe(recipesDic[currentRecipe].nameOfDish);
  };

  const handleCloseDeleteRecipe = () => {
    setOpenDeleteRecipe(false);
  };

  const handleSubmitDeleteRecipe = () => {
    firebase.firestore().collection("recipes").doc(currentRecipe).delete();
    setOpenDeleteRecipe(false);
    alert("successfully deleted the recipe.");
  };


  if (!users || !programs || !recipes || !usersDic || !recipesDic || !programsDic) {
    if (!users) {
      return "Loading users...";
    } else if (!programs) {
      return "Loading programs...";
    } else if (!recipes) {
      return "Loading recipes...";
    } else if (!usersDic) {
      return "Loading usersDic...";
    } else if (!recipesDic) {
      return "Loading recipesDic...";
    } else if (!programsDic) {
      return "Loading programsDic...";
    }
  }

  const emails = [];
  var i;
  for (i = 0; i < users.length; i++) {
    emails.push(users[i]["email"]);
  }

  const recipesList = [];
  var i;
  for (i = 0; i < recipes.length; i++) {
    recipesList.push(recipes[i]["nameOfDish"]);
  }

  const programsList = [];
  var i;
  for (i = 0; i < programs.length; i++) {
    programsList.push(programs[i]["programName"]);
  }

  const handleChange = (e) => {
    setSearch(e.target.value);
    const filteredNames = emails.filter((x) => {
      x?.includes(e.target.value);
    });
  };

  const handleChangeRecipe = (e) => {
    setSearchRecipe(e.target.value);
    const filteredNames = recipesList.filter((x) => {
      x?.includes(e.target.value);
    });
  };

  const handleChangeSearchProgram = (e) => {
    setSearchProgram(e.target.value);
    const filteredNames = programsList.filter((x) => {
      x?.includes(e.target.value);
    });
  };

  if(!("firstname" in getUserFromCookie())) {
    router.push("/profile/makeProfile");
    return (<div></div>);
  }

  return (
    <div className={classes.root}>
      <div
        style={{
          paddingTop: "10vh",
          width: "100%",
          minWidth: "29%",
        }}
      ></div>

      <SwipeableViews axis={theme.direction === "rtl" ? "x-reverse" : "x"} index={value} onChangeIndex={handleChangeIndex}>

        {/* ---------------------------- 0: ADMIN MANAGE USERS ---------------------------- */}
        <TabPanel value={value} index={0} dir={theme.direction}>
          <Grid container spacing={3}>
            <Grid item sm={5}>
              <TextField label="search email" value={search} onChange={handleChange}/>

              {users.map((value) => {
                if (value["email"]?.includes(search) || value["email"].toLowerCase()?.includes(search)) {
                  return (
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                        <ListItemAvatar>
                          <Avatar
                          // alt={`Avatar n°${value + 1}`}
                          // src={`/static/images/avatar/${value + 1}.jpg`}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={value?.firstname + " " + value?.lastname} secondary={value?.email}/>
                      </AccordionSummary>
                      <AccordionDetails>
                        <ol className={classes.noNum}>
                          <li>Phone: {value?.phone}</li>
                          {value?.role == "user" ? (
                          <li>Program: {programsDic[value?.program]?.programName}<IconButton onClick={() => handleClickOpenProgram(value.id, value?.program)}> <EditIcon /> </IconButton></li>)
                          : (<Grid></Grid>)}
                          <li>Role: {value?.role}<IconButton onClick={() => handleClickOpenRole(value.id, value?.role)}> <EditIcon /> </IconButton></li>
                          <li><IconButton onClick={() => handleClickOpenDeleteUser(value.id)}> <DeleteIcon /> </IconButton></li>
                        </ol>
                      </AccordionDetails>
                    </Accordion>
                  );
                }
              })}
            </Grid>
          </Grid>
          {currentUser && (
          <div>
            {/* --------------- edit user program --------------- */}
            <Dialog style={{backgroundColor: 'transparent'}} disableBackdropClick disableEscapeKeyDown open={openProgram} onClose={handleCloseProgram}>
              <DialogTitle>Edit User Program</DialogTitle>
              <DialogContent>
                <FormControl className={classes.formControl}>
                  <InputLabel id="demo-dialog-select-label"> Program </InputLabel>
                  <Select labelId="demo-dialog-select-label" id="demo-dialog-select" value={program} onChange={handleChangeProgram} input={<Input />}>
                    {programs.map((programss) =>
                      <MenuItem value={programss["programID"]}> {programss["programName"]} </MenuItem>)
                    }
                  </Select>
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseProgram} color="primary"> Cancel </Button>
                <Button onClick={() => handleSubmitProgram(currentUser, program)} color="primary"> Ok </Button>
              </DialogActions>
            </Dialog>

            {/* --------------- edit user role --------------- */}
            <Dialog style={{backgroundColor: 'transparent'}} disableBackdropClick disableEscapeKeyDown open={openRole} onClose={handleCloseRole}>
              <DialogTitle>Edit User Role</DialogTitle>
              <DialogContent>
                <FormControl className={classes.formControl}>
                  <InputLabel id="demo-dialog-select-label"> Role </InputLabel>
                  <Select labelId="demo-dialog-select-label" id="demo-dialog-select" value={role} onChange={handleChangeRole} input={<Input />}>
                    <MenuItem value={prevRole}>
                      <em></em>
                    </MenuItem>
                    <MenuItem value={"user"}>User</MenuItem>
                    <MenuItem value={"admin"}>Admin</MenuItem>
                  </Select>
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseRole} color="primary"> Cancel </Button>
                <Button onClick={() => handleSubmitRole(currentUser, role)} color="primary"> Ok </Button>
              </DialogActions>
            </Dialog>

            {/* --------------- delete user --------------- */}
            <Dialog style={{backgroundColor: 'transparent'}} disableBackdropClick disableEscapeKeyDown open={openDeleteUser} onClose={handleCloseDeleteUser}>
              <DialogTitle>Are you sure you want to delete the user: {usersDic[currentUser].firstname + " " + usersDic[currentUser].lastname}?</DialogTitle>
              <DialogTitle>Role: {usersDic[currentUser].role}</DialogTitle>                
              <DialogActions>
                <Button onClick={handleCloseDeleteUser} color="primary"> Cancel </Button>
                <Button onClick={() => handleSubmitDeleteUser()} color="primary"> Ok </Button>
              </DialogActions>
            </Dialog>
          </div>
        )}
        </TabPanel>

        {/* ---------------------------- 1: ADMIN MANAGE PROGRAMS ---------------------------- */}
        <TabPanel value={value} index={1} dir={theme.direction}>
          <Grid container spacing={3}>
            <Grid item sm={2}>
              <List dense>
                <ListItem key={"Add New Program"} button selected={true} onClick={() => setSelectedProgramProgram(value)}>
                  <Button variant="outlined" fullWidth onClick={() => handleClickOpenAddProgram()}> Add New Program </Button>
                </ListItem>

                <TextField label="search program" value={searchProgram} onChange={handleChangeSearchProgram}/>
                {programs.map((value) => {
                  if (value["programName"]?.includes(searchProgram) || value["programName"].toLowerCase()?.includes(searchProgram)) {
                    if (value.programName == selectedProgramProgram?.programName) {
                      return (
                        <Grid item>                      
                          <ListItem key={value?.programName} button selected={true}
                            onClick={() => setSelectedProgramProgram(value)}>
                            <ListItemText>{value?.programName}</ListItemText>
                          </ListItem>
                          <Divider light />
                        </Grid>);}
                    else {
                      return (
                        <Grid item>                      
                          <ListItem
                            key={value?.programName} button selected={false} classes={{ selected: classes.active }}
                            onClick={() => setSelectedProgramProgram(value)}>
                            <ListItemText>{value?.programName}</ListItemText>
                          </ListItem>
                          <Divider light />
                        </Grid>);}}})}
              </List>
            </Grid>

            <Grid item sm={5}>
              {_.isEqual(selectedProgramProgram, {}) ? <h4>Please select a program</h4> :
              <div> {/* ----------------------- delete program ----------------------- */}
                <ListItem key={"Delete Program"} button selected={true} onClick={() => setSelectedProgramProgram(selectedProgramProgram)}>
                  <Button variant="outlined" fullWidth onClick={() => handleClickOpenDeleteProgram()}>Delete Program </Button>
                </ListItem> </div>}

              {_.isEqual(selectedProgramProgram, {}) ? <h4></h4> :
              <div> {/* ----------------------- edit recipes list ----------------------- */}
                <List>
                  <ListItemText> Recipes List
                  <IconButton onClick={() => handleClickOpenEditProgramRecipes(selectedProgramProgram)}><EditIcon/></IconButton>
                  </ListItemText>
                </List> </div>}
              
              {selectedProgramProgram?.programRecipes != undefined ?
              selectedProgramProgram?.programRecipes.map((value) => {
                return (
                    <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                      <ListItemAvatar>
                        <Avatar
                        // alt={`Avatar n°${value + 1}`}
                        // src={`/static/images/avatar/${value + 1}.jpg`}
                        />
                      </ListItemAvatar>
                      <ListItemText primary={recipesDic[value]?.nameOfDish}/>
                    </AccordionSummary>
                    <AccordionDetails>
                        <ol className={classes.noNum}>
                          {/* ----------------------- display recipe name, description, date modified, rating, num ratings ----------------------- */}
                          {/* ----------------------- display images, display pdf, display / edit videos ----------------------- */}
                          <li>Name of recipe: {recipesDic[value]?.nameOfDish}</li>
                          <li>Description: {recipesDic[value]?.description}</li>
                          <li>Date last modified: {recipesDic[value]?.dateUploaded}</li>
                          <li>Rating: {recipesDic[value]?.avgRating}</li>
                          <li>Number of ratings: {recipesDic[value]?.numRatings}</li>
                          <li>Recipe images <IconButton onClick={() => handleClickOpenViewRecipeImages(value)}> <VisibilityIcon/> </IconButton></li>
                          <li>Recipe pdf <IconButton onClick={() => handleClickOpenViewRecipePdf(recipesDic[value])}> <VisibilityIcon/> </IconButton></li>
                          <li>Recipe video <IconButton onClick={() => handleClickOpenViewRecipeVideo(recipesDic[value])}> <VisibilityIcon/> </IconButton></li>
                          <li>Recipe skills <IconButton onClick={() => handleClickOpenViewRecipeSkills(recipesDic[value])}> <VisibilityIcon/> </IconButton></li>
                          <li>Recipe tips <IconButton onClick={() => handleClickOpenViewRecipeTips(recipesDic[value])}> <VisibilityIcon/> </IconButton></li>                          
                        </ol>
                      </AccordionDetails>
                  </Accordion>);
              }) : <Grid></Grid>}

              {_.isEqual(selectedProgramProgram, {}) ? <h4></h4> :
              <div> {/* ----------------------- edit users list ----------------------- */}
              <List>
                <ListItemText> Users List
                {/* <IconButton onClick={() => handleClickOpenEditProgramUsers(selectedProgramProgram)}><EditIcon/></IconButton> */}
                </ListItemText>
              </List> </div>}

              {selectedProgramProgram?.programUsers != undefined ?
              Object.values(selectedProgramProgram?.programUsers).map((value) => {
                return (
                    <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                      <ListItemAvatar>
                        <Avatar
                        // alt={`Avatar n°${value + 1}`}
                        // src={`/static/images/avatar/${value + 1}.jpg`}
                        />
                      </ListItemAvatar>
                      <ListItemText primary={usersDic[value]?.firstname + " " + usersDic[value]?.lastname}/>
                    </AccordionSummary>
                    <AccordionDetails>
                        <ol className={classes.noNum}>
                          {/* ----------------------- display recipe name, description, date modified, rating, num ratings ----------------------- */}
                          <li>Email: {usersDic[value]?.email}</li>
                          <li>Phone: {usersDic[value]?.phone}</li>
                          <li>Role: {usersDic[value]?.role}</li>
                        </ol>
                      </AccordionDetails>
                  </Accordion>
                  );}) : <Grid></Grid>}
            </Grid>
          </Grid>

          {/* edit program */}
          <Dialog disableBackdropClick disableEscapeKeyDown open={openAddProgram} onClose={handleCloseAddProgram}>
            <DialogActions>
              <h4>Add New Program</h4>
              <TextField value={addedProgram} label="New Program" multiline onChange={(e) => setAddedProgram(e.target.value)} fullWidth variant="outlined"/>
              <Button onClick={handleCloseAddProgram} color="primary"> Cancel </Button>
              <Button onClick={() => addProgram()} color="primary"> Confirm </Button>
            </DialogActions>
          </Dialog>
          <Dialog disableBackdropClick disableEscapeKeyDown open={openDeleteProgram} onClose={handleCloseDeleteProgram}>
            <DialogActions>
              <h4>Delete Program {selectedProgramProgram.programName} </h4>
              <Button onClick={handleCloseDeleteProgram} color="primary"> Cancel </Button>
              <Button onClick={() => deleteProgram()} color="primary"> Confirm </Button>
            </DialogActions>
          </Dialog>

          {/* view recipes list Dialog */}
          {selectedProgramProgram && (
            <Dialog disableBackdropClick disableEscapeKeyDown open={openEditProgramRecipes} onClose={handleCloseEditProgramRecipes}>
              <DialogTitle>Edit Recipes List for {selectedProgramProgram?.programName} </DialogTitle>
              <DialogContent>
                <FormControl className={classes.formControl}>
                  <MultiSelect options={currentProgramRecipes} value={selectedRecipes} onChange={setSelectedRecipes} labelledBy={"Select"}/>
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseEditProgramRecipes} color="primary"> Cancel </Button>
                <Button onClick={() => handleSubmitEditProgramRecipes()} color="primary"> Ok </Button>
              </DialogActions>
            </Dialog>
          )}
          {currentRecipe && (
            <Dialog disableBackdropClick disableEscapeKeyDown open={openRecipeImages} onClose={handleCloseRecipeImages}>
              <DialogTitle>View Recipe Images </DialogTitle>
              <DialogContent>
              <Grid container justify="center">
              {(viewRecipeImages == undefined || viewRecipeImages == []) ? 
                <h4>No images to show</h4> :
                <Grid item xs={9} >
                  <link rel="stylesheet" type="text/css" charset="UTF-8" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
                  <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
                  <style>{cssstyle}</style>
                  <Slider {...settings}>
                    {Object.values(viewRecipeImages).map((cell, index) => {
                      return <img className={classes.media} src={viewRecipeImages[index]}/>
                    })}
                  </Slider>
                </Grid>}
              </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseRecipeImages} color="primary"> Back </Button>
              </DialogActions>
            </Dialog>
          )}
          {currentRecipe && (
            <Dialog disableBackdropClick disableEscapeKeyDown open={openViewRecipePdf} onClose={handleCloseViewRecipePdf}>
              <DialogTitle>View Recipe Pdf</DialogTitle>
              <DialogContent>
                  {(pdf_url != "") ? 
                    <iframe src={pdf_url} width="100%" height={width} frameBorder="0" align="center" position="relative"></iframe>
                    : <h4>No pdf to display</h4>
                  }
                  <Button onClick={handleCloseViewRecipePdf} color="primary"> Back </Button>
              </DialogContent>
            </Dialog>
          )}
          {currentRecipe && (
            <Dialog disableBackdropClick disableEscapeKeyDown open={openViewRecipeVideo} onClose={handleCloseViewRecipeVideo}>
              <DialogTitle>View Recipe Video</DialogTitle>
              <DialogContent>
                  {(recipeVideo != "") ? 
                    <iframe position="fixed" src={recipeVideo} width="100%" height={(width*0.625)} frameBorder="0" align="center" position="sticky" allow="autoplay; fullscreen"></iframe>
                    : <h4>No recipe video to display</h4>
                  }
                  <Button onClick={handleCloseViewRecipeVideo} color="primary"> Back </Button>
              </DialogContent>
            </Dialog>
          )}
          {currentRecipe && (
            <Dialog disableBackdropClick disableEscapeKeyDown open={openViewRecipeSkills} onClose={handleCloseViewRecipeSkills}>
              <DialogTitle>View Recipe Skills</DialogTitle>
              <DialogContent>
                  {(recipeSkills != "") ? 
                    <iframe position="fixed" src={recipeSkills} width="100%" height={(width*0.625)} frameBorder="0" align="center" position="sticky" allow="autoplay; fullscreen"></iframe>
                    : <h4>No recipe skills to display</h4>
                  }
                  <Button onClick={handleCloseViewRecipeSkills} color="primary"> Back </Button>
              </DialogContent>
            </Dialog>
          )}
          {currentRecipe && (
            <Dialog disableBackdropClick disableEscapeKeyDown open={openViewRecipeTips} onClose={handleCloseViewRecipeTips}>
              <DialogTitle>View Recipe Tips</DialogTitle>
              <DialogContent>
                  {(recipeTips != "") ? 
                    <iframe position="fixed" src={recipeTips} width="100%" height={(width*0.625)} frameBorder="0" align="center" position="sticky" allow="autoplay; fullscreen"></iframe>
                    : <h4>No recipe tips to display</h4>
                  }
                  <Button onClick={handleCloseViewRecipeTips} color="primary"> Back </Button>
              </DialogContent>
            </Dialog>
          )}

          {/* edit users list Dialog */}
          {/* {selectedProgramProgram && (
            <Dialog disableBackdropClick disableEscapeKeyDown open={openEditProgramUsers} onClose={handleCloseEditProgramUsers}>
              <DialogTitle>Edit Users List for {selectedProgramProgram?.programName} </DialogTitle>
              <DialogContent>
                <FormControl className={classes.formControl}>
                  <div>
                    <MultiSelect
                      options={currentProgramUsers}
                      value={selectedUsers}
                      onChange={setSelectedUsers}
                      labelledBy={"Select"}
                    />
                  </div>
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseEditProgramUsers} color="primary"> Cancel </Button>
                <Button onClick={() => handleSubmitEditProgramUsers()} color="primary"> Ok </Button>
              </DialogActions>
            </Dialog>
          )} */}

        </TabPanel>

        {/* ---------------------------- 2: ADMIN MANAGE RECIPES ---------------------------- */}
        <TabPanel value={value} index={2} dir={theme.direction}>
        <Grid container spacing={3}>
            <Grid item sm={5}>
              <TextField label="search recipe" value={searchRecipe} onChange={handleChangeRecipe}/>

              {recipes.map((value) => {
                if (value["nameOfDish"]?.includes(searchRecipe) || value["nameOfDish"].toLowerCase()?.includes(searchRecipe)) {
                  return (
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                        <ListItemAvatar>
                          <Avatar
                          // alt={`Avatar n°${value + 1}`}
                          // src={`/static/images/avatar/${value + 1}.jpg`}
                          />
                        </ListItemAvatar>
                        <ListItemText primary={value?.nameOfDish}/>
                      </AccordionSummary>
                      <AccordionDetails>
                        <ol className={classes.noNum}>
                          {/* ----------------------- edit recipe name, description ----------------------- */}
                          <li>Name of recipe: {value?.nameOfDish} <IconButton onClick={() => handleClickOpenRecipeName(value)}> <EditIcon/> </IconButton></li>
                          <li>Description: {value?.description} <IconButton onClick={() => handleClickOpenRecipeDescription(value)}> <EditIcon/> </IconButton></li>
                          {/* ----------------------- display date modified, rating, num ratings ----------------------- */}
                          <li>Date last modified: {value?.dateUploaded}</li>
                          <li>Rating: {value?.avgRating}</li>
                          <li>Number of ratings: {value?.numRatings}</li>
                          {/* ----------------------- display / edit images, pdf, videos ----------------------- */}
                          <li>Recipe images <IconButton onClick={() => handleClickOpenRecipeImages(value)}> <EditIcon/> </IconButton></li>
                          <li>Recipe pdf
                            <IconButton onClick={() => handleClickOpenViewRecipePdf(value)}> <VisibilityIcon/> </IconButton>
                            <IconButton onClick={() => handleClickOpenRecipePdf(value)}> <EditIcon/> </IconButton>
                          </li>
                          <li>Recipe video
                            <IconButton onClick={() => handleClickOpenViewRecipeVideo(value)}> <VisibilityIcon/> </IconButton>
                            <IconButton onClick={() => handleClickOpenRecipeVideo(value)}> <EditIcon/> </IconButton>
                          </li>
                          <li>Recipe skills
                            <IconButton onClick={() => handleClickOpenViewRecipeSkills(value)}> <VisibilityIcon/> </IconButton>
                            <IconButton onClick={() => handleClickOpenRecipeSkills(value)}> <EditIcon/> </IconButton>
                          </li>
                          <li>Recipe tips
                            <IconButton onClick={() => handleClickOpenViewRecipeTips(value)}> <VisibilityIcon/> </IconButton>
                            <IconButton onClick={() => handleClickOpenRecipeTips(value)}> <EditIcon/> </IconButton>
                          </li>
                          {/* ---------------------------- delete recipe ---------------------------- */}
                          <li><IconButton onClick={() => handleClickOpenDeleteRecipe(value.id)}> <DeleteIcon /> </IconButton></li>
                        </ol>
                      </AccordionDetails>
                    </Accordion>
                  );
                }
              })}
            </Grid>
          </Grid>

          {/* manage recipes Dialog */}
          {currentRecipe && (
            <Dialog disableBackdropClick disableEscapeKeyDown open={openRecipeName} onClose={handleCloseRecipeName}>
              <DialogTitle>Edit Recipe Name</DialogTitle>
              <DialogContent>
                  <TextField
                      value={recipeName} label="Edit Reciipe Name" multiline
                      onChange={(e) => setRecipeName(e.target.value)} fullWidth variant="outlined"/>
                  <Button onClick={handleCloseRecipeName} color="primary"> Cancel </Button>
                  <Button onClick={() => handleSubmitRecipeName(currentRecipe, recipeName)} color="primary"> Confirm </Button>
              </DialogContent>
            </Dialog>
          )}
          {currentRecipe && (
            <Dialog disableBackdropClick disableEscapeKeyDown open={openRecipeDescription} onClose={handleCloseRecipeDescription}>
              <DialogTitle>Edit Recipe Description</DialogTitle>
              <DialogContent>
                  <TextField
                      value={recipeDescription} abel="Edit Reciipe Description" multiline
                      onChange={(e) => setRecipeDescription(e.target.value)} fullWidth variant="outlined"/>
                  <Button onClick={handleCloseRecipeDescription} color="primary"> Cancel </Button>
                  <Button onClick={() => handleSubmitRecipeDescription(currentRecipe, recipeDescription)} color="primary"> Confirm </Button>
              </DialogContent>
            </Dialog>
          )}
          {currentRecipe && (
            <Dialog disableBackdropClick disableEscapeKeyDown open={openRecipeImages} onClose={handleCloseRecipeImages}>
              <DialogTitle>Edit Recipe Images</DialogTitle>
              <DialogContent>
                  <MultiImageInput
                    images={recipeImages} setImages={setRecipeImages}
                    cropConfig={{ crop, ruleOfThirds: true }} inputId
                  />
                  <Button onClick={handleCloseRecipeImages} color="primary"> Cancel </Button>
                  <Button onClick={() => handleSubmitRecipeImages(currentRecipe, recipeImages)} color="primary"> Confirm </Button>
              </DialogContent>
            </Dialog>
          )}
          {currentRecipe && (
            <Dialog disableBackdropClick disableEscapeKeyDown open={openViewRecipePdf} onClose={handleCloseViewRecipePdf}>
              <DialogTitle>View Recipe Pdf</DialogTitle>
              <DialogContent>
                  {(pdf_url != "") ? 
                    <iframe src={pdf_url} width="100%" height={width} frameBorder="0" align="center" position="relative"></iframe>
                    : <h4>No pdf to display</h4>
                  }
                  <Button onClick={handleCloseViewRecipePdf} color="primary"> Back </Button>
              </DialogContent>
            </Dialog>
          )}
          {currentRecipe && (
            <Dialog disableBackdropClick disableEscapeKeyDown open={openRecipePdf} onClose={handleCloseRecipePdf}>
              <DialogTitle>Edit Recipe Pdf</DialogTitle>
              <DialogContent>
                  <DropzoneArea
                      accept="application/pdf" maxFileSize={10485760} dropzoneText="Click to select or drag and drop recipe PDF"
                      filesLimit={1} getPreviewIcon={handlePreviewIcon} onChange={(files) => setPdfFile(files[0])}/>
                  <Button onClick={handleCloseRecipePdf} color="primary"> Cancel </Button>
                  <Button onClick={() => handleSubmitRecipePdf(currentRecipe)} color="primary"> Confirm </Button>
              </DialogContent>
            </Dialog>
          )}
          {currentRecipe && (
            <Dialog disableBackdropClick disableEscapeKeyDown open={openViewRecipeVideo} onClose={handleCloseViewRecipeVideo}>
              <DialogTitle>View Recipe Video</DialogTitle>
              <DialogContent>
                  {(recipeVideo != "") ? 
                    <iframe position="fixed" src={recipeVideo} width="100%" height={(width*0.625)} frameBorder="0" align="center" position="sticky" allow="autoplay; fullscreen"></iframe>
                    : <h4>No recipe video to display</h4>
                  }
                  <Button onClick={handleCloseViewRecipeVideo} color="primary"> Back </Button>
              </DialogContent>
            </Dialog>
          )}
          {currentRecipe && (
            <Dialog disableBackdropClick disableEscapeKeyDown open={openRecipeVideo} onClose={handleCloseRecipeVideo}>
              <DialogTitle>Edit Recipe Video</DialogTitle>
              <DialogContent>
                  <TextField
                      required value={recipeVideo} label="Vimeo Recipe Video ID"
                      onChange={(e) => setRecipeVideo(e.target.value)} fullWidth variant="outlined"/>
                  <Button onClick={handleCloseRecipeVideo} color="primary"> Cancel </Button>
                  <Button onClick={() => handleSubmitRecipeVideo(currentRecipe)} color="primary"> Confirm </Button>
              </DialogContent>
            </Dialog>
          )}
          {currentRecipe && (
            <Dialog disableBackdropClick disableEscapeKeyDown open={openViewRecipeSkills} onClose={handleCloseViewRecipeSkills}>
              <DialogTitle>View Recipe Skills</DialogTitle>
              <DialogContent>
                  {(recipeSkills != "") ? 
                    <iframe position="fixed" src={recipeSkills} width="100%" height={(width*0.625)} frameBorder="0" align="center" position="sticky" allow="autoplay; fullscreen"></iframe>
                    : <h4>No recipe skills to display</h4>
                  }
                  <Button onClick={handleCloseViewRecipeSkills} color="primary"> Back </Button>
              </DialogContent>
            </Dialog>
          )}
          {currentRecipe && (
            <Dialog disableBackdropClick disableEscapeKeyDown open={openRecipeSkills} onClose={handleCloseRecipeSkills}>
              <DialogTitle>Edit Recipe Skills</DialogTitle>
              <DialogContent>
                  <TextField
                      required value={recipeSkills} label="Vimeo Skills Video ID"
                      onChange={(e) => setRecipeSkills(e.target.value)} fullWidth variant="outlined"/>
                  <Button onClick={handleCloseRecipeSkills} color="primary"> Cancel </Button>
                  <Button onClick={() => handleSubmitRecipeSkills(currentRecipe)} color="primary"> Confirm </Button>
              </DialogContent>
            </Dialog>
          )}
          {currentRecipe && (
            <Dialog disableBackdropClick disableEscapeKeyDown open={openViewRecipeTips} onClose={handleCloseViewRecipeTips}>
              <DialogTitle>View Recipe Tips</DialogTitle>
              <DialogContent>
                  {(recipeTips != "") ? 
                    <iframe position="fixed" src={recipeTips} width="100%" height={(width*0.625)} frameBorder="0" align="center" position="sticky" allow="autoplay; fullscreen"></iframe>
                    : <h4>No recipe tips to display</h4>
                  }
                  <Button onClick={handleCloseViewRecipeTips} color="primary"> Back </Button>
              </DialogContent>
            </Dialog>
          )}
          {currentRecipe && (
            <Dialog disableBackdropClick disableEscapeKeyDown open={openRecipeTips} onClose={handleCloseRecipeTips}>
              <DialogTitle>Edit Recipe Tips</DialogTitle>
              <DialogContent>
                  <TextField
                      required value={recipeTips} label="Vimeo Tips Video ID"
                      onChange={(e) => setRecipeTips(e.target.value)} fullWidth variant="outlined"/>
                  <Button onClick={handleCloseRecipeTips} color="primary"> Cancel </Button>
                  <Button onClick={() => handleSubmitRecipeTips(currentRecipe)} color="primary"> Confirm </Button>
              </DialogContent>
            </Dialog>
          )}
          {currentRecipe && (
            <Dialog disableBackdropClick disableEscapeKeyDown open={openDeleteRecipe} onClose={handleCloseDeleteRecipe}>
              <DialogTitle>Are you sure you want to delete the recipe: {currentRecipe}?</DialogTitle>
              <DialogActions>
                <Button onClick={handleCloseDeleteRecipe} color="primary"> Cancel </Button>
                <Button onClick={() => handleSubmitDeleteRecipe()} color="primary"> Ok </Button>
              </DialogActions>
            </Dialog>
          )}

        </TabPanel>
      </SwipeableViews>

      <div className={styles.nav}>
        <Navbar />

        <AppBar position="static" color="default">
          <Tabs
            value={value} onChange={handleChangeToggle}
            indicatorColor="primary" textColor="primary" variant="fullWidth" aria-label="full width tabs example"
          >
            <Tab label="Manage Users" {...a11yProps(0)} />
            <Tab label="Manage Programs" {...a11yProps(1)} />
            <Tab label="Manage Recipes" {...a11yProps(2)} />
          </Tabs>
        </AppBar>
      </div>
    </div>
  );
}
