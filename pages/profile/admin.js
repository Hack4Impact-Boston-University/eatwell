import { useState, useEffect } from "react";
import {
  TextField, List, ListItemText, IconButton,
  Accordion, AccordionSummary, AccordionDetails,
  ListItemAvatar, Typography, Tabs, Tab, Box,
  Avatar, makeStyles, useTheme, Grid, ListItem,
  InputLabel, Input, MenuItem,
  Select, Button, Divider,
  Dialog, DialogActions, DialogContent, DialogTitle,
} from "@material-ui/core";
import DropDownMenu from "material-ui/DropDownMenu";
import useSWR from "swr";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AppBar from "@material-ui/core/AppBar";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import Navbar from "../../components/Navbar";
import styles from "../../styles/Home.module.css";
import * as firebase from "firebase";
import initFirebase from "../../utils/auth/initFirebase";
import { useRouter } from 'next/router';


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
  const [value, setValue] = React.useState(0);
  const theme = useTheme();
  const { width } = useWindowSize();
  const [openProgram, setOpenProgram] = React.useState(false);
  const [openRole, setOpenRole] = React.useState(false);
  const [program, setProgram] = React.useState("");
  const [prevProgram, setPrevProgram] = React.useState("");
  const [selectedProgramProgram, setSelectedProgramProgram] = useState({programName:"All"});
  const [selectedUsersProgram, setSelectedUsersProgram] = useState({programName:"All"});
  const [role, setRole] = React.useState("");
  const [prevRole, setPrevRole] = React.useState("");
  const [currentUser, setCurrentUser] = React.useState("");
  const [openAddProgram, setOpenAddProgram] = React.useState(false);
  const [addedProgram, setAddedProgram] = useState('')
  const [uploadDate, setUploadDate] = React.useState("");
  const [searchRecipe, setSearchRecipe] = React.useState("");
  const [currentRecipe, setCurrentRecipe] = React.useState("");
  const [recipeName, setRecipeName] = React.useState("");
  const [openRecipeName, setOpenRecipeName] = React.useState(false);
  const [recipeDescription, setRecipeDescription] = React.useState("");
  const [openRecipeDescription, setOpenRecipeDescription] = React.useState(false);

  const { data: users } = useSWR(`/api/users/getAllUsers`, fetcher);
  const { data: programsTemp } = useSWR(`/api/programs/getAllPrograms`, fetcher);
  const [programs, setCurrentPrograms] = React.useState(programsTemp);
  useEffect(() => { setCurrentPrograms(programsTemp)}, [programsTemp] );
  const router = useRouter();
  const { data: recipes } = useSWR(`/api/recipes/getAllRecipes`, fetcher);


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

  const handleChangeProgram = (event) => {
    setProgram(event.target.value || "");
  };

  const handleChangeRole = (event) => {
    setRole(event.target.value || "");
  };

  const handleClickOpenProgram = (currentUser, prevProgram) => {
    setOpenProgram(true);
    setCurrentUser(currentUser);
    setPrevProgram(prevProgram);
  };

  const handleClickOpenRole = (currentUser, prevRole) => {
    setOpenRole(true);
    setCurrentUser(currentUser);
    setPrevRole(prevRole);
  };

  const handleCloseProgram = () => {
    setOpenProgram(false);
  };

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

  const handleSubmitProgram = (currentUser, currentUserProgram) => {
    setProgram(currentUserProgram);
    firebase
      .firestore()
      .collection("users")
      .doc(currentUser)
      .update({ program: currentUserProgram });
    setOpenProgram(false);
  };

  const handleCloseRole = () => {
    setOpenRole(false);
  };

  const handleSubmitRole = (currentUser, currentUserRole) => {
    setRole(currentUserRole);
    firebase
      .firestore()
      .collection("users")
      .doc(currentUser)
      .update({ role: currentUserRole });
    setOpenRole(false);
  };

  const handleClickOpenAddProgram = () => {
    setOpenAddProgram(true);
  };

  const handleCloseAddProgram = () => {
    setAddedProgram('');
    setOpenAddProgram(false);
  };

  const addProgram = () => {
    firebase.firestore().collection('programs').doc(addedProgram).set({programName:addedProgram})
    alert("successfully added new program!");
    setAddedProgram('');
    setOpenAddProgram(false);
  }; 

  if (!users || !programs || !recipes) {
    if (!users) {
      return "Loading users...";
    } else if (!programs) {
      return "Loading programs...";
    } else {
      return "Loading recipes...";
    }
  }

  const emails = [];
  var i;
  for (i = 0; i < users.length; i++) {
    emails.push(users[i]["email"]);
  }

  console.log(recipes)
  const recipesList = [];
  var i;
  for (i = 0; i < recipes.length; i++) {
    recipesList.push(recipes[i]["nameOfDish"]);
  }

  const handleChange = (e) => {
    setSearch(e.target.value);
    const filteredNames = emails.filter((x) => {
      x?.includes(e.target.value);
    });
  };

  const handleChangeRecipe = (e) => {
    setSearchRecipe(e.target.value);
    const filteredNames = emails.filter((x) => {
      x?.includes(e.target.value);
    });
  };

  return (
    <div className={classes.root}>
      <div
        style={{
          paddingTop: "10vh",
          width: "100%",
          minWidth: "29%",
        }}
      ></div>

      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <Grid container spacing={3}>
            <Grid item sm={2}>
              <List dense>
                {programs.map((value) => {
                  if (value.programName == selectedUsersProgram?.programName) {
                    return (
                      <Grid item>                      
                        <ListItem
                          key={value?.programName}
                          button
                          selected={true}
                          onClick={() => setSelectedUsersProgram(value)}
                        >
                          <ListItemText>{value?.programName}</ListItemText>
                        </ListItem>
                        <Divider light />
                      </Grid>
                    );
                  }
                  else {
                    return (
                      <Grid item>                      
                        <ListItem
                          key={value?.programName}
                          button
                          selected={false}
                          classes={{ selected: classes.active }}
                          onClick={() => setSelectedUsersProgram(value)}
                        >
                          <ListItemText>{value?.programName}</ListItemText>
                        </ListItem>
                        <Divider light />
                      </Grid>
                    );
                  }
                })}
              </List>
            </Grid>

            <Grid item sm={5}>
              <TextField
                label="search email"
                value={search}
                onChange={handleChange}
              />

              {users.map((value) => {
                if (
                  (value["email"]?.includes(search) &&
                    selectedUsersProgram?.programName == "All") ||
                  (value["email"]?.includes(search) &&
                    value?.program == selectedUsersProgram?.programName)
                ) {
                  return (
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <ListItemAvatar>
                          <Avatar
                          // alt={`Avatar n°${value + 1}`}
                          // src={`/static/images/avatar/${value + 1}.jpg`}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={value?.firstname + " " + value?.lastname}
                          secondary={value?.email}
                        />
                      </AccordionSummary>
                      <AccordionDetails>
                        <ol className={classes.noNum}>
                          <li>Phone: {value?.phone}</li>                        

                        {value?.role == "user" ? (
                            <li>Program: {value?.program}
                            <IconButton
                              onClick={() =>
                                handleClickOpenProgram(value.id, value?.program)
                              }
                            >
                              <EditIcon />
                            </IconButton>
                            {currentUser && (
                              <Dialog
                                disableBackdropClick
                                disableEscapeKeyDown
                                open={openProgram}
                                onClose={handleCloseProgram}
                              >
                                <DialogTitle>Edit User Program</DialogTitle>
                                <DialogContent>
                                  <FormControl className={classes.formControl}>
                                    <InputLabel id="demo-dialog-select-label">
                                      Program
                                    </InputLabel>
                                    <Select
                                      labelId="demo-dialog-select-label"
                                      id="demo-dialog-select"
                                      value={program}
                                      onChange={handleChangeProgram}
                                      input={<Input />}
                                    >
                                      {programs.map((programss) =>
                                        programss["programName"] != "All" ? (
                                          <MenuItem value={programss["programName"]}>
                                            {programss["programName"]}
                                          </MenuItem>
                                        ) : (
                                          <MenuItem disabled value={programss["programName"]}>
                                            {programss["programName"]}
                                          </MenuItem>
                                        )
                                      )
                                      }
                                    </Select>
                                  </FormControl>
                                </DialogContent>
                                <DialogActions>
                                  <Button
                                    onClick={handleCloseProgram}
                                    color="primary"
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={() =>
                                      handleSubmitProgram(currentUser, program)
                                    }
                                    color="primary"
                                  >
                                    Ok
                                  </Button>
                                </DialogActions>
                              </Dialog>
                            )}
                            </li>
                        ) : (
                          <Grid></Grid>
                        )}

                          <li>Role: {value?.role}
                          <IconButton
                            onClick={() =>
                              handleClickOpenRole(value.id, value?.role)
                            }
                          >
                            <EditIcon />
                          </IconButton>
                          {currentUser && (
                            <Dialog
                              disableBackdropClick
                              disableEscapeKeyDown
                              open={openRole}
                              onClose={handleCloseRole}
                            >
                              <DialogTitle>Edit User Role</DialogTitle>
                              <DialogContent>
                                <FormControl className={classes.formControl}>
                                  <InputLabel id="demo-dialog-select-label">
                                    Role
                                  </InputLabel>
                                  <Select
                                    labelId="demo-dialog-select-label"
                                    id="demo-dialog-select"
                                    value={role}
                                    onChange={handleChangeRole}
                                    input={<Input />}
                                  >
                                    <MenuItem value={prevRole}>
                                      <em></em>
                                    </MenuItem>
                                    <MenuItem value={"user"}>User</MenuItem>
                                    <MenuItem value={"admin"}>Admin</MenuItem>
                                  </Select>
                                </FormControl>
                              </DialogContent>
                              <DialogActions>
                                <Button
                                  onClick={handleCloseRole}
                                  color="primary"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={() =>
                                    handleSubmitRole(currentUser, role)
                                  }
                                  color="primary"
                                >
                                  Ok
                                </Button>
                              </DialogActions>
                            </Dialog>
                          )}
                          </li>
                          <li>
                          <IconButton edge="end" aria-label="comments">
                            <DeleteIcon />
                          </IconButton>
                          </li>
                        </ol>
                      </AccordionDetails>
                    </Accordion>
                  );
                }
              })}
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={value} index={1} dir={theme.direction}>
          <Grid container spacing={3}>
            <Grid item sm={2}>
              <List dense>
                <ListItem
                  key={"Add New Program"}
                  button
                  selected={true}
                  // onClick={() => setSelectedProgramProgram(value)}
                >
                  <Button variant="outlined" fullWidth onClick={() => handleClickOpenAddProgram()}>
                    Add New Program
                  </Button>
                  <Dialog
                      disableBackdropClick
                      disableEscapeKeyDown
                      open={openAddProgram}
                      onClose={handleCloseAddProgram}
                  >
                  <DialogActions>
                      <h4>Add New Program</h4>
                      <TextField
                          value={addedProgram}
                          label="New Program"
                          multiline
                          onChange={(e) => setAddedProgram(e.target.value)}
                          fullWidth
                          variant="outlined"
                      />
                      <Button onClick={handleCloseAddProgram} color="primary">
                          Cancel
                      </Button>
                      <Button onClick={() => addProgram()} color="primary">
                          Confirm
                      </Button>
                  </DialogActions>
                  </Dialog>
                </ListItem>
                {programs.map((value) => {
                  if (value.programName == selectedProgramProgram?.programName) {
                    return (
                      <Grid item>                      
                        <ListItem
                          key={value?.programName}
                          button
                          selected={true}
                          onClick={() => setSelectedProgramProgram(value)}
                        >
                          <ListItemText>{value?.programName}</ListItemText>
                        </ListItem>
                        <Divider light />
                      </Grid>
                    );
                  }
                  else {
                    return (
                      <Grid item>                      
                        <ListItem
                          key={value?.programName}
                          button
                          selected={false}
                          classes={{ selected: classes.active }}
                          onClick={() => setSelectedProgramProgram(value)}
                        >
                          <ListItemText>{value?.programName}</ListItemText>
                        </ListItem>
                        <Divider light />
                      </Grid>
                    );
                  }
                })}
              </List>
            </Grid>

            <Grid item sm={5}>
              <List>
                <ListItemText>
                  {" "}
                  You clicked on {selectedProgramProgram?.programName}{" "}
                </ListItemText>
              </List>
            </Grid>
            <Grid item sm={5}>
              {/* <List>
                        {selectedProgram?.recipes.map((value) => {
                            return <ListItemText primary={value} />
                        })}
                    </List> */}
              <List>{selectedProgramProgram?.recipes}</List>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={value} index={2} dir={theme.direction}>
        <Grid container spacing={3}>
            <Grid item sm={5}>
              <TextField
                label="search recipe"
                value={searchRecipe}
                onChange={handleChangeRecipe}
              />

              {recipes.map((value) => {
                if (value["nameOfDish"]?.includes(searchRecipe)) {
                  return (
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <ListItemAvatar>
                          <Avatar
                          // alt={`Avatar n°${value + 1}`}
                          // src={`/static/images/avatar/${value + 1}.jpg`}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={value?.nameOfDish}
                        />
                      </AccordionSummary>
                      <AccordionDetails>
                        <ol className={classes.noNum}>
                          <li>Name of recipe: {value?.nameOfDish}
                          <IconButton onClick={() => handleClickOpenRecipeName(value)}> <EditIcon/> </IconButton>
                          {currentRecipe && (
                            <Dialog disableBackdropClick disableEscapeKeyDown open={openRecipeName} onClose={handleCloseRecipeName}>
                              <DialogTitle>Edit Recipe Name</DialogTitle>
                              <DialogContent>
                                  <TextField
                                      value={recipeName}
                                      label="Edit Reciipe Name"
                                      multiline
                                      onChange={(e) => setRecipeName(e.target.value)}
                                      fullWidth
                                      variant="outlined"
                                  />
                                  <Button onClick={handleCloseRecipeName} color="primary">
                                      Cancel
                                  </Button>
                                  <Button onClick={() => handleSubmitRecipeName(currentRecipe, recipeName)} color="primary">
                                      Confirm
                                  </Button>
                              </DialogContent>
                            </Dialog>
                          )}
                          </li>
                          <li>Description: {value?.description}
                          <IconButton onClick={() => handleClickOpenRecipeDescription(value)}> <EditIcon/> </IconButton>
                          {currentRecipe && (
                            <Dialog disableBackdropClick disableEscapeKeyDown open={openRecipeDescription} onClose={handleCloseRecipeDescription}>
                              <DialogTitle>Edit Recipe Description</DialogTitle>
                              <DialogContent>
                                  <TextField
                                      value={recipeDescription}
                                      label="Edit Reciipe Description"
                                      multiline
                                      onChange={(e) => setRecipeDescription(e.target.value)}
                                      fullWidth
                                      variant="outlined"
                                  />
                                  <Button onClick={handleCloseRecipeDescription} color="primary">
                                      Cancel
                                  </Button>
                                  <Button onClick={() => handleSubmitRecipeDescription(currentRecipe, recipeDescription)} color="primary">
                                      Confirm
                                  </Button>
                              </DialogContent>
                            </Dialog>
                          )}
                          </li>
                          <li>Date last modified: {value?.dateUploaded}</li>
                          <li>Rating: {value?.avgRating}</li>
                          <li>Number of ratings: {value?.numRatings}</li>

                          {/* display / edit images */}
                          {/* display / edit pdf */}
                          {/* display / edit videos */}

                          <li>
                          <IconButton edge="end" aria-label="comments">
                            <DeleteIcon />
                          </IconButton>
                          </li>
                        </ol>
                        
                      </AccordionDetails>
                    </Accordion>
                  );
                }
              })}
            </Grid>
          </Grid>
        </TabPanel>
      </SwipeableViews>

      <div className={styles.nav}>
        <Navbar />

        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={handleChangeToggle}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            aria-label="full width tabs example"
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
