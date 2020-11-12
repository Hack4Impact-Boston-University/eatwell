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

    if (currentIndex === -1) {
        newChecked.push(value);
    } else {
        newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    };

    const { data } = useSWR(`/api/users/getAllUsers`, fetcher);
    console.log(data);

    if (!data) {
        return "Loading...";
    }

    return (
        <List className={classes.root}>
        {data.map((value) => {
            // const labelId = `checkbox-list-label-${value}`;

            // return (
            // <ListItem key={value} role={undefined} dense button onClick={handleToggle(value)}>
            //     <ListItemIcon>
            //         <Checkbox
            //             edge="start"
            //             checked={checked.indexOf(value) !== -1}
            //             tabIndex={-1}
            //             disableRipple
            //             inputProps={{ 'aria-labelledby': labelId }}
            //         />
            //     <ListItemAvatar>
            //         <Avatar
            //             alt={`Avatar n°${value + 1}`}
            //             src={`/static/images/avatar/${value + 1}.jpg`}
            //         />
            //     </ListItemAvatar>
            //     </ListItemIcon>
            //     <ListItemText id={labelId} primary={value.email} secondary={value.email} />
            //     {/* <ListItemText id={labelId} primary={value.email} /> */}
            //     {/* <ListItemText id={labelId} primary={value.firstName} />
            //     <ListItemText id={labelId} primary={value.lastName} />
            //     <ListItemText id={labelId} primary={value.phoneNumber} />
            //     <ListItemText id={labelId} primary={value.enrolledProgram} /> */}
            //     <ListItemSecondaryAction>
            //     <ListItemText edge="end" id={labelId} primary="role" />
            //     <IconButton edge="end" aria-label="comments">
            //         <EditIcon />
            //     </IconButton>
            //     <IconButton edge="end" aria-label="comments">
            //         <DeleteIcon />
            //     </IconButton>
            //     </ListItemSecondaryAction>
            // </ListItem>
            // );
            return (
                
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
    )
}