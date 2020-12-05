import { makeStyles } from '@material-ui/core/styles';
import { Button, Card, CardContent, CardActions, Collapse, Grid, IconButton, TextField, Typography, Box } from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import * as ui from '@material-ui/core';
import clsx from 'clsx';
import Link from 'next/link'
import {
	editFavCookie,
} from "../../utils/cookies";

const useStyles = makeStyles((theme) => ({

    btn: {
      width: "4rem",
      display: "block",
      textAlign: "center",
	  },
    card: {
      width: "100%",
      boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
      "&:hover": {
        boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)"
      }
      //maxWidth:500,
    },
  
    media: {
      maxWidth: "100%"
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
    notes: {
      width: 100
    },
    formItems: {
      marginTop: theme.spacing(2),
    }
  }));

const RecipeCard = ({ obj, isFav, onFavClick}) => {
  
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [favorited, setFav] = React.useState(isFav);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const [notes, setNotes] = React.useState([]);
  const [note, setNote] = React.useState("");

  function favButtonClick() {
    setFav(!favorited);
    editFavCookie(obj.id, !favorited)
    onFavClick()
  }

  function handleSubmit() {
    if(note != "") {
      setNotes(notes.concat([note]))
      setNote("")
    }
  }

  function setStr(s, i) {
    setNotes(notes.slice(0,i).concat([s]).concat(notes.slice(i+1)))
  }

  function deleteStr(i) {
    console.log(notes.slice(0,i).length)
    if(notes.slice(0,i).length != 0) {
      setNotes(notes.slice(0,i).concat(notes.slice(i+1)))
    }
    else {
      setNotes(notes.slice(i+1))
    }
  }

  return (
    <Grid item xs={12} >
      <Box paddingBottom={5}>
      <Card className={classes.card}>

        <CardContent>
          <Grid container spacing={5} >
            <Grid item xs={1} >
              <IconButton 
                onClick = {favButtonClick}
                aria-label = "add to favorites" 
                color= {favorited? "secondary" : "default"}>
                <FavoriteIcon />
              </IconButton>
            </Grid>

            <Grid item xs={7} >
              <Link href={obj.id}>
                <Typography style={{ fontSize: 35, fontWeight: 300 }}  >
                  {obj.nameOfDish}
                </Typography>
              </Link>
            </Grid>

            <Grid item xs={2} spacing={0} style={{ paddingTop: 35 }}>
              <Typography style={{ fontSize: 20, fontWeight: 300 }}  >
                Date: {obj.dateUploaded}
              </Typography>
            </Grid>

            <Grid item xs={2} style={{ paddingTop: 35 }}>
              <Typography style={{ fontSize: 20, fontWeight: 300 }}  >
                Rating: {obj.rating}
              </Typography>
            </Grid>

            <Grid item xs={12} >
              <ui.Divider light />
            </Grid>

            <Grid item xs={6} >
              <Grid container spacing={3}  >
                <Grid item xs={12} >
                  <Typography style={{ fontSize: 20, fontWeight: 300 }}  >
                    {obj.description}
                  </Typography>
                </Grid>
                <Grid item xs={12} >
                  <Button variant="contained" color="secondary">
                    <Link href={obj.id}>
                      Make this Recipe
                    </Link>
                  </Button>
                </Grid>
                <Grid item xs={6} >
                  <Typography style={{ fontSize: 18, fontWeight: 300 }}  >
                    Skills:
                  </Typography>
                </Grid>

              </Grid>
            </Grid>

            <Grid item xs={6} >
              <ui.Box>
                <img className={classes.media} src={obj.imageUrl} />
              </ui.Box>
            </Grid>
          </Grid>

        </CardContent>

        <CardActions disableSpacing>
          <Grid container spacing={0} direction="row" alignItems="center" justify="center">
            <Typography style={{ fontSize: 18, fontWeight: 300 }}  >
                Notes
            </Typography>
		      </Grid>
          
            
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          
          <Grid container spacing={0} direction="column" alignItems="center" justify="center" style={{ minHeight: '10vh' }}>
            <Grid justify="center" direction="row" className={classes.formItems} container>
              <TextField
                value={note}
                onChange={(e) => setNote(e.target.value)}
                label="Note"
                placeholder="Add a Note"
              />
              <Button color="primary" className={classes.btn} style={{marginTop: "1rem"}} onClick={() => handleSubmit()}>
                  Submit
              </Button>
            </Grid>
            {
              notes.map((str, idx) => {
                return (<Note str={str} setStr={(s) => setStr(s, idx)} deleteStr={() => deleteStr(idx)}> </Note>);         
              })
            }
		      </Grid>
        </Collapse>
      </Card>
      </Box>
    </Grid>
    )
};

const Note = ({str, setStr, deleteStr}) => {
  const classes = useStyles();
  const [val, setVal] = React.useState(str);
  const [editing, setEditing] = React.useState(false);
  return (
    <Grid container spacing={0} direction="column" alignItems="center" justify="center" style={{ minHeight: '10vh'}}>
      {editing ? (
      <Grid justify="center" direction="row" className={classes.formItems} container>
        <TextField
          value={val}
          onChange={(e) => setVal(e.target.value)}
          label="Note"
          placeholder="Add a Note"
          />
        <Button color="primary" className={classes.btn} onClick={() => {setEditing(false); setStr(val)}}>
            Submit
        </Button>
        <Button color="primary" className={classes.btn} onClick={() => setEditing(false)}>
            Cancel
        </Button>
        </Grid> 
      ) : (
      <Grid justify="center" direction="row" className={classes.formItems} container>
        <Grid justify="center" style={{marginRight: "1rem", marginTop: "0.3rem", maxWidth: '60vw'}}>
          <Typography>
            {str}
          </Typography>
        </Grid>
        <Button color="primary" className={classes.btn} onClick={() => setEditing(true)}>
            Edit
        </Button>
        <Button color="primary" className={classes.btn} onClick={() => deleteStr()}>
            Delete
        </Button>
      </Grid>)
      }
		</Grid>
  )
}

export default RecipeCard;
