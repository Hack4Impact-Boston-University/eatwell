import React from 'react'
import { useState, useEffect } from "react";
import {
    ListItemText, IconButton,
    Accordion, AccordionSummary, AccordionDetails,
    makeStyles, InputLabel, Input, MenuItem,
    Select, Button,
    Dialog, DialogActions, DialogContent, DialogTitle,
    FormControl,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import EditIcon from "@material-ui/icons/Edit";
import Navbar from "../components/Navbar";
import useSWR from "swr";

const useStyles = makeStyles((theme) => ({
    noNum: {
      listStyle: "none"
    }
}));
const fetcher = async (...args) => {
    const res = await fetch(...args);
    return res.json();
};


export default function Demo() {
    const classes = useStyles();
    const { data: users } = useSWR(`/api/users/getAllUsers`, fetcher);
    const [currentUser, setCurrentUser] = React.useState("");


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


    if (!users) {
        return "Loading users...";
    }

    console.log(users)

    return (
        <div>
            <Navbar />

            {users.map((value) => {
                return (
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                    <ListItemText
                        primary={value?.firstname + " " + value?.lastname} secondary={value?.email}/>
                    </AccordionSummary>
                    <AccordionDetails>
                    <ol className={classes.noNum}>
                        <li>Phone: {value?.phone}</li>
                        <li>Role: {value?.role}<IconButton onClick={() => handleClickOpenRole(value.id, value?.role)}> <EditIcon /> </IconButton></li>
                    </ol>
                    </AccordionDetails>
                </Accordion>
                );}
            )}

            {currentUser && (
            <div>
                {/* --------------- edit user role --------------- */}
                <Dialog style={{backgroundColor: 'transparent'}} disableBackdropClick disableEscapeKeyDown open={openRole} onClose={handleCloseRole}>
                <DialogTitle>Edit User Role</DialogTitle>
                <DialogContent>
                    <FormControl className={classes.formControl}>
                    <InputLabel id="demo-dialog-select-label"> Role </InputLabel>
                    <Select labelId="demo-dialog-select-label" id="demo-dialog-select" value={role} onChange={handleChangeRole} input={<Input />}>
                        <MenuItem value={prevRole}></MenuItem>
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
            </div>)}
        </div>
    )
};