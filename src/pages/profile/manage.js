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
} from "@material-ui/core";
import useSWR from "swr";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import VisibilityIcon from '@material-ui/icons/Visibility';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AppBar from "@material-ui/core/AppBar";
import PropTypes from "prop-types";
import Navbar from "../../components/Navbar";
import styles from "../../styles/Home.module.css";
import * as firebase from "firebase";
import { useRouter } from 'next/router';
import { PictureAsPdf } from '@material-ui/icons'
import MultiImageInput from 'react-multiple-image-input';
import MultiSelect from "react-multi-select-component";
import _ from 'underscore';
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
        <Box p={1}>
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
    minWidth: 0,
    '@media (min-width: 0px)': {
      minWidth: 0
    }
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
  codes: {
    columns: "1 auto"
  },
  lst: {
		listStyle: "none",
		paddingLeft: 0,
	},
  tabLabel: {
    fontSize: "min(0.9rem, 2.8vw)"
  }
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

export default function Manage() {

  const classes = useStyles();
  const [checked, setChecked] = React.useState([0]);
  const [search, setSearch] = React.useState("");
  const [value, setValue] = React.useState(0);
  const theme = useTheme();
  const { width } = useWindowSize();
  const [selectedProgramProgram, setSelectedProgramProgram] = useState({});
  const [currentUser, setCurrentUser] = React.useState("");
  const [uploadDate, setUploadDate] = React.useState(Date.now())
  const [searchRecipe, setSearchRecipe] = React.useState("");
  const [searchSkill, setSearchSkill] = React.useState("");
  const [searchTip, setSearchTip] = React.useState("");
  const [currentRecipe, setCurrentRecipe] = React.useState({});
  const [currentSkill, setCurrentSkill] = React.useState("");
  const [currentTip, setCurrentTip] = React.useState("");

  const router = useRouter();
  const [users, setUsers] = React.useState([])
  const [recipes, setRecipes] = React.useState([])
  const [programs, setPrograms] = React.useState([])
  const [skills, setSkills] = React.useState([])
  const [tips, setTips] = React.useState([])
  const [currentCodes, setCurrentCodes] = React.useState([])
  const { data: usersDic } = useSWR(`/api/users/getAllUsersDic`, fetcher);
  const { data: recipesDic } = useSWR(`/api/recipes/getAllRecipesDic`, fetcher);
  const { data: programsDic } = useSWR(`/api/programs/getAllProgramsDic`, fetcher);
  const { data: skillsDic } = useSWR(`/api/skills/getAllSkillsDic`, fetcher);
  const { data: tipsDic } = useSWR(`/api/tips/getAllTipsDic`, fetcher);
  const {data: codes } = useSWR(`/api/codes/getAllCodes`, fetcher);

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
    var index = Object.keys(usersDic).indexOf(currentUser);
    usersDic[currentUser]["role"] = currentUserRole;
    users[index]["role"] = currentUserRole;
    setOpenRole(false);
    setRole("");
  };

  // edit user program
  const [openProgram, setOpenProgram] = React.useState(false);
  const [program, setProgram] = React.useState("");
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
    if (!Object.values(programsDic[currentUserProgram].programUsers).includes(currentUser)) {
      db.collection("programs").doc(currentUserProgram).update({ programUsers: programsDic[currentUserProgram].programUsers });
      var indexProgram = Object.keys(programsDic).indexOf(currentUserProgram);
      programsDic[currentUserProgram].programUsers[Object.keys(programsDic[currentUserProgram].programUsers).length] = currentUser
      programs[indexProgram]["programUsers"] = programsDic[currentUserProgram].programUsers;
    }
    db.collection("users").doc(currentUser).update({ program: currentUserProgram });
    var indexUser = Object.keys(usersDic).indexOf(currentUser);
    usersDic[currentUser]["program"] = currentUserProgram;
    users[indexUser]["program"] = currentUserProgram;
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
  const handleSubmitDeleteUser = (currentUser) => {
    db.collection("users").doc(currentUser).delete();
    var index = Object.keys(usersDic).indexOf(currentUser);
    usersDic.delete(currentUser)
    users.splice(index, 1);
    setOpenDeleteUser(false);
    alert("successfully deleted the user.");
  };


  // ---------------------- 1: ADMIN MANAGE PROGRAMS ----------------------
  const [searchProgram, setSearchProgram] = React.useState("");
  const [openAddProgram, setOpenAddProgram] = React.useState(false);
  const [addedProgram, setAddedProgram] = useState('');
  const [addedProgramNumUsers, setAddedProgramNumUsers] = useState('');
  const [addedProgramEndDate, setAddedProgramEndDate] = useState('');
  const [newProgramEndDate, setNewProgramEndDate] = useState('');
  const [numCodes, setNumCodes] = useState('');
  const [numProgramCodes, setNumProgramCodes] = useState(0);
  const [openDeleteProgram, setOpenDeleteProgram] = React.useState(false);
  const [openAddCodes, setOpenAddCodes] = React.useState(false);
  const [openDeleteCodes, setOpenDeleteCodes] = React.useState(false);
  const [openChangeProgramEndDate, setOpenChangeProgramEndDate] = React.useState(false);
  const [viewCoverImages, setViewCoverImages] = React.useState([]);
  const [viewRecipeImages, setViewRecipeImages] = React.useState([]);
  const [rows, setRows] = React.useState([]);

  useEffect(() => {
    let date = new Date(Date.now());
    date.setMonth((date.getMonth() + 1) % 12);
    setAddedProgramEndDate(getDateString(date.getTime()));
  }, []);

  const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);

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
  const getDateString = timestamp => {
    let date = new Date(timestamp);
    let month = date.getMonth() + 1;
    let day = date.getDate();
    month = (month < 10 ? "0" : "") + month;
    day = (day < 10 ? "0" : "") + day;
    let str = date.getFullYear() + "-" + month + "-" + day;
    return str;
  }
  const getTimeStamp = datestring => {
    let date = new Date();
    let args = datestring.split("-");
    date.setFullYear(parseInt(args[0]));
    date.setMonth(parseInt(args[1]) - 1);
    date.setDate(parseInt(args[2]));
    return date.getTime();
  }

  function createData(id, name, date) {
    return { id, name, date };
  }
  function setRowsFunc(program) {
    var recipeslist = program["programRecipes"];
    var temp = [];
    
    Object.keys(recipeslist).forEach(function(key) {
      if (recipesDic[key]?.id != undefined) {
        var id = recipesDic[key]?.id;
        var name = recipesDic[key]?.nameOfDish;
        var date = recipeslist[key];
        temp.push(createData(id, name, date))
      }
    });
    
    setRows(temp);
  }

  const setSelectedProgram = (p) => {
    setSelectedProgramProgram(p)
    setCurrentCodes(
      codes.filter(code => code?.program == p?.program)
    );
    setNumProgramCodes(
      codes.filter(code => code?.program == p?.program).length
    );
  }
  const handleClickOpenAddProgram = () => {
    setOpenAddProgram(true);
  };
  const handleCloseAddProgram = () => {
    setAddedProgram('');
    setOpenAddProgram(false);
  };

  // activation codes
  function generate(length) {
		var result           = '';
		var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';// 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for ( var i = 0; i < length; i++ ) {
		   result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}
  function createCodes(num, id) {
    if(num > 500) {
      alert("Too many users, cannot write codes");
      throw new Error("Too many users, cannot write codes");
    }
    var batch = db.batch();
    var index;
    for(index = 0; index < num; index++) {
      const code = generate(6);
      batch.set(db.collection('codes').doc(code), {codeID: code, program:id});
    }
    return batch.commit();
  }
  function addCodes() {
    createCodes(numCodes, selectedProgramProgram?.program)
    .then(()=>{
      setOpenAddCodes(false); 
      setNumCodes('');
      alert("Successfully added codes!")
    }).catch((err) => alert(err))
    setNumProgramCodes(parseInt(currentCodes.length)+parseInt(numCodes))
  }
  async function deleteCode(id, batch) {
    setNumProgramCodes(parseInt(currentCodes.length)-1)
    await db.collection("codes").doc(id).delete().then(() => {
    }).catch((err) => alert(err))
    if (batch == false) {
      alert("successfully deleted code!")
    }
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
    let delCodes = getRandom(currentCodes, numCodes);
    delCodes.forEach((code) => {
      deleteCode(code?.codeID, true)
    })
    alert("Successfully deleted codes!")
    setNumCodes('');
    setOpenDeleteCodes(false);
  }

  const addProgram = () => {
    const ref = db.collection('programs').doc();
    const id = ref.id;
    if (addedProgram === "") {
      alert("No program name specified");
      return; 
    }
    db.collection('programs').doc(id).set({programName:addedProgram,program:id, programRecipes:[], programUsers:[], programEndDate:getTimeStamp(addedProgramEndDate)})
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

  const handleClickOpenDeleteProgram = (disabled) => {
    setOpenDeleteProgram(true);
  };
  const handleCloseDeleteProgram = () => {
    setOpenDeleteProgram(false);
  };
  const deleteProgram = () => {
    db.collection('programs').doc(selectedProgramProgram?.program).delete()
    currentCodes.forEach(code => {
      deleteCode(code?.codeID, true)
    })
    alert("successfully deleted the program.");
    setOpenDeleteProgram(false);
  };

  // program recipes
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
      if (programsDic[selectedProgramProgram?.program]?.programRecipes[key] !== undefined &&
        programsDic[selectedProgramProgram?.program]?.programRecipes[key] != 0) {
        var value = programsDic[selectedProgramProgram?.program]?.programRecipes[key];
        temp[key] = value;
      } else {
        temp[key] = 0
      }
    }
    db.collection("programs").doc(selectedProgramProgram?.program).update({ programRecipes: temp });
    var index = Object.keys(programsDic).indexOf(selectedProgramProgram?.program);
    programsDic[selectedProgramProgram?.program]["programRecipes"] = temp;
    programs[index]["programRecipes"] = temp;
    setOpenEditProgramRecipes(false);
    setCurrentProgramRecipes({})
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
    var index = Object.keys(recipesDic).indexOf(currentRecipe.id);
    recipesDic[currentRecipe.id]["nameOfDish"] = recipeName;
    recipesDic[currentRecipe.id]["dateUploaded"] = uploadDate;
    recipes[index]["nameOfDish"] = recipeName;
    recipes[index]["dateUploaded"] = uploadDate;
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
    var index = Object.keys(recipesDic).indexOf(currentRecipe.id);
    recipesDic[currentRecipe.id]["description"] = recipeDescription;
    recipesDic[currentRecipe.id]["dateUploaded"] = uploadDate;
    recipes[index]["description"] = recipeDescription;
    recipes[index]["dateUploaded"] = uploadDate;
    alert("successfully edited recipe description!");
    setRecipeDescription('');
    setOpenRecipeDescription(false);
  };

  // edit recipe ingredients / allergens
  const [recipeDescriptionIngredients, setRecipeDescriptionIngredients] = React.useState("");
  const [openRecipeDescriptionIngredients, setOpenRecipeDescriptionIngredients] = React.useState(false);
  const handleClickOpenRecipeDescriptionIngredients = (currentRecipe) => {
    setRecipeDescriptionIngredients(currentRecipe.descriptionIngredients)
    setOpenRecipeDescriptionIngredients(true);
    setCurrentRecipe(currentRecipe);
  };
  const handleCloseRecipeDescriptionIngredients = () => {
    setOpenRecipeDescriptionIngredients(false);
  };
  const handleSubmitRecipeDescriptionIngredients = (currentRecipe) => {
    db.collection('recipes').doc(currentRecipe.id).update({descriptionIngredients:recipeDescriptionIngredients, dateUploaded: uploadDate})
    var index = Object.keys(recipesDic).indexOf(currentRecipe.id);
    recipesDic[currentRecipe.id]["descriptionIngredients"] = recipeDescriptionIngredients;
    recipesDic[currentRecipe.id]["dateUploaded"] = uploadDate;
    recipes[index]["descriptionIngredients"] = recipeDescriptionIngredients;
    recipes[index]["dateUploaded"] = uploadDate;
    alert("successfully edited recipe ingredients / allergens!");
    setRecipeDescriptionIngredients('');
    setOpenRecipeDescriptionIngredients(false);
  };

  // edit recipe fact
  const [recipeFact, setRecipeFact] = React.useState("");
  const [openRecipeFact, setOpenRecipeFact] = React.useState(false);
  const handleClickOpenRecipeFact = (currentRecipe) => {
    setRecipeFact(currentRecipe.recipeFact)
    setOpenRecipeFact(true);
    setCurrentRecipe(currentRecipe);
  };
  const handleCloseRecipeFact = () => {
    setOpenRecipeFact(false);
  };
  const handleSubmitRecipeFact = (currentRecipe) => {
    db.collection('recipes').doc(currentRecipe.id).update({recipeFact:recipeFact, dateUploaded: uploadDate})
    var index = Object.keys(recipesDic).indexOf(currentRecipe.id);
    recipesDic[currentRecipe.id]["recipeFact"] = recipeFact;
    recipesDic[currentRecipe.id]["dateUploaded"] = uploadDate;
    recipes[index]["recipeFact"] = recipeFact;
    recipes[index]["dateUploaded"] = uploadDate;
    alert("successfully edited recipe fact!");
    setRecipeFact('');
    setOpenRecipeFact(false);
  };

  // edit cover images
  const [recipeImages, setRecipeImages] = React.useState([]);
  const [openRecipeImages, setOpenRecipeImages] = React.useState(false);
  const crop = {
    unit: '%',
    aspect: 4 / 3,
    width: '100'
  };
  const handleClickOpenRecipeImages = (currentRecipe) => {
    setCurrentRecipe(currentRecipe);
    setRecipeImages(currentRecipe.images)
    setOpenRecipeImages(true);
  };
  const handleCloseRecipeImages = () => {
    setOpenRecipeImages(false);
  };
  const handleSubmitRecipeImages = (currentRecipe) => {
    // delete the previous photo
    var storageRef = firebase.storage().ref();
    for (let i = 0; i < currentRecipe.images.length; i++) {
      var ref = storageRef.child(currentRecipe.id + i + ".jpg");
      ref.delete().then(() => {}).catch((error) => {});
    }
    // upload new photos
    var i;
		var uploadedImages = Object.values(recipeImages);
    db.collection('recipes').doc(currentRecipe.id).update({images:uploadedImages, dateUploaded: uploadDate})
    var index = Object.keys(recipesDic).indexOf(currentRecipe.id);
    recipesDic[currentRecipe.id]["images"] = uploadedImages;
    recipesDic[currentRecipe.id]["dateUploaded"] = uploadDate;
    recipes[index]["images"] = uploadedImages;
    recipes[index]["dateUploaded"] = uploadDate;
    for (i = 0; i < uploadedImages.length ; i++) {
      firebase.storage().ref().child(currentRecipe.id+i+".jpg").putString(uploadedImages[i], 'data_url').on(firebase.storage.TaskEvent.STATE_CHANGED, {
          complete: function() {}
      })
    }
    alert("successfully edited cover images!");
    setRecipeImages([]);
    setOpenRecipeImages(false);
  };

  // view / edit instruction pdf
  const [openViewRecipeInstruction, setOpenViewRecipeInstruction] = React.useState(false);
  const [openRemoveRecipeInstruction, setOpenRemoveRecipeInstruction] = React.useState(false);
  const [openAddRecipeInstruction, setOpenAddRecipeInstruction] = React.useState(false);
  const [instructionImgs, setInstructionImgs] = useState({});
  var uploadedInstructionImgs = [];
  const [selectedInstructionImages, setSelectedInstructionImages] = useState([]);
  const [uploadedInstructionURL, setUploadedInstructionURL] = useState([]);
  const [deleteInstructionURL, setDeleteInstructionURL] = useState([]);
  // view
  const handleClickOpenViewRecipeInstruction = async (currentRecipe) => {
    setUploadedInstructionURL(currentRecipe.recipeImgs)
    var vals = Object.values(currentRecipe.recipeImgs)
    const getImg = async (i) => {
      var storageRef = firebase.storage().ref();
      var imgRef = storageRef.child(currentRecipe.id + i + ".pdf");
      await imgRef
        .getDownloadURL()
        .then((url) => {
          if (vals.includes(currentRecipe.id + i + ".pdf")) {
            setSelectedInstructionImages((imgList) => [...imgList, url]);
          } else {
            setSelectedInstructionImages((imgList) => [...imgList, ""]);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    if (currentRecipe) {
      for (let i = 0; i < currentRecipe.recipeImgs.length; i++) {
        await getImg(i);
      }
    }
    setOpenViewRecipeInstruction(true);
    setCurrentRecipe(currentRecipe);
  };
  const handleCloseViewRecipeInstruction = () => {
    setOpenViewRecipeInstruction(false);
    setInstructionImgs({})
    setSelectedInstructionImages([])
    setUploadedInstructionURL([])
  };
  // add
  const handleClickOpenAddRecipeInstruction = (currentRecipe) => {
    setOpenAddRecipeInstruction(true);
    setCurrentRecipe(currentRecipe);
    setUploadedInstructionURL(currentRecipe.recipeImgs)
  };
  const handleInstructionChange = (e) => {
		if (e.target.files) {
			const filesArray = Array.from(e.target.files).map((file) =>
				URL.createObjectURL(file)
			)
			setSelectedInstructionImages((prevImages) => prevImages.concat(filesArray));
			for (var i = 0; i < e.target.files.length; i++) {
				instructionImgs[Object.values(instructionImgs).length] = e.target.files[i]
				setInstructionImgs(instructionImgs)
			}
		};
	};
	const renderInstruction = (source) => {
		return source.map((photo) => {
      return (
        <div float="left">
          <img width={width*0.2} height="auto" display="block" src={photo} alt="" key={photo} />
          <IconButton onClick={() => deleteInstruction(photo)}> <DeleteIcon /> </IconButton>
        </div>
      )
		});
	};
	const deleteInstruction = (photo) => {
		if (photo) {
			setSelectedInstructionImages(selectedInstructionImages.filter(function(x) { 
				return x !== photo
			}))
		}
	}
  const handleCloseAddRecipeInstruction = () => {
    setOpenAddRecipeInstruction(false);
    setInstructionImgs({})
    setSelectedInstructionImages([])
    setUploadedInstructionURL([]);
    setUploadedInstructionURL([]);
  };
  const handleSubmitAddRecipeInstruction = (currentRecipe) => {
    var i;
    var uploadedInstructionImgs = Object.values(instructionImgs);
    var n = uploadedInstructionURL.length
    for (i = n; i < uploadedInstructionImgs.length + n; i++) {
			firebase.storage().ref().child(currentRecipe.id + i + ".pdf")
			.put(uploadedInstructionImgs[i-n]).on(firebase.storage.TaskEvent.STATE_CHANGED, {
				complete: function () {},
			});
			uploadedInstructionURL[i] = currentRecipe.id + i + ".pdf"
			setUploadedInstructionURL(uploadedInstructionURL)
		}
    db.collection('recipes').doc(currentRecipe.id).update({recipeImgs:uploadedInstructionURL, dateUploaded: uploadDate})
    var index = Object.keys(recipesDic).indexOf(currentRecipe.id);
    recipesDic[currentRecipe.id]["recipeImgs"] = uploadedInstructionURL;
    recipesDic[currentRecipe.id]["dateUploaded"] = uploadDate;
    recipes[index]["recipeImgs"] = uploadedInstructionURL;
    recipes[index]["dateUploaded"] = uploadDate;
    alert("successfully edited instruction image!");
    setInstructionImgs({});
    setSelectedInstructionImages([]);
		setUploadedInstructionURL([]);
		uploadedInstructionImgs = [];
    setOpenAddRecipeInstruction(false);
  };
  // remove
  const handleClickOpenRemoveRecipeInstruction = async (currentRecipe) => {
    setUploadedInstructionURL(currentRecipe.recipeImgs)
    var vals = Object.values(currentRecipe.recipeImgs)
    const getImg = async (i) => {
      var storageRef = firebase.storage().ref();
      var imgRef = storageRef.child(currentRecipe.id + i + ".pdf");
      await imgRef
        .getDownloadURL()
        .then((url) => {
          if (vals.includes(currentRecipe.id + i + ".pdf")) {
            setSelectedInstructionImages((imgList) => [...imgList, url]);
          } else {
            setSelectedInstructionImages((imgList) => [...imgList, ""]);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    if (currentRecipe) {
      for (let i = 0; i < currentRecipe.recipeImgs.length; i++) {
        await getImg(i);
      }
    }
    setOpenRemoveRecipeInstruction(true);
    setCurrentRecipe(currentRecipe);
  };
  const renderRemoveInstruction = (source) => {
    return source.map((photo,index) => {
      if (!_.isEqual(photo, "")) {
        return (
          <div float="left">
            <img width={width*0.2} height="auto" display="block" src={photo} alt="Recipe image" />
            <IconButton onClick={() => deleteRemoveInstruction(photo,index)}> <DeleteIcon /> </IconButton>
          </div>
        )
      }
		});
  }
  const deleteRemoveInstruction = (photo,index) => {
    uploadedInstructionURL[index] = ""
		if (photo) {
			setSelectedInstructionImages(selectedInstructionImages.filter(function(x) { 
				return x !== photo
			}))
		}
    deleteInstructionURL.push(currentRecipe.id+index+".pdf")
    setDeleteInstructionURL(deleteInstructionURL)
	}
  const handleCloseRemoveRecipeInstruction = () => {
    setInstructionImgs({})
    setUploadedInstructionURL([]);
    setSelectedInstructionImages([]);
    setDeleteInstructionURL([]);
    setOpenRemoveRecipeInstruction(false);
  };
  const handleSubmitRemoveRecipeInstruction = (currentRecipe) => {
    db.collection('recipes').doc(currentRecipe.id).update({recipeImgs:uploadedInstructionURL, dateUploaded: uploadDate})
    var index = Object.keys(recipesDic).indexOf(currentRecipe.id);
    recipesDic[currentRecipe.id]["recipeImgs"] = uploadedInstructionURL;
    recipesDic[currentRecipe.id]["dateUploaded"] = uploadDate;
    recipes[index]["recipeImgs"] = uploadedInstructionURL;
    recipes[index]["dateUploaded"] = uploadDate;
    alert("successfully removed image!");
    setInstructionImgs({})
    setUploadedInstructionURL([]);
    setSelectedInstructionImages([]);
    setDeleteInstructionURL([]);
    setOpenRemoveRecipeInstruction(false);
  }

  // view / edit nutrition png
  const [openViewRecipeNutrition, setOpenViewRecipeNutrition] = React.useState(false);
  const [openEditRecipeNutrition, setOpenEditRecipeNutrition] = React.useState(false);
  const [nutritionalImgs, setNutritionalImgs] = useState({});
  var uploadedNutritionalImgs = [];
  const [selectedNutritionalImages, setSelectedNutritionalImages] = useState([]);
  const [uploadedNutritionalURL, setUploadedNutritionalURL] = useState([]);
  const [deleteNutritionalURL, setDeleteNutritionalURL] = useState([]);
  // view
  const handleClickOpenViewRecipeNutrition = (currentRecipe) => {
    setUploadedNutritionalURL(currentRecipe.nutritionalImgs)
    var vals = Object.values(currentRecipe.nutritionalImgs)
    const getImg = async (i) => {
      var storageRef = firebase.storage().ref();
      var imgRef = storageRef.child(currentRecipe.id + i + ".png");
      await imgRef
        .getDownloadURL()
        .then((url) => {
          if (vals.includes(currentRecipe.id + i + ".png")) {
            setSelectedNutritionalImages((imgList) => [...imgList, url]);
          } else {
            setSelectedNutritionalImages((imgList) => [...imgList, ""]);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    if (currentRecipe) {
      for (let i = 0; i < currentRecipe.nutritionalImgs.length; i++) {
        getImg(i);
      }
    }
    setOpenViewRecipeNutrition(true);
    setCurrentRecipe(currentRecipe);
  };
  const handleCloseViewRecipeNutrition = () => {
    setOpenViewRecipeNutrition(false);
    setNutritionalImgs({})
    setSelectedNutritionalImages([])
    setUploadedNutritionalURL([])
  };
  // edit
  const handleClickOpenEditRecipeNutrition = (currentRecipe) => {
    setOpenEditRecipeNutrition(true);
    setCurrentRecipe(currentRecipe);
    setUploadedNutritionalURL(currentRecipe.nutritionalImgs)
  };
  const handleNutritionalChange = (e) => {
		if (e.target.files[0]) {
			setSelectedNutritionalImages([URL.createObjectURL(e.target.files[0])]);
      nutritionalImgs[0] = e.target.files[0]
      setNutritionalImgs(nutritionalImgs)
		};
	};
	const renderNutritional = (source) => {
		return source.map((photo) => {
      return (
        <div float="left">
          <img height="200px" display="block" src={photo} alt="" key={photo} />
          <IconButton onClick={() => deleteNutritional(photo)}> <DeleteIcon /> </IconButton>
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
  const handleCloseEditRecipeNutrition = () => {
    setOpenEditRecipeNutrition(false);
    setNutritionalImgs({})
    setSelectedNutritionalImages([])
    setNutritionalImgs({})
    setUploadedNutritionalURL([]);
  };
  const handleSubmitEditRecipeNutrition = (currentRecipe) => {
    var uploadedNutritionalImgs = Object.values(nutritionalImgs);
    // delete the previous photo
    var storageRef = firebase.storage().ref();
    var ref = storageRef.child(currentRecipe.id + 0 + ".png");
    ref.delete().then(() => {}).catch((error) => {});
    // put the new photo
    firebase.storage().ref().child(currentRecipe.id + 0 + ".png")
      .put(uploadedNutritionalImgs[0]).on(firebase.storage.TaskEvent.STATE_CHANGED, {
        complete: function () {},
      });
    uploadedNutritionalURL[0] = currentRecipe.id + 0 + ".png"
    setUploadedNutritionalURL(uploadedNutritionalURL)
    db.collection('recipes').doc(currentRecipe.id).update({nutritionalImgs:uploadedNutritionalURL, dateUploaded: uploadDate})
    var index = Object.keys(recipesDic).indexOf(currentRecipe.id);
    recipesDic[currentRecipe.id]["nutritionalImgs"] = uploadedNutritionalURL;
    recipesDic[currentRecipe.id]["dateUploaded"] = uploadDate;
    recipes[index]["nutritionalImgs"] = uploadedNutritionalURL;
    recipes[index]["dateUploaded"] = uploadDate;
    alert("successfully edited nutritional image!");
    setNutritionalImgs({});
    setSelectedNutritionalImages([]);
		setUploadedNutritionalURL([]);
		uploadedNutritionalImgs = [];
    setOpenEditRecipeNutrition(false);
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
    var index = Object.keys(recipesDic).indexOf(currentRecipe.id);
    recipesDic[currentRecipe.id]["videoRecipe"] = recipeVideo;
    recipesDic[currentRecipe.id]["dateUploaded"] = uploadDate;
    recipes[index]["videoRecipe"] = recipeVideo;
    recipes[index]["dateUploaded"] = uploadDate;
    alert("successfully edited recipe video!");
    setRecipeVideo('');
    setOpenRecipeVideo(false);
  };

  // edit recipe skills
  const [recipeSkills, setRecipeSkills] = React.useState("");
  const [openViewRecipeSkills, setOpenViewRecipeSkills] = React.useState(false);
  const [openRecipeSkills, setOpenRecipeSkills] = React.useState(false);
  const [openSkill, setOpenSkill] = React.useState(false);
  const handleClickOpenViewRecipeSkills = (currentRecipe) => {
    setRecipeSkills(skillsDic[currentRecipe?.videoSkills]?.url)
    setOpenViewRecipeSkills(true);
    setCurrentRecipe(currentRecipe);
  };
  const handleCloseViewRecipeSkills = () => {
    setOpenViewRecipeSkills(false);
  };
  const handleClickOpenRecipeSkills = (currentRecipe) => {
    setRecipeSkills(skillsDic[currentRecipe?.videoSkills]?.url)
    setOpenRecipeSkills(true);
    setCurrentRecipe(currentRecipe);
  };
  const handleCloseSkill = () => {
    setOpenSkill(false);
  };
  const handleOpenSkill = () => {
    setOpenSkill(true);
  };
  const handleChangeSkill = (event) => {
    setRecipeSkills(event.target.value);
  };
  const handleCloseRecipeSkills = () => {
    setOpenRecipeSkills(false);
  };
  const handleSubmitRecipeSkills = (currentRecipe) => {
    db.collection('recipes').doc(currentRecipe.id).update({videoSkills:recipeSkills, dateUploaded: uploadDate})
    var index = Object.keys(recipesDic).indexOf(currentRecipe.id);
    recipesDic[currentRecipe.id]["videoSkills"] = recipeSkills;
    recipesDic[currentRecipe.id]["dateUploaded"] = uploadDate;
    recipes[index]["videoSkills"] = recipeSkills;
    recipes[index]["dateUploaded"] = uploadDate;
    alert("successfully edited recipe skills!");
    setRecipeSkills('');
    setOpenRecipeSkills(false);
  };

  // edit recipe tips
  const [recipeTips, setRecipeTips] = React.useState("");
  const [openViewRecipeTips, setOpenViewRecipeTips] = React.useState(false);
  const [openRecipeTips, setOpenRecipeTips] = React.useState(false);
  const [openTip, setOpenTip] = React.useState(false);
  const handleClickOpenViewRecipeTips = (currentRecipe) => {
    setRecipeTips(tipsDic[currentRecipe?.videoTips]?.url);
    setOpenViewRecipeTips(true);
    setCurrentRecipe(currentRecipe);
  };
  const handleCloseViewRecipeTips = () => {
    setOpenViewRecipeTips(false);
  };
  const handleClickOpenRecipeTips = (currentRecipe) => {
    setRecipeTips(tipsDic[currentRecipe?.videoTips]?.url);
    setOpenRecipeTips(true);
    setCurrentRecipe(currentRecipe);
  };
  const handleCloseTip = () => {
    setOpenTip(false);
  };
  const handleOpenTip = () => {
    setOpenTip(true);
  };
  const handleChangeTip = (event) => {
    setRecipeTips(event.target.value);
  };
  const handleCloseRecipeTips = () => {
    setOpenRecipeTips(false);
  };
  const handleSubmitRecipeTips = (currentRecipe) => {
    db.collection('recipes').doc(currentRecipe.id).update({videoTips:recipeTips, dateUploaded: uploadDate})
    var index = Object.keys(recipesDic).indexOf(currentRecipe.id);
    recipesDic[currentRecipe.id]["videoTips"] = recipeTips;
    recipesDic[currentRecipe.id]["dateUploaded"] = uploadDate;
    recipes[index]["videoTips"] = recipeTips;
    recipes[index]["dateUploaded"] = uploadDate;
    alert("successfully edited recipe tips!");
    setRecipeTips('');
    setOpenRecipeTips(false);
  };

  // delete recipe
  const [openDeleteRecipe, setOpenDeleteRecipe] = React.useState(false);
  const handleClickOpenDeleteRecipe = (currentRecipe) => {
    setOpenDeleteRecipe(true);
    setCurrentRecipe(currentRecipe);
  };
  const handleCloseDeleteRecipe = () => {
    setOpenDeleteRecipe(false);
  };
  const handleSubmitDeleteRecipe = (currentRecipe) => {
    var storageRef = firebase.storage().ref();
    for (let i = 0; i < currentRecipe.images.length; i++) {
      var ref = storageRef.child(currentRecipe.id + i + ".jpg");
      ref.delete().then(() => {}).catch((error) => {});
    }
    for (let i = 0; i < currentRecipe.recipeImgs.length; i++) {
      var ref = storageRef.child(currentRecipe.id + i + ".pdf");
      ref.delete().then(() => {}).catch((error) => {});
    }
    for (let i = 0; i < currentRecipe.nutritionalImgs.length; i++) {
      var ref = storageRef.child(currentRecipe.id + i + ".png");
      ref.delete().then(() => {}).catch((error) => {});
    }
    db.collection("recipes").doc(currentRecipe.id).delete();
    var index = Object.keys(recipesDic).indexOf(currentRecipe.id);
    recipesDic.delete(currentRecipe.id)
    recipes.splice(index, 1);
    setOpenDeleteRecipe(false);
    alert("successfully deleted the recipe.");
  };


  // ---------------------- 3: ADMIN MANAGE SKILLS ----------------------
  // edit skill name
  const [skillName, setSkillName] = React.useState("");
  const [openSkillName, setOpenSkillName] = React.useState(false);
  
  // edit skill name
  const handleClickOpenSkillName = (currentSkill) => {
    setSkillName(currentSkill.skillName)
    setOpenSkillName(true);
    setCurrentSkill(currentSkill);
  };
  const handleCloseSkillName = () => {
    setOpenSkillName(false);
  };
  const handleSubmitSkillName = (currentSkill) => {
    var index = Object.keys(skillsDic).indexOf(currentSkill.skillID);
    skillsDic[currentSkill.skillID]["skillName"] = skillName;
    skillsDic[currentSkill.skillID]["dateUploaded"] = uploadDate;
    skills[index]["skillName"] = skillName;
    skills[index]["dateUploaded"] = uploadDate;
    db.collection('skills').doc(currentSkill.skillID).update({skillName:skillName, dateUploaded: uploadDate})
    alert("successfully edited skill name!");
    setSkillName('');
    setOpenSkillName(false);
  };

  // edit skill images
  const [skillImages, setSkillImages] = React.useState([]);
  const [openSkillImages, setOpenSkillImages] = React.useState(false);
  const handleClickOpenSkillImages = (currentSkill) => {
    setSkillImages(currentSkill.images)
    setOpenSkillImages(true);
    setCurrentSkill(currentSkill);
  };
  const handleClickOpenViewSkillImages = (currentSkill) => {
    setViewSkillImages(skillsDic[currentSkill].images)
    setOpenSkillImages(true);
    setCurrentSkill(currentSkill);
  };
  const handleCloseSkillImages = () => {
    setOpenSkillImages(false);
  };
  const handleSubmitSkillImages = (currentSkill) => {
    var uploadedImages = Object.values(skillImages);
    db.collection('skills').doc(currentSkill.skillID).update({images:uploadedImages, dateUploaded: uploadDate})
    firebase.storage().ref().child(currentSkill.skillID+"_skill.jpg").putString(uploadedImages[0], 'data_url').on(firebase.storage.TaskEvent.STATE_CHANGED, {
        'complete': function() {
        }
    })
    var index = Object.keys(skillsDic).indexOf(currentSkill.skillID);
    skillsDic[currentSkill.skillID]["images"] = uploadedImages;
    skillsDic[currentSkill.skillID]["dateUploaded"] = uploadDate;
    skills[index]["images"] = uploadedImages;
    skills[index]["dateUploaded"] = uploadDate;
    alert("successfully edited skill images!");
    setSkillImages([]);
    setOpenSkillImages(false);
  };

  // edit skill video
  const [skillVideo, setSkillVideo] = React.useState("");
  const [openViewSkillVideo, setOpenViewSkillVideo] = React.useState(false);
  const [openSkillVideo, setOpenSkillVideo] = React.useState(false);
  const handleClickOpenViewSkillVideo = (currentSkill) => {
    setSkillVideo(currentSkill.url)
    setOpenViewSkillVideo(true);
    setCurrentSkill(currentSkill);
  };
  const handleCloseViewSkillVideo = () => {
    setOpenViewSkillVideo(false);
  };
  const handleClickOpenSkillVideo = (currentSkill) => {
    setSkillVideo(currentSkill.url)
    setOpenSkillVideo(true);
    setCurrentSkill(currentSkill);
  };
  const handleCloseSkillVideo = () => {
    setOpenSkillVideo(false);
  };
  const handleSubmitSkillVideo = (currentSkill) => {
    db.collection('skills').doc(currentSkill.skillID).update({url:skillVideo, dateUploaded: uploadDate})
    var index = Object.keys(skillsDic).indexOf(currentSkill.skillID);
    skillsDic[currentSkill.skillID]["url"] = skillVideo;
    skillsDic[currentSkill.skillID]["dateUploaded"] = uploadDate;
    skills[index]["url"] = skillVideo;
    skills[index]["dateUploaded"] = uploadDate;
    alert("successfully edited skill video!");
    setSkillVideo('');
    setOpenSkillVideo(false);
  };
  
  // delete recipe
  const [openDeleteSkill, setOpenDeleteSkill] = React.useState(false);
  const handleClickOpenDeleteSkill = (currentSkill) => {
    setOpenDeleteSkill(true);
    setCurrentSkill(skillsDic[currentSkill].skillName);
  };
  const handleCloseDeleteSkill = () => {
    setOpenDeleteSkill(false);
  };
  const handleSubmitDeleteSkill = (currentSkill) => {
    db.collection("skills").doc(skillID).delete();
    var index = Object.keys(skillsDic).indexOf(skillID);
    skillsDic.delete(currentSkill.skillID)
    skills.splice(index, 1);
    setOpenDeleteSkill(false);
    alert("successfully deleted the skill.");
  };


  // ---------------------- 4: ADMIN MANAGE TIPS ----------------------
  // edit tip name
  const [tipName, setTipName] = React.useState("");
  const [tipID, setTipID] = React.useState("");
  const [openTipName, setOpenTipName] = React.useState(false);
  
  // edit tip name
  const handleClickOpenTipName = (currentTip) => {
    setTipName(currentTip.tipName)
    setOpenTipName(true);
    setCurrentTip(currentTip);
  };
  const handleCloseTipName = () => {
    setOpenTipName(false);
  };
  const handleSubmitTipName = (currentTip) => {
    db.collection('tips').doc(currentTip.tipID).update({tipName:tipName, dateUploaded: uploadDate})
    var index = Object.keys(tipsDic).indexOf(currentTip.tipID);
    tipsDic[currentTip.tipID]["tipName"] = tipName;
    tipsDic[currentTip.tipID]["dateUploaded"] = uploadDate;
    tips[index]["tipName"] = tipName;
    tips[index]["dateUploaded"] = uploadDate;
    alert("successfully edited tip name!");
    setTipName('');
    setOpenTipName(false);
  };

  // edit tip images
  const [tipImages, setTipImages] = React.useState([]);
  const [openTipImages, setOpenTipImages] = React.useState(false);
  const handleClickOpenTipImages = (currentTip) => {
    setTipImages(currentTip.images)
    setOpenTipImages(true);
    setCurrentTip(currentTip);
  };
  const handleClickOpenViewTipImages = (currentTip) => {
    setViewTipImages(tipsDic[currentTip].images)
    setOpenTipImages(true);
    setCurrentTip(currentTip);
  };
  const handleCloseTipImages = () => {
    setOpenTipImages(false);
  };
  const handleSubmitTipImages = (currentTip) => {
    var uploadedImages = Object.values(tipImages);
    db.collection('tips').doc(currentTip.tipID).update({images:uploadedImages, dateUploaded: uploadDate})
    firebase.storage().ref().child(currentTip.tipID+"_tip.jpg").putString(uploadedImages[0], 'data_url').on(firebase.storage.TaskEvent.STATE_CHANGED, {
        'complete': function() {
        }
    })
    var index = Object.keys(tipsDic).indexOf(currentTip.tipID);
    tipsDic[currentTip.tipID]["images"] = uploadedImages;
    tipsDic[currentTip.tipID]["dateUploaded"] = uploadDate;
    tips[index]["images"] = uploadedImages;
    tips[index]["dateUploaded"] = uploadDate;
    alert("successfully edited tip images!");
    setTipImages([]);
    setOpenTipImages(false);
  };

  // edit tip video
  const [tipVideo, setTipVideo] = React.useState("");
  const [openViewTipVideo, setOpenViewTipVideo] = React.useState(false);
  const [openTipVideo, setOpenTipVideo] = React.useState(false);
  const handleClickOpenViewTipVideo = (currentTip) => {
    setTipVideo(currentTip.url)
    setOpenViewTipVideo(true);
    setCurrentTip(currentTip);
  };
  const handleCloseViewTipVideo = () => {
    setOpenViewTipVideo(false);
  };
  const handleClickOpenTipVideo = (currentTip) => {
    setTipVideo(currentTip.url)
    setOpenTipVideo(true);
    setCurrentTip(currentTip);
  };
  const handleCloseTipVideo = () => {
    setOpenTipVideo(false);
  };
  const handleSubmitTipVideo = (currentTip) => {
    db.collection('tips').doc(currentTip.id).update({url:tipVideo, dateUploaded: uploadDate})
    var index = Object.keys(tipsDic).indexOf(currentTip.tipID);
    tipsDic[currentTip.tipID]["url"] = tipVideo;
    tipsDic[currentTip.tipID]["dateUploaded"] = uploadDate;
    tips[index]["url"] = tipVideo;
    tips[index]["dateUploaded"] = uploadDate;
    alert("successfully edited tip video!");
    setTipVideo('');
    setOpenTipVideo(false);
  };
  
  // delete tip
  const [openDeleteTip, setOpenDeleteTip] = React.useState(false);
  const handleClickOpenDeleteTip = (currentTip) => {
    setTipID(currentTip);
    setOpenDeleteTip(true);
    setCurrentTip(tipsDic[currentTip].tipName);
  };
  const handleCloseDeleteTip = () => {
    setOpenDeleteTip(false);
  };
  const handleSubmitDeleteTip = (currentTip) => {
    db.collection("tips").doc(tipID).delete();
    var index = Object.keys(currentTip).indexOf(tipID);
    tipsDic.delete(currentTip.tipID)
    tips.splice(index, 1);
    setOpenDeleteTip(false);
    alert("successfully deleted the tip.");
  };

  if (_.isEqual(users,[]) || !usersDic || _.isEqual(recipes,[]) || !recipesDic || 
      _.isEqual(programs,[]) || !programsDic || _.isEqual(skills,[]) || !skillsDic || 
      _.isEqual(tips,[]) || !tipsDic || !codes) {
    if (!usersDic) {
      return "Loading usersDic...";
    } if (!recipesDic) {
      return "Loading recipesDic...";
    } if (!programsDic) {
      return "Loading programsDic...";
    } if (!skillsDic) {
      return "Loading skillsDic...";
    } if (!tipsDic) {
      return "Loading tipsDic...";
    } if (!codes) {
      return "Loading codes...";
    }
    setUsers(Object.keys(usersDic).map(function (key) {
      return usersDic[key];
    }));
    setRecipes(Object.keys(recipesDic).map(function (key) {
      return recipesDic[key];
    }));
    setPrograms(Object.keys(programsDic).map(function (key) {
      return programsDic[key];
    }));
    setSkills(Object.keys(skillsDic).map(function (key) {
      return skillsDic[key];
    }));
    setTips(Object.keys(tipsDic).map(function (key) {
      return tipsDic[key];
    }));
    if (_.isEqual(users,[])) {
      return "Loading users...";
    } if (_.isEqual(recipes,[])) {
      return "Loading recipes...";
    } if (_.isEqual(programs,[])) {
      return "Loading programs...";
    } if (_.isEqual(skills,[])) {
      return "Loading skills...";
    } if (_.isEqual(tips,[])) {
      return "Loading tips...";
    }
  }

  const handleChange = (e) => {
    setSearch(e.target.value);
  };
  const handleChangeRecipe = (e) => {
    setSearchRecipe(e.target.value);
  };
  const handleChangeSearchSkill = (e) => {
    setSearchSkill(e.target.value);
  };
  const handleChangeSearchTip = (e) => {
    setSearchTip(e.target.value);
  };
  const handleChangeSearchProgram = (e) => {
    setSearchProgram(e.target.value);
  };

  const userData = getUserFromCookie();

  if(!userData || "code" in userData || userData["role"] != "admin") {
    router.push("/");
  }
  else if(!("firstname" in userData)) {
    router.push("/profile/makeProfile");
  }

  return (
    <div>
        <div style={{paddingTop: "7rem",width: "100%",minWidth: "29%"}}></div>

        {/* ---------------------------- 0: ADMIN MANAGE USERS ---------------------------- */}
        <TabPanel value={value} index={0} dir={theme.direction}>
          <Grid container spacing={3} justify="center">
            <Grid item xs={12} sm={11} md={10} lg={9}>
              <TextField label="search email" value={search} onChange={handleChange}/>
              {users.map((value) => {
                if (value["email"]?.includes(search) || value["email"].toLowerCase()?.includes(search) ||
                (value["firstname"]+' '+value["lastname"])?.includes(search) || (value["firstname"]+' '+value["lastname"]).toLowerCase()?.includes(search)) {
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
                          <li>Email: {value?.email}</li>
                          <li>Phone: {value?.phone}</li>
                          <li>Delivery Address: {value?.deliveryAddress}</li>
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
                      <MenuItem value={programss["program"]}> {programss["programName"]} </MenuItem>)
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
                <Button onClick={() => handleSubmitDeleteUser(currentUser)} color="primary"> Ok </Button>
              </DialogActions>
            </Dialog>
          </div>
        )}
        </TabPanel>

        {/* ---------------------------- 1: ADMIN MANAGE PROGRAMS ---------------------------- */}
        <TabPanel value={value} index={1} dir={theme.direction}>
          <Grid container>
            <Grid item xs={12}>
              <Grid container direction="row" spacing={3}>
                <Grid item container xs={12} sm={2} md={2} justify="left">
                  <List dense>
                    <ListItem key={"Add New Program"} button selected={true}>
                      <Button variant="outlined" fullWidth onClick={() => handleClickOpenAddProgram()}> Add New Program </Button>
                    </ListItem>

                    <TextField label="search program" value={searchProgram} onChange={handleChangeSearchProgram}/>
                    {programs.map((value) => {
                      if (value?.programName?.includes(searchProgram) || value?.programName?.toLowerCase()?.includes(searchProgram)) {
                        return (
                          <Grid item>                      
                            <ListItem key={value?.program} button selected={value.program == selectedProgramProgram?.program ? true : false}
                              onClick={() => {setSelectedProgramProgram(value.program); setSelectedProgram(value); setRowsFunc(value)}}>
                              <ListItemText>{value?.programName}</ListItemText>
                            </ListItem>
                            <Divider light />
                          </Grid>);}
                      })}
                  </List>
                </Grid>
                <Grid item xs={12} sm={5} md={5}><Grid container direction="column">
                  {_.isEqual(selectedProgramProgram, {}) ? <h4>Please select a program</h4> :
                    <div> 
                      <h2>Program: {selectedProgramProgram?.programName}</h2>
                      {/* ----------------------- delete program ----------------------- */}
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
                                  id="date" label="Date" type="date" defaultValue={programsDic[selectedProgramProgram?.program]?.programRecipes[row.id]}
                                  className={classes.textField} InputLabelProps={{shrink: true,}}
                                  onChange={(e) => {
                                    var dic = programsDic[selectedProgramProgram?.program]?.programRecipes
                                    dic[row.id] = e.target.value;
                                    db.collection('programs').doc(selectedProgramProgram?.program).update({programRecipes: dic})
                                  }
                                  }
                                />
                              </StyledTableCell>
                            </StyledTableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    {typeof(selectedProgramProgram) === "object" && "programEndDate" in selectedProgramProgram &&
                      <div>
                        <h4>End Date: {getDateString(selectedProgramProgram?.programEndDate)}
                        <IconButton onClick={() => setOpenChangeProgramEndDate(true)}><EditIcon/></IconButton>
                        </h4>
                        
                      </div>
                    }
                  </div>}
                </Grid>
              </Grid>
                <Grid item xs={12} sm={5} md={5}><Grid container direction="column">
                  {_.isEqual(selectedProgramProgram, {}) ? <h4></h4> :
                    <div> {/* ----------------------- edit users list ----------------------- */}
                      <List>
                        <ListItemText> Users List
                        {/* <IconButton onClick={() => handleClickOpenEditProgramUsers(selectedProgramProgram)}><EditIcon/></IconButton> */}
                        </ListItemText>
                      </List> 
                    </div>
                  }
                  {selectedProgramProgram?.programUsers != undefined ?
                  Object.values(selectedProgramProgram?.programUsers).map((value) => {
                    if (usersDic[value]?.firstname != undefined) {
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
                    }
                    }) : <Grid></Grid>
                  }
                  {<div>
                    {currentCodes != null && numProgramCodes > 0 && (
                      <div> {/* ----------------------- edit users list ----------------------- */}
                      <List>
                        <ListItemText> Unused Codes - {numProgramCodes}
                        </ListItemText>
                      </List>
                      <Paper style={{maxHeight: 260, overflow: 'auto'}}>
                        <List>
                          {codes.map((code) => {
                          if(code?.program == selectedProgramProgram?.program) {
                            return (
                              <ListItem>
                                <ListItemAvatar>
                                  <Avatar/>
                                </ListItemAvatar>
                                <ListItemText primary={code?.codeID}/>
                                <ListItemSecondaryAction>
                                  <IconButton edge="end" aria-label="delete" onClick={() => deleteCode(code?.codeID, false)}>
                                    <DeleteIcon />
                                  </IconButton>
                                </ListItemSecondaryAction>
                              </ListItem>
                            )}
                          })}
                        </List>
                      </Paper>
                      </div>)
                      }
                      {!_.isEqual(selectedProgramProgram, {}) ?
                        <ListItem key={"Add Code"}>
                          <Button variant="outlined" fullWidth onClick={() => setOpenAddCodes(true)}>Add Codes </Button>
                        </ListItem> 
                        : <Grid></Grid>  
                      }
                    </div>
                  }
                  {Object.keys(selectedProgramProgram).length > 0 && currentCodes != null && numProgramCodes > 0 ?
                    <div>
                      <ListItem key={"Delete Code"}>
                        <Button variant="outlined" fullWidth onClick={() => setOpenDeleteCodes(true)}>Delete Codes </Button>
                      </ListItem>
                    </div> : <Grid></Grid>
                  }
                </Grid></Grid>
              </Grid>
            </Grid>
          </Grid>

          {/* edit program */}
          <Dialog disableBackdropClick disableEscapeKeyDown open={openAddProgram} onClose={handleCloseAddProgram}>
            <DialogTitle>Add New Program</DialogTitle>
            <DialogContent>
              <Grid container alignItems="center" direction="column">
                <Grid item style={{marginBottom: "8px"}}>
                  <TextField value={addedProgram} label="New Program" multiline onChange={(e) => setAddedProgram(e.target.value)} fullWidth variant="outlined"/>
                </Grid>
                <Grid item style={{marginBottom: "8px"}}>
                  <TextField value={addedProgramNumUsers || ''} label="Number of Users" multiline onChange={(e) => setAddedProgramNumUsers(e.target.value)} fullWidth variant="outlined"/>
                </Grid>
                <Grid item><TextField
                  id="end-date" label="End Date" type="date" defaultValue={addedProgramEndDate}
                  className={classes.textField} InputLabelProps={{shrink: true,}}
                  onChange={(e) => setAddedProgramEndDate(e.target.value)}
                /></Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseAddProgram} color="primary"> Cancel </Button>
              <Button onClick={() => addProgram()} color="primary"> Confirm </Button>
            </DialogActions>
          </Dialog>
          <Dialog disableBackdropClick disableEscapeKeyDown open={openDeleteProgram} onClose={handleCloseDeleteProgram}>
            <DialogTitle>Delete {selectedProgramProgram.programName}?</DialogTitle>
            <DialogActions>
              <Button onClick={handleCloseDeleteProgram} color="primary"> Cancel </Button>
              <Button onClick={() => deleteProgram()} color="primary"> Confirm </Button>
            </DialogActions>
          </Dialog>
          <Dialog disableBackdropClick disableEscapeKeyDown open={openAddCodes}>
            <DialogTitle>Add Codes</DialogTitle>
            <DialogContent>
              <TextField value={numCodes || ''} label="Number of Codes" onChange={(e) => setNumCodes(e.target.value)} fullWidth variant="outlined"/>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => {setOpenAddCodes(false);setNumCodes('')}} color="primary"> Cancel </Button>
              <Button onClick={() => addCodes()} color="primary"> Confirm </Button>
            </DialogActions>
          </Dialog>
          <Dialog disableBackdropClick disableEscapeKeyDown open={openDeleteCodes}>
            <DialogTitle>Delete Codes</DialogTitle>
            <DialogContent>
              <TextField value={numCodes || ''} label="Number of Codes" onChange={(e) => setNumCodes(e.target.value)} fullWidth variant="outlined"/>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => {setOpenDeleteCodes(false);setNumCodes('')}} color="primary"> Cancel </Button>
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
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseEditProgramRecipes} color="primary"> Cancel </Button>
                <Button onClick={() => handleSubmitEditProgramRecipes()} color="primary"> Ok </Button>
              </DialogActions>
            </Dialog>
          )}
        </TabPanel>

        {/* ---------------------------- 2: ADMIN MANAGE RECIPES ---------------------------- */}
        <TabPanel value={value} index={2} dir={theme.direction}>
          <Grid container spacing={3} justify="center">
            <Grid item xs={11} md={10} lg={9}>
              <TextField label="search recipe" value={searchRecipe} onChange={handleChangeRecipe}/>
              {recipes.sort((a, b) => a.dateUploaded < b.dateUploaded ? 1:-1)
              .map((value) => {
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
                          <li>Ingredients / Allergens: {value?.descriptionIngredients} <IconButton onClick={() => handleClickOpenRecipeDescriptionIngredients(value)}> <EditIcon/> </IconButton></li>
                          <li>Recipe Fact: {value?.recipeFact} <IconButton onClick={() => handleClickOpenRecipeFact(value)}> <EditIcon/> </IconButton></li>
                          {/* ----------------------- display date modified, rating, num ratings, num favorites ----------------------- */}
                          <li>Date last modified: {getTimeString(value?.dateUploaded)}</li>
                          <li>Rating: {value?.avgRating}</li>
                          <li>Number of ratings: {value?.numRatings}</li>
                          <li>Number of favorites: {value?.numFavorites}</li>
                          {/* ----------------------- display / edit images, pdf, videos ----------------------- */}
                          <li>Cover images <IconButton onClick={() => handleClickOpenRecipeImages(value)}> <EditIcon/> </IconButton></li>
                          <li>Instruction images
                            <IconButton onClick={() => handleClickOpenViewRecipeInstruction(value)}> <VisibilityIcon/> </IconButton>
                            <IconButton onClick={() => handleClickOpenAddRecipeInstruction(value)}> <AddIcon/> </IconButton>
                            <IconButton onClick={() => handleClickOpenRemoveRecipeInstruction(value)}> <RemoveIcon/> </IconButton>
                          </li>
                          <li>Nutrition image
                            <IconButton onClick={() => handleClickOpenViewRecipeNutrition(value)}> <VisibilityIcon/> </IconButton>
                            <IconButton onClick={() => handleClickOpenEditRecipeNutrition(value)}> <EditIcon/> </IconButton>
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
                          <li><IconButton onClick={() => handleClickOpenDeleteRecipe(value)}> <DeleteIcon /> </IconButton></li>
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
            <Dialog disableBackdropClick disableEscapeKeyDown open={openRecipeDescriptionIngredients} onClose={handleCloseRecipeDescriptionIngredients}>
              <DialogTitle>Edit Recipe Ingredients / Allergens</DialogTitle>
              <DialogContent>
                  <TextField
                      value={recipeDescriptionIngredients} label="Edit Recipe Ingredients / Allergens" multiline
                      onChange={(e) => setRecipeDescriptionIngredients(e.target.value)} fullWidth variant="outlined"/>
                  <Button onClick={handleCloseRecipeDescriptionIngredients} color="primary"> Cancel </Button>
                  <Button onClick={() => handleSubmitRecipeDescriptionIngredients(currentRecipe)} color="primary"> Confirm </Button>
              </DialogContent>
            </Dialog>
          )}
          {currentRecipe && (
            <Dialog disableBackdropClick disableEscapeKeyDown open={openRecipeFact} onClose={handleCloseRecipeFact}>
              <DialogTitle>Edit Recipe Fact</DialogTitle>
              <DialogContent>
                  <TextField
                      value={recipeFact} label="Edit Recipe Fact" multiline
                      onChange={(e) => setRecipeFact(e.target.value)} fullWidth variant="outlined"/>
                  <Button onClick={handleCloseRecipeFact} color="primary"> Cancel </Button>
                  <Button onClick={() => handleSubmitRecipeFact(currentRecipe)} color="primary"> Confirm </Button>
              </DialogContent>
            </Dialog>
          )}
          {currentRecipe && (
            <Dialog disableBackdropClick disableEscapeKeyDown open={openRecipeImages} onClose={handleCloseRecipeImages}>
              <DialogTitle>Edit Cover Images</DialogTitle>
              <DialogContent>
                  <MultiImageInput
                    images={recipeImages} setImages={setRecipeImages}
                    cropConfig={{ crop, ruleOfThirds: true }} inputId  max={3}
                  />
                  <Button onClick={handleCloseRecipeImages} color="primary"> Cancel </Button>
                  <Button onClick={() => handleSubmitRecipeImages(currentRecipe)} color="primary"> Confirm </Button>
              </DialogContent>
            </Dialog>
          )}
          {currentRecipe && (
            <Dialog disableBackdropClick disableEscapeKeyDown open={openViewRecipeInstruction} onClose={handleCloseViewRecipeInstruction}>
              <DialogTitle>View Instruction</DialogTitle>
              <DialogContent>
                  <ol className={classes.lst}>
                    {selectedInstructionImages.map((url) => {
                      if (!_.isEqual(url, "")) {
                        return ( <li><img display="block" style={{width:'100%',height:'100%'}} height="auto" display="block" src={url} alt="Recipe image" /></li> )}
                      }
                    )}
                  </ol>
                  <Button onClick={handleCloseViewRecipeInstruction} color="primary"> Close </Button>
              </DialogContent>
            </Dialog>
          )}
          {currentRecipe && (
            <Dialog disableBackdropClick disableEscapeKeyDown open={openAddRecipeInstruction} onClose={handleCloseAddRecipeInstruction}>
              <DialogTitle>Add Instruction Facts</DialogTitle>
              <DialogContent>
                  <input type="file" id="file" accept="image/*" multiple onChange={handleInstructionChange} />
                  <div className="result">{renderInstruction(selectedInstructionImages)}</div>
                  <Button onClick={handleCloseAddRecipeInstruction} color="primary"> Cancel </Button>
                  <Button onClick={() => handleSubmitAddRecipeInstruction(currentRecipe)} color="primary"> Confirm </Button>
              </DialogContent>
            </Dialog>
          )}
          {currentRecipe && (
            <Dialog disableBackdropClick disableEscapeKeyDown open={openRemoveRecipeInstruction} onClose={handleCloseRemoveRecipeInstruction}>
              <DialogTitle>Remove Instruction Facts</DialogTitle>
              <DialogContent>
                  <div className="result">{renderRemoveInstruction(selectedInstructionImages)}</div>
                  <Button onClick={handleCloseRemoveRecipeInstruction} color="primary"> Cancel </Button>
                  <Button onClick={() => handleSubmitRemoveRecipeInstruction(currentRecipe)} color="primary"> Confirm </Button>
              </DialogContent>
            </Dialog>
          )}
          {currentRecipe && (
            <Dialog disableBackdropClick disableEscapeKeyDown open={openViewRecipeNutrition} onClose={handleCloseViewRecipeNutrition}>
              <DialogTitle>View Nutritional Facts</DialogTitle>
              <DialogContent>
                  <ol className={classes.lst}>
                    {selectedNutritionalImages.map((url) => {
                      if (!_.isEqual(url, "")) {
                        return ( <li><img display="block" style={{width:'100%',height:'100%'}} src={url} alt="Recipe image" /></li> )}
                      }
                    )}
                  </ol>
                  <Button onClick={handleCloseViewRecipeNutrition} color="primary"> Close </Button>
              </DialogContent>
            </Dialog>
          )}
          {currentRecipe && (
            <Dialog disableBackdropClick disableEscapeKeyDown open={openEditRecipeNutrition} onClose={handleCloseEditRecipeNutrition}>
              <DialogTitle>Edit Nutritional Facts</DialogTitle>
              <DialogContent>
                  <input type="file" id="file" accept="image/*" onChange={handleNutritionalChange} />
                  <div className="result">{renderNutritional(selectedNutritionalImages)}</div>
                  <Button onClick={handleCloseEditRecipeNutrition} color="primary"> Cancel </Button>
                  <Button onClick={() => handleSubmitEditRecipeNutrition(currentRecipe)} color="primary"> Confirm </Button>
              </DialogContent>
            </Dialog>
          )}
          {currentRecipe && (
            <Dialog disableBackdropClick disableEscapeKeyDown open={openViewRecipeVideo} onClose={handleCloseViewRecipeVideo}>
              <DialogTitle>View Recipe Video</DialogTitle>
              <DialogContent>
                  {(recipeVideo != "") ? 
                    <iframe position="fixed" src={"https://player.vimeo.com/video/"+recipeVideo} width="100%" height={(width*0.625)} frameBorder="0" align="center" position="sticky" allow="autoplay; fullscreen"></iframe>
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
                    <iframe position="fixed" src={"https://player.vimeo.com/video/"+recipeSkills} width="100%" height={(width*0.625)} frameBorder="0" align="center" position="sticky" allow="autoplay; fullscreen"></iframe>
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
                <Grid item xs={12} sm={6}>
                <InputLabel id="demo-simple-select-label">Skill: {skillsDic[currentRecipe["videoSkills"]]?.skillName}</InputLabel>
                <Select
                    autoWidth="false"
                    labelId="demo-controlled-open-select-label"
                    id="demo-controlled-open-select"
                    open={openSkill}
                    onClose={handleCloseSkill}
                    onOpen={handleOpenSkill}
                    value={recipeSkills}
                    onChange={handleChangeSkill}
                    >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {skills.map((skillss) =>
                        <MenuItem value={skillss["skillID"]}> {skillss["skillName"]} </MenuItem>)
                    }
                </Select>
                </Grid>
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
                    <iframe position="fixed" src={"https://player.vimeo.com/video/"+recipeTips} width="100%" height={(width*0.625)} frameBorder="0" align="center" position="sticky" allow="autoplay; fullscreen"></iframe>
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
                <Grid item xs={12} sm={6}>
                <InputLabel id="demo-simple-select-label">Tip: {tipsDic[currentRecipe["videoTips"]]?.tipName}</InputLabel>
                <Select
                    autoWidth="false"
                    labelId="demo-controlled-open-select-label"
                    id="demo-controlled-open-select"
                    open={openTip}
                    onClose={handleCloseTip}
                    onOpen={handleOpenTip}
                    value={recipeTips}
                    onChange={handleChangeTip}
                    >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {tips.map((tipss) =>
                        <MenuItem value={tipss["tipID"]}> {tipss["tipName"]} </MenuItem>)
                    }
                </Select>
                </Grid>
                <Button onClick={handleCloseRecipeTips} color="primary"> Cancel </Button>
                <Button onClick={() => handleSubmitRecipeTips(currentRecipe)} color="primary"> Confirm </Button>
              </DialogContent>
            </Dialog>
          )}
          {currentRecipe && (
            <Dialog disableBackdropClick disableEscapeKeyDown open={openDeleteRecipe} onClose={handleCloseDeleteRecipe}>
              <DialogTitle>Are you sure you want to delete the recipe: {currentRecipe.nameOfDish}?</DialogTitle>
              <DialogActions>
                <Button onClick={handleCloseDeleteRecipe} color="primary"> Cancel </Button>
                <Button onClick={() => handleSubmitDeleteRecipe(currentRecipe)} color="primary"> Ok </Button>
              </DialogActions>
            </Dialog>
          )}

        </TabPanel>

        {/* ---------------------- 3: ADMIN MANAGE SKILLS ---------------------- */}
        <TabPanel value={value} index={3} dir={theme.direction}>
          <Grid container spacing={3} justify="center">
            <Grid item xs={11} md={10} lg={9}>
              <TextField label="search skill" value={searchSkill} onChange={handleChangeSearchSkill}/>
              {skills.map((value) => {
                if (value["skillName"]?.includes(searchSkill) || value["skillName"].toLowerCase()?.includes(searchSkill)) {
                  return (
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                        <ListItemAvatar>
                          <Avatar
                          // alt={`Avatar n°${value + 1}`}
                          // src={`/static/images/avatar/${value + 1}.jpg`}
                          />
                        </ListItemAvatar>
                        <ListItemText primary={value?.skillName}/>
                      </AccordionSummary>
                      <AccordionDetails>
                        <ol className={classes.noNum}>
                          {/* ----------------------- edit skill name, description ----------------------- */}
                          <li>Name of skill: {value?.skillName} <IconButton onClick={() => handleClickOpenSkillName(value)}> <EditIcon/> </IconButton></li>
                          {/* ----------------------- display date modified, num favorites ----------------------- */}
                          <li>Date last modified: {getTimeString(value?.dateUploaded)}</li>
                          <li>Number of favorites: {value?.numFavorites}</li>
                          {/* ----------------------- display / edit images, pdf, videos ----------------------- */}
                          <li>Skill images <IconButton onClick={() => handleClickOpenSkillImages(value)}> <EditIcon/> </IconButton></li>
                          <li>Skill video
                            <IconButton onClick={() => handleClickOpenViewSkillVideo(value)}> <VisibilityIcon/> </IconButton>
                            <IconButton onClick={() => handleClickOpenSkillVideo(value)}> <EditIcon/> </IconButton>
                          </li>
                          {/* ---------------------------- delete skill ---------------------------- */}
                          <li><IconButton onClick={() => handleClickOpenDeleteSkill(value.skillID)}> <DeleteIcon /> </IconButton></li>
                        </ol>
                      </AccordionDetails>
                    </Accordion>
                  );
                }
              })}
            </Grid>
          </Grid>

          {/* manage skillss Dialog */}
          {currentSkill && (
            <Dialog disableBackdropClick disableEscapeKeyDown open={openSkillName} onClose={handleCloseSkillName}>
              <DialogTitle>Edit Skill Name</DialogTitle>
              <DialogContent>
                  <TextField
                      value={skillName} label="Edit Skill Name" multiline
                      onChange={(e) => setSkillName(e.target.value)} fullWidth variant="outlined"/>
                  <Button onClick={handleCloseSkillName} color="primary"> Cancel </Button>
                  <Button onClick={() => handleSubmitSkillName(currentSkill)} color="primary"> Confirm </Button>
              </DialogContent>
            </Dialog>
          )}
          {currentSkill && (
            <Dialog disableBackdropClick disableEscapeKeyDown open={openSkillImages} onClose={handleCloseSkillImages}>
              <DialogTitle>Edit Skill Images</DialogTitle>
              <DialogContent>
                  <MultiImageInput
                    images={skillImages} setImages={setSkillImages}
                    cropConfig={{ crop, ruleOfThirds: true }} inputId max={1}
                  />
                  <Button onClick={handleCloseSkillImages} color="primary"> Cancel </Button>
                  <Button onClick={() => handleSubmitSkillImages(currentSkill)} color="primary"> Confirm </Button>
              </DialogContent>
            </Dialog>
          )}
          {currentSkill && (
            <Dialog disableBackdropClick disableEscapeKeyDown open={openViewSkillVideo} onClose={handleCloseViewSkillVideo}>
              <DialogTitle>View Skill Video</DialogTitle>
              <DialogContent>
                  {(skillVideo != "") ? 
                    <iframe position="fixed" src={"https://player.vimeo.com/video/"+skillVideo} width="100%" height={(width*0.625)} frameBorder="0" align="center" position="sticky" allow="autoplay; fullscreen"></iframe>
                    : <h4>No skill video to display</h4>
                  }
                  <Button onClick={handleCloseViewSkillVideo} color="primary"> Back </Button>
              </DialogContent>
            </Dialog>
          )}
          {currentSkill && (
            <Dialog disableBackdropClick disableEscapeKeyDown open={openSkillVideo} onClose={handleCloseSkillVideo}>
              <DialogTitle>Edit Skill Video</DialogTitle>
              <DialogContent>
                  <TextField
                      required value={skillVideo} label="Vimeo Skill Video ID"
                      onChange={(e) => setSkillVideo(e.target.value)} fullWidth variant="outlined"/>
                  <Button onClick={handleCloseSkillVideo} color="primary"> Cancel </Button>
                  <Button onClick={() => handleSubmitSkillVideo(currentSkill)} color="primary"> Confirm </Button>
              </DialogContent>
            </Dialog>
          )}
          {currentSkill && (
            <Dialog disableBackdropClick disableEscapeKeyDown open={openDeleteSkill} onClose={handleCloseDeleteSkill}>
              <DialogTitle>Are you sure you want to delete the skill: {currentSkill}?</DialogTitle>
              <DialogActions>
                <Button onClick={handleCloseDeleteSkill} color="primary"> Cancel </Button>
                <Button onClick={() => handleSubmitDeleteSkill(currentSkill)} color="primary"> Ok </Button>
              </DialogActions>
            </Dialog>
          )}
        </TabPanel>

        {/* ---------------------- 4: ADMIN MANAGE TIPS ---------------------- */}
        {/* manage tipss Dialog */}
        <TabPanel value={value} index={4} dir={theme.direction}>
          <Grid container spacing={3} justify="center">
            <Grid item xs={11} md={10} lg={9}>
              <TextField label="search tip" value={searchTip} onChange={handleChangeSearchTip}/>
              {tips.map((value) => {
                if (value["tipName"]?.includes(searchTip) || value["tipName"].toLowerCase()?.includes(searchTip)) {
                  return (
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                        <ListItemAvatar>
                          <Avatar
                          // alt={`Avatar n°${value + 1}`}
                          // src={`/static/images/avatar/${value + 1}.jpg`}
                          />
                        </ListItemAvatar>
                        <ListItemText primary={value?.tipName}/>
                      </AccordionSummary>
                      <AccordionDetails>
                        <ol className={classes.noNum}>
                          {/* ----------------------- edit tip name, description ----------------------- */}
                          <li>Name of skill: {value?.tipName} <IconButton onClick={() => handleClickOpenTipName(value)}> <EditIcon/> </IconButton></li>
                          {/* ----------------------- display date modified, num favorites ----------------------- */}
                          <li>Date last modified: {getTimeString(value?.dateUploaded)}</li>
                          <li>Number of favorites: {value?.numFavorites}</li>
                          {/* ----------------------- display / edit images, pdf, videos ----------------------- */}
                          <li>Tip images <IconButton onClick={() => handleClickOpenTipImages(value)}> <EditIcon/> </IconButton></li>
                          <li>Tip video
                            <IconButton onClick={() => handleClickOpenViewTipVideo(value)}> <VisibilityIcon/> </IconButton>
                            <IconButton onClick={() => handleClickOpenTipVideo(value)}> <EditIcon/> </IconButton>
                          </li>
                          {/* ---------------------------- delete skill ---------------------------- */}
                          <li><IconButton onClick={() => handleClickOpenDeleteTip(value.tipID)}> <DeleteIcon /> </IconButton></li>
                        </ol>
                      </AccordionDetails>
                    </Accordion>
                  );
                }
              })}
            </Grid>
          </Grid>

          {/* manage tips Dialog */}
          {currentTip && (
            <Dialog disableBackdropClick disableEscapeKeyDown open={openTipName} onClose={handleCloseTipName}>
              <DialogTitle>Edit Tip Name</DialogTitle>
              <DialogContent>
                  <TextField
                      value={tipName} label="Edit Tip Name" multiline
                      onChange={(e) => setTipName(e.target.value)} fullWidth variant="outlined"/>
                  <Button onClick={handleCloseTipName} color="primary"> Cancel </Button>
                  <Button onClick={() => handleSubmitTipName(currentTip)} color="primary"> Confirm </Button>
              </DialogContent>
            </Dialog>
          )}
          {currentTip && (
            <Dialog disableBackdropClick disableEscapeKeyDown open={openTipImages} onClose={handleCloseTipImages}>
              <DialogTitle>Edit Tip Images</DialogTitle>
              <DialogContent>
                  <MultiImageInput
                    images={tipImages} setImages={setTipImages}
                    cropConfig={{ crop, ruleOfThirds: true }} inputId max={1}
                  />
                  <Button onClick={handleCloseTipImages} color="primary"> Cancel </Button>
                  <Button onClick={() => handleSubmitTipImages(currentTip)} color="primary"> Confirm </Button>
              </DialogContent>
            </Dialog>
          )}
          {currentTip && (
            <Dialog disableBackdropClick disableEscapeKeyDown open={openViewTipVideo} onClose={handleCloseViewTipVideo}>
              <DialogTitle>View Tip Video</DialogTitle>
              <DialogContent>
                  {(tipVideo != "") ? 
                    <iframe position="fixed" src={"https://player.vimeo.com/video/"+tipVideo} width="100%" height={(width*0.625)} frameBorder="0" align="center" position="sticky" allow="autoplay; fullscreen"></iframe>
                    : <h4>No tip video to display</h4>
                  }
                  <Button onClick={handleCloseViewTipVideo} color="primary"> Back </Button>
              </DialogContent>
            </Dialog>
          )}
          {currentTip && (
            <Dialog disableBackdropClick disableEscapeKeyDown open={openTipVideo} onClose={handleCloseTipVideo}>
              <DialogTitle>Edit Tip Video</DialogTitle>
              <DialogContent>
                  <TextField
                      required value={tipVideo} label="Vimeo Tip Video ID"
                      onChange={(e) => setTipVideo(e.target.value)} fullWidth variant="outlined"/>
                  <Button onClick={handleCloseTipVideo} color="primary"> Cancel </Button>
                  <Button onClick={() => handleSubmitTipVideo(currentTip)} color="primary"> Confirm </Button>
              </DialogContent>
            </Dialog>
          )}
          {currentTip && (
            <Dialog disableBackdropClick disableEscapeKeyDown open={openDeleteTip} onClose={handleCloseDeleteTip}>
              <DialogTitle>Are you sure you want to delete the tip: {currentTip}?</DialogTitle>
              <DialogActions>
                <Button onClick={handleCloseDeleteTip} color="primary"> Cancel </Button>
                <Button onClick={() => handleSubmitDeleteTip(currentTip)} color="primary"> Ok </Button>
              </DialogActions>
            </Dialog>
          )}
        </TabPanel>


      <div className={styles.nav}>
        <Navbar currentPage={7}/>
        <AppBar position="static" color="default">
          <Tabs
            value={value} onChange={handleChangeToggle}
            indicatorColor="primary" textColor="primary" variant="fullWidth" aria-label="full width tabs example">
          <Tab classes={{root: classes.root}} label={<span className={classes.tabLabel}>Manage Users</span>} {...a11yProps(0)} />
          <Tab classes={{root: classes.root}} label={<span className={classes.tabLabel}>Manage Programs</span>} {...a11yProps(1)} />
          <Tab classes={{root: classes.root}} label={<span className={classes.tabLabel}>Manage Recipes</span>} {...a11yProps(2)} />
          <Tab classes={{root: classes.root}} label={<span className={classes.tabLabel}>Manage Skills</span>} {...a11yProps(3)} />
          <Tab classes={{root: classes.root}} label={<span className={classes.tabLabel}>Manage Tips</span>} {...a11yProps(4)} />
          </Tabs>
        </AppBar>
      </div>
    </div>
  );
}
