import { Grid, Button, makeStyles } from "@material-ui/core";
import { useRouter } from 'next/router'
const useStyles = makeStyles((theme) => ({
    btn: {
        width: "calc(min(max(32vw, 105px), 150px))",
        display: "block",
        margin: "auto",
        textAlign: "center",
        background: "tomato",
        color: "#EEF8F9",
        "&:hover": {
            background: "#F46F56",
        },
    }
}));

const Survey = () => {
    const router = useRouter();
    const classes = useStyles();

    const submit = () => {
        router.push('/');
    }

    return (
        <Grid>
            <h1> Survey page </h1>
            <Button variant="contained" color="primary" className={classes.btn} onClick={() => submit()}>
                Submit
            </Button>
        </Grid>
    );
};

export default Survey;