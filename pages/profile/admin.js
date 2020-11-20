import React from 'react';
import TextField from '@material-ui/core/TextField';
import useSWR from 'swr';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

// import { FilterDrawer, filterSelectors, filterActions } from 'material-ui-filter';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        // maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
}));

const fetcher = async (...args) => {
    const res = await fetch(...args);
    return res.json();
};
export default function Admin() {
    const classes = useStyles();
    const [checked, setChecked] = React.useState([0]);

    const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    // const filterFields = [
    //     { name: 'name', label: 'Name' },
    //     { name: 'email', label: 'Email' },
    //     { name: 'registered', label: 'Registered', type: 'date' },
    //     { name: 'isActive', label: 'Is Active', type: 'bool' },
    //   ];

    if (currentIndex === -1) {
        newChecked.push(value);
    } else {
        newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    };

    const { data } = useSWR(`/api/users/getAllUsers`, fetcher);

    if (!data) {
        return "Loading...";
    }

    const emails = [];
    var i;
    for (i = 0; i < data.length; i++) {
        emails.push(data[i]["email"])
    }

    var state = {
        emails: emails,
        searchTerm: ""
    }

    var editSearchTerm;
    var dynamicSearch;
    editSearchTerm = (e) => {
        this.setState({searchTerm: e.target.value})
    }
    dynamicSearch = () => {
        return this.state.emails.filter(email => email.toLowerCase().includes(this.state.searchTerm.toLowerCase()))
    }
    console.log(emails);


    return (
        <div className={classes.root}>

        <input type='text' value={state.searchTerm} onChange={this.editSearchTerm} placeholder="search for an email!"></input>

        <List className={classes.root}>
        {data.map((value) => {
            return (
                
                // <FilterDrawer
                //     name={'demo'}
                //     fields={filterFields}
                    
                //     //localising the DatePicker
                //     locale={'de-DE'}
                //     // DateTimeFormat={global.Intl.DateTimeFormat}
                //     okLabel="OK"
                //     cancelLabel="Abbrechen"
                //     />
                <Accordion>
                    
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    >
                    <ListItemAvatar>
                        <Avatar
                            alt={`Avatar n°${value + 1}`}
                            src={`/static/images/avatar/${value + 1}.jpg`}
                    />
                    </ListItemAvatar>
                    <ListItemText primary={value.email} secondary={value.email} />
                    
                    </AccordionSummary>


                    <AccordionDetails>
                        {/* <Typography>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                            sit amet blandit leo lobortis eget.
                        </Typography> */}
                        
                        <IconButton edge="end" aria-label="comments">
                            <EditIcon />
                        </IconButton>
                        <IconButton edge="end" aria-label="comments">
                            <DeleteIcon />
                        </IconButton>
                        
                    </AccordionDetails>
                </Accordion>
            );
        })}
        </List>
        </div>

    )
}