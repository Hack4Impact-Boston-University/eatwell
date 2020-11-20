import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import * as ui from '@material-ui/core';
import clsx from 'clsx';
import Link from 'next/link'

const useStyles = makeStyles((theme) => ({
  
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
    
  }));

const RecipeCard = ({ obj, isFav}) => {

  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [favorited, setFav] = React.useState(isFav);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  function favButtonClick () {
    setFav(!favorited);
  };

  return (
    <Grid item xs={12} >
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
                  {obj.name}
                </Typography>
              </Link>
            </Grid>

            <Grid item xs={2} spacing={0} style={{ paddingTop: 35 }}>
              <Typography style={{ fontSize: 20, fontWeight: 300 }}  >
                Time: {obj.time}
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
              <Grid container spacing={5}  >
                <Grid item xs={12} >
                  <Typography style={{ fontSize: 20, fontWeight: 300 }}  >
                    {obj.description}
                  </Typography>
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
          is the pdf going here?
        </Collapse>
      </Card>
    </Grid>
    )

};

export default RecipeCard;
