import { useState, useEffect } from 'react';
import {TextField, List, ListItemText, IconButton, 
    Accordion, AccordionSummary, AccordionDetails, 
    ListItemAvatar, Typography, Tabs, Tab, Box, Avatar,
    makeStyles, useTheme, Grid, ListItem,
    InputLabel, Input, MenuItem, MenuList, FormHelperText, FormControl, Select,
    Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider
    } from '@material-ui/core';
import DropDownMenu from 'material-ui/DropDownMenu';
import useSWR from 'swr';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AppBar from '@material-ui/core/AppBar';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import Navbar from "../../components/Navbar";
import styles from '../../styles/Home.module.css'
import * as firebase from 'firebase'
import initFirebase from '../../utils/auth/initFirebase'


function useWindowSize() {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = useState({
      width: undefined,
      height: undefined,
    });
  
    useEffect(() => {
      // only execute all the code below in client side
      if (typeof window !== 'undefined') {
        // Handler to call on window resize
        function handleResize() {
          // Set window width/height to state
          setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
          });
        }
      
        // Add event listener
        window.addEventListener("resize", handleResize);
       
        // Call handler right away so state gets updated with initial window size
        handleResize();
      
        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", handleResize);
      }
    }, []); // Empty array ensures that effect is only run on mount
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
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        // maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}));

const fetcher = async (...args) => {
    const res = await fetch(...args);
    return res.json();
};

