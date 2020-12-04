import { useState, useEffect } from 'react';
import {TextField, List, ListItemText, IconButton, 
    Accordion, AccordionSummary, AccordionDetails, 
    ListItemAvatar, Typography, Tabs, Tab, Box, Avatar,
    makeStyles, useTheme, 
    InputLabel, Input, MenuItem, FormHelperText, FormControl, Select,
    Button, Dialog, DialogActions, DialogContent, DialogTitle, Table,
    TableHead, TableCell, TableBody, TableRow
    } from '@material-ui/core';
import useSWR from 'swr';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AppBar from '@material-ui/core/AppBar';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import Navbar from "../../components/Navbar";
import styles from '../../styles/Home.module.css'


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
    const [open, setOpen] = React.useState(false);
    const [program, setProgram] = React.useState('');

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
        setProgram(Number(event.target.value) || '');
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const { data: users } = useSWR(`/api/users/getAllUsers`, fetcher);
    const { data: programs } = useSWR(`/api/programs/getAllPrograms`, fetcher);

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
            <TextField
                label = "search email"
                value={search}
                onChange={handleChange}
            />

            <List className={classes.root}>
            {users.map((value) => {
                if (value["email"]?.includes(search)) {
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
                            <Box display="block" displayPrint="none" m={1}>
                                Phone: {value?.phone}
                            </Box>
                            <Box display="block" displayPrint="none" m={1}>
                                Enrolled Program: {value?.enrolledProgram}
                            </Box>
                            
                            <IconButton edge="end" aria-label="comments" onClick={handleClickOpen}>
                                <EditIcon />
                            </IconButton>
                            <div>
                            <Dialog disableBackdropClick disableEscapeKeyDown open={open} onClose={handleClose}>
                                <DialogTitle>Fill the form</DialogTitle>
                                <DialogContent>
                                <form className={classes.container}>
                                    <FormControl className={classes.formControl}>
                                    <InputLabel htmlFor="demo-dialog-native">Program</InputLabel>
                                    <Select
                                        native
                                        value={program}
                                        onChange={handleChangeProgram}
                                        input={<Input id="demo-dialog-native" />}
                                    >
                                        <option aria-label="None" value="" />
                                        <option value={10}>Ten</option>
                                        <option value={20}>Twenty</option>
                                        <option value={30}>Thirty</option>
                                    </Select>
                                    </FormControl>
                                    <FormControl className={classes.formControl}>
                                    <InputLabel id="demo-dialog-select-label">Program</InputLabel>
                                    <Select
                                        labelId="demo-dialog-select-label"
                                        id="demo-dialog-select"
                                        value={program}
                                        onChange={handleChangeProgram}
                                        input={<Input />}
                                    >
                                        <MenuItem value="">
                                        <em>None</em>
                                        </MenuItem>
                                        <MenuItem value={10}>Ten</MenuItem>
                                        <MenuItem value={20}>Twenty</MenuItem>
                                        <MenuItem value={30}>Thirty</MenuItem>
                                    </Select>
                                    </FormControl>
                                </form>
                                </DialogContent>
                                <DialogActions>
                                <Button onClick={handleClose} color="primary">
                                    Cancel
                                </Button>
                                <Button onClick={handleClose} color="primary">
                                    Ok
                                </Button>
                                </DialogActions>
                            </Dialog>
                            </div>

                            <IconButton edge="end" aria-label="comments">
                                <DeleteIcon />
                            </IconButton>
                        </AccordionDetails>
                    </Accordion>
                );
            }})}
            </List>

        </TabPanel>

        <TabPanel value={value} index={1} dir={theme.direction}>
            <List>
                {programs.map((value) => {
                    return <ListItemText primary={value?.recipe1} />
                })}
            </List>
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