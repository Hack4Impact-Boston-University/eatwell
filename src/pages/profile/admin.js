import React from "react";
import { useState, useEffect } from "react";
import {
  TextField, List, ListItemText, IconButton,
  Accordion, AccordionSummary, AccordionDetails,
  ListItemAvatar, ListItemSecondaryAction, Typography, Tabs, Tab, Box,
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
import _, { create, map } from 'underscore';
import {getUserFromCookie} from "../../utils/cookies";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { withStyles} from '@material-ui/core/styles';


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
  },

}));

const getTimeString = timestamp => {
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

  let str = hour + ":" + min + ":" + sec + " on " + month + "/" + day + "/" + date.getFullYear();
  return str;
}

const fetcher = async (...args) => {
  const res = await fetch(...args);
  return res.json();
};

var db = firebase.firestore();

export default function Admin() {

  const classes = useStyles();
  const [checked, setChecked] = React.useState([0]);
  const [search, setSearch] = React.useState("");
  const [value, setValue] = React.useState(1);
  const theme = useTheme();
  const { width } = useWindowSize();
  const [selectedProgramProgram, setSelectedProgramProgram] = useState({});
  const [currentUser, setCurrentUser] = React.useState("");
  const [uploadDate, setUploadDate] = React.useState(Date.now())
  const [searchRecipe, setSearchRecipe] = React.useState("");
  const [currentRecipe, setCurrentRecipe] = React.useState("");

  const { data: users } = useSWR(`/api/users/getAllUsers`, fetcher);
  // const { data: programs } = useSWR(`/api/programs/getAllPrograms`, fetcher);
  const {data: codes } = useSWR(`/api/codes/getAllCodes`, fetcher);
  const router = useRouter();
  const { data: recipes } = useSWR(`/api/recipes/getAllRecipes`, fetcher);
  const { data: recipesDic } = useSWR(`/api/recipes/getAllRecipesDic`, fetcher);
  const { data: usersDic } = useSWR(`/api/users/getAllUsersDic`, fetcher);
  const { data: programsTempDic } = useSWR(`/api/programs/getAllProgramsDic`, fetcher);
  const [programs, setPrograms] = React.useState([])
  const [programsDic, setProgramsDic] = React.useState({});
  useEffect(() => { 
    setProgramsDic(programsTempDic);
    if(programsTempDic) {
      setPrograms(Object.keys(programsTempDic).map((key) => programsTempDic[key]));
    }
  }, programsTempDic );
  
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
    setRole("");
  };

  const handleSubmitRole = (currentUser, currentUserRole) => {
    setRole(currentUserRole);
    db.collection("users").doc(currentUser).update({ role: currentUserRole });
    setOpenRole(false);
    setRole("");
  };

  // edit user program
  const [openProgram, setOpenProgram] = React.useState(false);
  const [program, setProgram] = React.useState("");
  // const [prevProgram, setPrevProgram] = React.useState("");

  const handleChangeProgram = (event) => {
    setProgram(event.target.value || "");
  };

  const handleClickOpenProgram = (currentUser,prev) => {
    setProgram(prev)
    setOpenProgram(true);
    setCurrentUser(currentUser);
    // setPrevProgram(prev)
  };

  const handleCloseProgram = () => {
    setProgram("")
    setOpenProgram(false);
  };

  const handleSubmitProgram = (currentUser, currentUserProgram) => {
    
    // if (prevProgram != undefined && programsDic[prevProgram] != undefined) {
    //   var index = Object.values(programsDic[prevProgram].programUsers).indexOf(currentUser);
    //   if (index.toString != "-1" && prevProgram != currentUserProgram) {
    //     delete programsDic[prevProgram].programUsers[index]
    //     db.collection("programs").doc(prevProgram).update({ programUsers: programsDic[prevProgram].programUsers });
    //     setProgramsDic(programsDic)
    //   }
    // }
    
    if (!Object.values(programsDic[currentUserProgram].programUsers).includes(currentUser)) {
      programsDic[currentUserProgram].programUsers[Object.keys(programsDic[currentUserProgram].programUsers).length] = currentUser
      db.collection("programs").doc(currentUserProgram).update({ programUsers: programsDic[currentUserProgram].programUsers });
      setProgramsDic(programsDic)
    }

    // if (prevProgram != currentUserProgram) {
      db.collection("users").doc(currentUser).update({ program: currentUserProgram, programName: programsDic[currentUserProgram].programName });
    // }

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
    db.collection("users").doc(currentUser).delete();
    setOpenDeleteUser(false);
    alert("successfully deleted the user.");
  };


  // ---------------------- 1: ADMIN MANAGE PROGRAMS ----------------------
  const [searchProgram, setSearchProgram] = React.useState("");
  const [openAddProgram, setOpenAddProgram] = React.useState(false);
  const [addedProgram, setAddedProgram] = useState('');
  const [addedProgramNumUsers, setAddedProgramNumUsers] = useState('');
  const [numCodes, setNumCodes] = useState('');
  const [numProgramCodes, setNumProgramCodes] = useState('');
  const [openDeleteProgram, setOpenDeleteProgram] = React.useState(false);
  const [openAddCodes, setOpenAddCodes] = React.useState(false);
  const [openDeleteCodes, setOpenDeleteCodes] = React.useState(false);
  const [viewRecipeImages, setViewRecipeImages] = React.useState([]);
  const [rows, setRows] = React.useState([]);

  const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);

  function createData(id, name, date) {
    return { id, name, date };
  }

  function setRowsFunc(program) {
    var recipeslist = program["programRecipes"];
    var temp = [];
    Object.keys(recipeslist).forEach(function(key) {
      var id = recipesDic[key].id;
      var name = recipesDic[key].nameOfDish;
      var date = recipeslist[key];
      temp.push(createData(id, name, date))
    });
    setRows(temp);
  }
  
  const StyledTableRow = withStyles((theme) => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }))(TableRow);

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

  const setSelectedProgram = (p) => {
    setSelectedProgramProgram(p)
    setNumProgramCodes(
      codes.reduce((acc, code) => {
        if(code?.programID == p?.programID) {
          acc++;
        }
        console.log(acc)
        return acc
      }, 0)
    )
  }


  const handleClickOpenAddProgram = () => {
    setOpenAddProgram(true);
  };

  const handleCloseAddProgram = () => {
    setAddedProgram('');
    setOpenAddProgram(false);
  };

  function generate(length) {
		var result           = '';
		var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';// 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for ( var i = 0; i < length; i++ ) {
		   result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}

  function createCodes(name, num, id) {
    if(num > 500) {
      alert("Too many users, cannot write codes");
      throw new Error("Too many users, cannot write codes");
    }
    var batch = db.batch();
    var index;
    for(index = 0; index < num; index++) {
      const code = generate(6);
      batch.set(db.collection('codes').doc(code), {programName: name, programID:id});
    }
    return batch.commit();
  }

  const addProgram = () => {
    const ref = db.collection('programs').doc();
    const id = ref.id;
    if (addedProgram === "") {
      alert("No program name specified");
      return; 
    }
    db.collection('programs').doc(id).set({programName:addedProgram,programID:id, programRecipes:[], programUsers:[]})
    .then(() => {
      return createCodes(addedProgram, addedProgramNumUsers, id);
    }).then(() => {
      alert("successfully added new program!");
      setSelectedProgram(addedProgram);
      setAddedProgram('');
      setOpenAddProgram(false);
    })
    .catch((err) => {
      console.log(err);
    });
  };

  function addCodes() {
    console.log(program);
    createCodes(selectedProgramProgram?.programName, numCodes, selectedProgramProgram?.programID)
    .then(()=>{
      setOpenAddCodes(false); 
      setNumCodes('');
      alert("Successfully added codes!")
    }).catch((err) => alert(err))
  }

  function deleteCode(id) {
    db.collection("codes").doc(id).delete().then(() => {
      alert("Successfully delete code!")
    }).catch((err) => alert(err))
  }

  function getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
  }

  function deleteCodes() {
    if(numCodes > numProgramCodes) {
      alert("There are only " + numProgramCodes + " codes!");
    }
    let delCodes = getRandom(codes, numCodes);
    var batch = db.batch();
    delCodes.forEach((code) => {
      batch.delete(db.collection("codes").doc(code?.id))
    })
    batch.commit().then(()=> {
      setOpenDeleteCodes(false); 
      setNumCodes('');
      alert("Successfully deleted codes!")
    }).catch((err) => alert(err))
  }

  const handleClickOpenDeleteProgram = (disabled) => {
    setOpenDeleteProgram(true);
  };

  const handleCloseDeleteProgram = () => {
    setOpenDeleteProgram(false);
  };

  const deleteProgram = () => {
    db.collection('programs').doc(selectedProgramProgram?.programID).delete()
    alert("successfully deleted the program.");
    setOpenDeleteProgram(false);
  };

  const [currentProgramRecipes, setCurrentProgramRecipes] = React.useState({});
  const [openEditProgramRecipes, setOpenEditProgramRecipes] = React.useState(false);
  const [selectedRecipes, setSelectedRecipes] = useState([]);

  const handleClickOpenEditProgramRecipes = (programRecipesNow) => {
    setOpenEditProgramRecipes(true);
    var i;
    var originallySelected = []
    var temp = [];
    for (i = 0; i < recipes.length; i++) {
      if (recipes[i].id in selectedProgramProgram?.programRecipes) {
        originallySelected.push({label:recipes[i]?.nameOfDish,value:recipes[i].id})
      }
      temp.push({label:recipes[i]?.nameOfDish,value:recipes[i].id})
    }
    setSelectedRecipes(originallySelected)
    setCurrentProgramRecipes(temp)
    setSelectedProgram(programRecipesNow)
  };

  const handleCloseEditProgramRecipes = () => {
    setCurrentProgramRecipes({})
    setOpenEditProgramRecipes(false);
  };

  const handleChangeEditProgramRecipes = (event) => {
    setProgramRecipes(event.target.value || "");
  };

  const handleSubmitEditProgramRecipes = () => {
    var i;
    var temp = {};
    for (i = 0; i < selectedRecipes.length; i++) {
      var key = selectedRecipes[i]?.value;
      if (programsDic[selectedProgramProgram?.programID]?.programRecipes[key] !== undefined &&
        programsDic[selectedProgramProgram?.programID]?.programRecipes[key] != 0) {
        var value = programsDic[selectedProgramProgram?.programID]?.programRecipes[key];
        temp[key] = value;
      } else {
        temp[key] = 0
      }
    }
    db.collection("programs").doc(selectedProgramProgram?.programID).update({ programRecipes: temp });
    setOpenEditProgramRecipes(false);
    setCurrentProgramRecipes({})
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
    db.collection("programs").doc(selectedProgramProgram?.programID).update({ programUsers: temp });
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
  };

  const handleCloseRecipeName = () => {
    setOpenRecipeName(false);
  };

  const handleSubmitRecipeName = (currentRecipe) => {
    db.collection('recipes').doc(currentRecipe.id).update({nameOfDish:recipeName, dateUploaded: uploadDate})
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
  };

  const handleCloseRecipeDescription = () => {
    setOpenRecipeDescription(false);
  };

  const handleSubmitRecipeDescription = (currentRecipe) => {
    db.collection('recipes').doc(currentRecipe.id).update({description:recipeDescription, dateUploaded: uploadDate})
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
    db.collection('recipes').doc(currentRecipe.id).update({images:recipeImages, dateUploaded: uploadDate})
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
    firebase.storage().ref().child(currentRecipe.pdfRecipe).getDownloadURL().then(function(url) {
      setPdfURL(url)
    })
  };

  const handleCloseViewRecipePdf = () => {
    setOpenViewRecipePdf(false);
  };

  const handleClickOpenRecipePdf = (currentRecipe) => {
    setRecipePdf(currentRecipe.pdfRecipe)
    setOpenRecipePdf(true);
    setCurrentRecipe(currentRecipe);
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
    db.collection('recipes').doc(currentRecipe.id).update({pdfRecipe:recipePdf, dateUploaded: uploadDate})
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
  };

  const handleCloseViewRecipeVideo = () => {
    setOpenViewRecipeVideo(false);
  };
  
  const handleClickOpenRecipeVideo = (currentRecipe) => {
    setRecipeVideo(currentRecipe.videoRecipe)
    setOpenRecipeVideo(true);
    setCurrentRecipe(currentRecipe);
  };

  const handleCloseRecipeVideo = () => {
    setOpenRecipeVideo(false);
  };

  const handleSubmitRecipeVideo = (currentRecipe) => {
    db.collection('recipes').doc(currentRecipe.id).update({videoRecipe:recipeVideo, dateUploaded: uploadDate})
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
  };

  const handleCloseViewRecipeSkills = () => {
    setOpenViewRecipeSkills(false);
  };
  
  const handleClickOpenRecipeSkills = (currentRecipe) => {
    setRecipeSkills(currentRecipe.videoSkills)
    setOpenRecipeSkills(true);
    setCurrentRecipe(currentRecipe);
  };

  const handleCloseRecipeSkills = () => {
    setOpenRecipeSkills(false);
  };

  const handleSubmitRecipeSkills = (currentRecipe) => {
    db.collection('recipes').doc(currentRecipe.id).update({videoSkills:recipeSkills, dateUploaded: uploadDate})
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
  };

  const handleCloseViewRecipeTips = () => {
    setOpenViewRecipeTips(false);
  };
  
  const handleClickOpenRecipeTips = (currentRecipe) => {
    setRecipeTips(currentRecipe.videoTips)
    setOpenRecipeTips(true);
    setCurrentRecipe(currentRecipe);
  };

  const handleCloseRecipeTips = () => {
    setOpenRecipeTips(false);
  };

  const handleSubmitRecipeTips = (currentRecipe) => {
    db.collection('recipes').doc(currentRecipe.id).update({videoTips:recipeTips, dateUploaded: uploadDate})
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
    db.collection("recipes").doc(currentRecipe).delete();
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

  const userData = getUserFromCookie();

  if(userData) {
    if(!("firstname" in userData)) {
      router.push("/fprofile/makeProfile");
      return (<div></div>);
    } else if(userData["role"] != "admin") {
      router.push("/");
      return (<div></div>);
    }
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
                <ListItem key={"Add New Program"} button selected={true}>
                  <Button variant="outlined" fullWidth onClick={() => handleClickOpenAddProgram()}> Add New Program </Button>
                </ListItem>

                <TextField label="search program" value={searchProgram} onChange={handleChangeSearchProgram}/>
                {programs.map((value) => {
                  if (value["programName"]?.includes(searchProgram) || value["programName"].toLowerCase()?.includes(searchProgram)) {
                    if (value.programName == selectedProgramProgram?.programName) {
                      return (
                        <Grid item>                      
                          <ListItem key={value?.programName} button selected={true}
                            onClick={() => {setSelectedProgram(value); setRowsFunc(value)}}>
                            <ListItemText>{value?.programName}</ListItemText>
                          </ListItem>
                          <Divider light />
                        </Grid>);}
                    else {
                      return (
                        <Grid item>                      
                          <ListItem
                            key={value?.programName} button selected={false} classes={{ selected: classes.active }}
                            onClick={() => {setSelectedProgram(value); setRowsFunc(value)}}>
                            <ListItemText>{value?.programName}</ListItemText>
                          </ListItem>
                          <Divider light />
                        </Grid>);}}})}
              </List>
            </Grid>

            <Grid item sm={5}>
              {_.isEqual(selectedProgramProgram, {}) ? <h4>Please select a program</h4> :
              <div> {/* ----------------------- delete program ----------------------- */}
                <ListItem key={"Delete Program"} button selected={true} onClick={() => setSelectedProgram(selectedProgramProgram)}>
                  <Button variant="outlined" fullWidth onClick={() => handleClickOpenDeleteProgram()}>Delete Program </Button>
                </ListItem>
              </div>}

              {_.isEqual(selectedProgramProgram, {}) ? <h4></h4> :
              <div> {/* ----------------------- edit recipes list ----------------------- */}
                <List>
                  <ListItemText> Recipes List
                  <IconButton onClick={() => handleClickOpenEditProgramRecipes(selectedProgramProgram)}><EditIcon/></IconButton>
                  </ListItemText>
                </List>
                <TableContainer component={Paper}>
                  <Table aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Recipe</StyledTableCell>
                        <StyledTableCell> Schedule Date </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row) => (
                        <StyledTableRow key={row.name}>
                          <StyledTableCell component="th" scope="row">{row.name}</StyledTableCell>
                          <StyledTableCell align="left">
                            <TextField
                              id="date" label="Date" type="date" defaultValue={programsDic[selectedProgramProgram?.programID]?.programRecipes[row.id]}
                              className={classes.textField} InputLabelProps={{shrink: true,}}
                              onChange={(e) => {
                                var dic = programsDic[selectedProgramProgram?.programID]?.programRecipes
                                dic[row.id] = e.target.value;
                                db.collection('programs').doc(selectedProgramProgram?.programID).update({programRecipes: dic})
                              }
                              }
                            />
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
              </TableContainer>
              </div>}

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
                  );
                }) : <Grid></Grid>
              }
              
              
              {Object.keys(selectedProgramProgram).length > 0 && codes != null && numProgramCodes > 0 ?
                <div> {/* ----------------------- edit users list ----------------------- */}
                  <List>
                    <ListItemText> Unused Codes - {numProgramCodes}
                    {/* <IconButton onClick={() => handleClickOpenEditProgramUsers(selectedProgramProgram)}><EditIcon/></IconButton> */}
                    </ListItemText>
                  </List>
                  <Paper style={{maxHeight: 260, overflow: 'auto'}}>
                    <List>
                      {codes.map((code) => {
                      if(code?.programID == selectedProgramProgram?.programID) {
                        return (
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar/>
                            </ListItemAvatar>
                            <ListItemText primary={code?.id}/>
                            <ListItemSecondaryAction>
                              <IconButton edge="end" aria-label="delete" onClick={() => deleteCode(code?.id)}>
                                <DeleteIcon />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        // <Accordion>
                        //   <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                        //     <ListItemAvatar>
                        //       <Avatar
                        //       // alt={`Avatar n°${value + 1}`}
                        //       // src={`/static/images/avatar/${value + 1}.jpg`}
                        //       />
                        //     </ListItemAvatar>
                        //     <ListItemText primary={code?.id}/>
                        //   </AccordionSummary>
                        //   <AccordionDetails>
                        //       <ol className={classes.noNum}>
                        //         {Object.keys(code).map((key) => {
                        //           if(key != "id") {
                        //             return <li>{key}: {code[key]}</li>
                        //           }
                        //         })}
                        //       </ol>
                        //   </AccordionDetails>
                        // </Accordion>
                        )}
                      })}
                    </List>
                  </Paper>
                  <ListItem key={"Add Code"}>
                    <Button variant="outlined" fullWidth onClick={() => setOpenAddCodes(true)}>Add Codes </Button>
                  </ListItem>
                  <ListItem key={"Delete Code"}>
                    <Button variant="outlined" fullWidth onClick={() => setOpenDeleteCodes(true)}>Delete Codes </Button>
                  </ListItem>
                </div> : <Grid></Grid>
              }
              
            </Grid>
          </Grid>

          {/* edit program */}
          <Dialog disableBackdropClick disableEscapeKeyDown open={openAddProgram} onClose={handleCloseAddProgram}>
            <DialogActions>
              <h4>Add New Program</h4>
              <TextField value={addedProgram} label="New Program" multiline onChange={(e) => setAddedProgram(e.target.value)} fullWidth variant="outlined"/>
              <TextField value={addedProgramNumUsers || ''} label="Number of Users" multiline onChange={(e) => setAddedProgramNumUsers(e.target.value)} fullWidth variant="outlined"/>
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
          <Dialog disableBackdropClick disableEscapeKeyDown open={openAddCodes}>
            <DialogActions>
              <h4>Add Codes</h4>
              <TextField value={numCodes || ''} label="Number of Codes" onChange={(e) => setNumCodes(e.target.value)} fullWidth variant="outlined"/>
              <Button onClick={() => setOpenAddCodes(false)} color="primary"> Cancel </Button>
              <Button onClick={() => addCodes()} color="primary"> Confirm </Button>
            </DialogActions>
          </Dialog>
          <Dialog disableBackdropClick disableEscapeKeyDown open={openDeleteCodes}>
            <DialogActions>
              <h4>Delete Codes</h4>
              <TextField value={numCodes || ''} label="Number of Codes" onChange={(e) => setNumCodes(e.target.value)} fullWidth variant="outlined"/>
              <Button onClick={() => setOpenDeleteCodes(false)} color="primary"> Cancel </Button>
              <Button onClick={() => deleteCodes()} color="primary"> Confirm </Button>
            </DialogActions>
          </Dialog>

          {/* view recipes list Dialog */}
          {selectedProgramProgram && (
            <Dialog disableBackdropClick disableEscapeKeyDown open={openEditProgramRecipes} onClose={handleCloseEditProgramRecipes}fullWidth
            maxWidth="sm">
              <DialogTitle>Edit Recipes List for {selectedProgramProgram?.programName} </DialogTitle>
              <DialogContent>
              <FormControl fullWidth className={classes.formControl}>
                <MultiSelect options={currentProgramRecipes} value={selectedRecipes} onChange={setSelectedRecipes} labelledBy={"Select"}/>
              </FormControl>
              <Box height="200px"></Box>
              {/* <TableContainer component={Paper}>
                <Table aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Recipe</StyledTableCell>
                      <StyledTableCell> Date </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                      <StyledTableRow>
                        <StyledTableCell align="left">
                          <FormControl className={classes.formControl}>
                            <MultiSelect options={currentProgramRecipes} value={selectedRecipes} onChange={setSelectedRecipes} labelledBy={"Select"}/>
                            <Select
                               id="demo-simple-select-helper"
                              value={selectedRecipes}
                              onChange={setSelectedRecipes}
                            >
                              {recipes.map((recipe) =>
                                <MenuItem value={recipe["id"]}> {recipe["nameOfDish"]} </MenuItem>)
                              }
                            </Select>
                          </FormControl>
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          <TextField
                            id="date"
                            label="Recipe"
                            type="date"
                            defaultValue="2021-01-01"
                            className={classes.textField}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </StyledTableCell>
                      </StyledTableRow>
                  </TableBody>
                </Table>
            </TableContainer>  labelId="demo-simple-select-helper-label" */}
                           
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
                          <li>Date last modified: {getTimeString(value?.dateUploaded)}</li>
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
                  <Button onClick={() => handleSubmitRecipeName(currentRecipe)} color="primary"> Confirm </Button>
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
                  <Button onClick={() => handleSubmitRecipeDescription(currentRecipe)} color="primary"> Confirm </Button>
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
                  <Button onClick={() => handleSubmitRecipeImages(currentRecipe)} color="primary"> Confirm </Button>
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