export default function Admin() {
    const classes = useStyles();
    const [checked, setChecked] = React.useState([0]);
    const [search, setSearch] = React.useState('');
    const [value, setValue] = React.useState(0);
    const theme = useTheme();
    const { width } = useWindowSize();
    const [openProgram, setOpenProgram] = React.useState(false);
    const [openRole, setOpenRole] = React.useState(false);
    const [program, setProgram] = React.useState('');
    const [newProgram, setNewProgram] = useState('');
    const [selectedProgram, setSelectedProgram] = useState([0]);
    const [role, setRole] = React.useState('');

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
        setProgram(event.target.value || '');
    };

    const handleChangeRole = (event) => {
        setRole(event.target.value || '');
    };

    const handleClickOpenProgram = () => {
        setOpenProgram(true);
    };

    const handleClickOpenRole = () => {
        setOpenRole(true);
    };

    const handleCloseProgram = () => {
        setOpenProgram(false);
    };

    const handleSubmitProgram = (user,program) => {
        console.log(user)
        console.log(program)
        firebase.firestore().collection('users').doc(user).update({program:program});
        setOpenProgram(false);
    };

    const handleCloseRole= () => {
        setOpenRole(false);
    };

    const handleSubmitRole = (user) => {
        console.log(user)
        console.log(role)
        setRole(role)
        firebase.firestore().collection('users').doc(user).update({role:role});
        setOpenRole(false);
    };

    const { data: users } = useSWR(`/api/users/getAllUsers`, fetcher);
    const { data: programs } = useSWR(`/api/programs/getAllPrograms`, fetcher);

    const programDrawer = () => {
        <List>
            {programs.map((value) => (
            <ListItem button key={value}>
                <ListItemText primary={value} />
            </ListItem>
            ))}
        </List>
    }

    if (!users || !programs) {
        if (!users) {
            return "Loading users...";
        }
        else {
            return "Loading programs...";
        }
    }

    const emails = [];
    var i;
    for (i = 0; i < users.length; i++) {
        emails.push(users[i]["email"])
    }


    const handleChange = (e) => {
        setSearch(e.target.value);
            const filteredNames = emails.filter((x)=>{ 
            x?.includes(e.target.value)
        })
    }

    return (
        <div className={classes.root}>
        <div style={{
            paddingTop: "10vh",
            width: "100%",
            minWidth: "29%",
        }}></div>
        
        
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}>
      
        <TabPanel value={value} index={0} dir={theme.direction}>
        <Grid container spacing={3}>
            <Grid item sm={2}>
                <List dense>
                    {programs.map((value) => {
                        return (<Grid item><ListItem key={value?.programName} button onClick={() => setSelectedProgram(value)}><ListItemText>{value?.programName}</ListItemText></ListItem><Divider light/></Grid>)
                    })}
                </List>
            </Grid>

            <Grid item sm={5}>
            <TextField
                label = "search email"
                value={search}
                onChange={handleChange}
            />

            <List className={classes.root}>
            {users.map((value) => {
                if ((value["email"]?.includes(search) && selectedProgram?.programName == "All") || (value["email"]?.includes(search) && value?.program == selectedProgram?.programName)) {
                const userid = value["id"];
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
                        <ListItemText primary={value?.firstname + " " + value?.lastname } secondary={value?.email} />
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid>
                                <Box display="block" displayPrint="none" m={1}>
                                    Phone: {value?.phone}
                                </Box>
                            </Grid>

                            {(value?.role == "user") ?
                                <Grid>
                                <Box display="block" displayPrint="none" m={1}>
                                    Enrolled Program: {value?.program}
                                </Box>
                                <IconButton onClick={handleClickOpenProgram}>
                                    <EditIcon />
                                </IconButton>
                                <Dialog disableBackdropClick disableEscapeKeyDown open={openProgram} onClose={handleCloseProgram}>
                                    <DialogTitle>Edit Enrolled Program</DialogTitle>
                                    <DialogContent>
                                    <FormControl className={classes.formControl}>
                                    <InputLabel id="demo-dialog-select-label">Program</InputLabel>
                                    <Select
                                        labelId="demo-dialog-select-label"
                                        id="demo-dialog-select"
                                        value={program}
                                        onChange={handleChangeProgram}
                                        input={<Input />}
                                    >
                                        {programs.map((programss) => (
                                            (programss["programName"] != "All" ?
                                            <MenuItem value={programss["programName"]}>
                                                {programss["programName"]}
                                            </MenuItem> : (
                                                <MenuItem disabled value={programss["programName"]}>
                                                {programss["programName"]}
                                                </MenuItem>
                                            ))
                                        ))}
                                    </Select>
                                    </FormControl>

                                    </DialogContent>
                                    <DialogActions>
                                    <Button onClick={handleCloseProgram} color="primary">
                                        Cancel
                                    </Button>
                                    <Button onClick={() => handleSubmitProgram(value.id,program)} color="primary">
                                        Ok
                                    </Button>
                                    </DialogActions>
                                </Dialog>
                            </Grid>:<Grid></Grid>}

                            <Grid>
                                <Box display="block" displayPrint="none" m={1}>
                                    Role: {value?.role}
                                </Box>
                                <IconButton onClick={handleClickOpenRole}>
                                    <EditIcon />
                                </IconButton>
                                <Dialog disableBackdropClick disableEscapeKeyDown open={openRole} onClose={handleCloseRole}>
                                    <DialogTitle>Edit User Role</DialogTitle>
                                    <DialogContent>
                                    <FormControl className={classes.formControl}>
                                    <InputLabel id="demo-dialog-select-label">Role</InputLabel>
                                    <Select
                                        labelId="demo-dialog-select-label"
                                        id="demo-dialog-select"
                                        value={role}
                                        onChange={handleChangeRole}
                                        input={<Input />}
                                    >
                                        <MenuItem value="">
                                        <em></em>
                                        </MenuItem>
                                        <MenuItem value={"user"}>User</MenuItem>
                                        <MenuItem value={"admin"}>Admin</MenuItem>
                                    </Select>
                                    </FormControl>
                                    </DialogContent>
                                    <DialogActions>
                                    <Button onClick={handleCloseRole} color="primary">
                                        Cancel
                                    </Button>
                                    <Button onClick={() => handleSubmitRole(userid)} color="primary">
                                        Ok
                                    </Button>
                                    </DialogActions>
                                </Dialog>
                                <IconButton edge="end" aria-label="comments">
                                    <DeleteIcon />
                                </IconButton>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                );
            }})}
            </List>
            </Grid>

        </Grid>

            
        </TabPanel>

        <TabPanel value={value} index={1} dir={theme.direction}>
            <Grid container spacing={3}>
                <Grid item sm={2}>
                    <List dense>
                        {programs.map((value) => {
                            return (<Grid item><ListItem key={value?.programName} button onClick={() => setSelectedProgram(value)}><ListItemText>{value?.programName}</ListItemText></ListItem><Divider light/></Grid>)
                        })}
                    </List>
                </Grid>

                <Grid item sm={5}>
                    <List>
                        <ListItemText> You clicked on {selectedProgram?.programName} </ListItemText>
                    </List>
                </Grid>
                <Grid item sm={5}>
                    {/* <List>
                        {selectedProgram?.recipes.map((value) => {
                            return <ListItemText primary={value} />
                        })}
                    </List> */}
                    <List>{selectedProgram?.recipes}</List>
                </Grid>
            </Grid>
        </TabPanel>

        <TabPanel value={value} index={2} dir={theme.direction}>
        <iframe src={users.videoTips} width="100%" height={(width*0.625)} frameBorder="0" align="center" position="sticky" allow="autoplay; fullscreen"></iframe>

        </TabPanel>
      </SwipeableViews>

      <div className={styles.nav}>
            <Navbar/>
       

        <AppBar position = "static"  color="default">
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

    )
}