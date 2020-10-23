import Head from 'next/head'
import * as ui from '@material-ui/core';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import useSWR from 'swr';

const fetcher = async (...args) => {
  const res = await fetch(...args);

  return res.json();
};

const useStyles = makeStyles((theme) => ({
  root: {
    //maxWidth:"xl",
    //backgroundColor: red[500],
    //width: "100%"

  },
  gridContainerMain: {
    paddingLeft: 200,
    paddingRight: 200,
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
  avatar: {
    backgroundColor: red[500],
  },
}));

export default function RecipeReviewCard() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const { data } = useSWR(`/api/recipes/getAllRecipes`, fetcher);
  console.log(data);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  if (!data) {
    return "Loading...";
  }

  return (
    <Grid container spacing={10} className={classes.gridContainerMain} >
      {data.map((obj, idx) => {
        if (!obj.name) return;
        return (
        <Grid item xs={12} >
          <Card className={classes.card}>

            <CardContent>
              <Grid container spacing={5} >
                <Grid item xs={1} >
                  <IconButton aria-label="add to favorites">
                    <FavoriteIcon />
                  </IconButton>
                </Grid>

                <Grid item xs={7} >
                  <Typography style={{ fontSize: 35, fontWeight: 300 }}  >
                    {obj.name}
                  </Typography>
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
                      <Grid container spacing={2}  >

                        <Grid item xs={12}>
                          <Button variant="contained" color="secondary">
                            Make this Recipe
                          </Button>
                        </Grid>

                        <Grid item xs={12} >
                          <Button variant="contained" color="secondary">
                            See More
                          </Button>
                        </Grid>

                      </Grid>
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
      })}
      <Grid item xs={12} >
        <Card className={classes.card}>

          <CardContent>
            <Grid container spacing={5} >
              <Grid item xs={1} >
                <IconButton aria-label="add to favorites">
                  <FavoriteIcon />
                </IconButton>
              </Grid>

              <Grid item xs={7} >
                <Typography style={{ fontSize: 35, fontWeight: 300 }}  >
                  Shrimp and Chorizo Paella
                </Typography>
              </Grid>

              <Grid item xs={2} spacing={0} style={{ paddingTop: 35 }}>
                <Typography style={{ fontSize: 20, fontWeight: 300 }}  >
                  Time: 2 hrs
                </Typography>
              </Grid>

              <Grid item xs={2} style={{ paddingTop: 35 }}>
                <Typography style={{ fontSize: 20, fontWeight: 300 }}  >
                  Rating: 4.5
                </Typography>
              </Grid>

              <Grid item xs={12} >
                <ui.Divider light />
              </Grid>

              <Grid item xs={6} >
                <Grid container spacing={5}  >
                  <Grid item xs={12} >
                    <Typography style={{ fontSize: 20, fontWeight: 300 }}  >
                      This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of frozen peas along with the mussels, if you like.
                    </Typography>
                  </Grid>

                  <Grid item xs={6} >
                    <Grid container spacing={2}  >

                      <Grid item xs={12}>
                        <Button variant="contained" color="secondary">
                          Make this Recipe
                        </Button>
                      </Grid>

                      <Grid item xs={12} >
                        <Button variant="contained" color="secondary">
                          See More
                        </Button>
                      </Grid>

                    </Grid>
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
                  <img className={classes.media} src="https://media.eggs.ca/assets/RecipeThumbs/_resampled/FillWyIxMjgwIiwiNzIwIl0/Classic-Paella-020.jpg" />
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
            <CardContent>
              <Typography paragraph>Method:</Typography>
              <Typography paragraph>
                Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10
                minutes.
          </Typography>
              <Typography paragraph>
                Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high
                heat. Add chicken, shrimp and chorizo, and cook, stirring occasionally until lightly
                browned, 6 to 8 minutes. Transfer shrimp to a large plate and set aside, leaving chicken
                and chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes, onion, salt and
                pepper, and cook, stirring often until thickened and fragrant, about 10 minutes. Add
                saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
          </Typography>
              <Typography paragraph>
                Add rice and stir very gently to distribute. Top with artichokes and peppers, and cook
                without stirring, until most of the liquid is absorbed, 15 to 18 minutes. Reduce heat to
                medium-low, add reserved shrimp and mussels, tucking them down into the rice, and cook
                again without stirring, until mussels have opened and rice is just tender, 5 to 7
                minutes more. (Discard any mussels that don’t open.)
          </Typography>
              <Typography>
                Set aside off of the heat to let rest for 10 minutes, and then serve.
          </Typography>
            </CardContent>
          </Collapse>
        </Card>
      </Grid>
      <Grid item xs={12} >
        <Card className={classes.card}>

          <CardContent>
            <Grid container spacing={5} >
              <Grid item xs={1} >
                <IconButton aria-label="add to favorites">
                  <FavoriteIcon />
                </IconButton>
              </Grid>

              <Grid item xs={7} >
                <Typography style={{ fontSize: 35, fontWeight: 300 }}  >
                  Shrimp and Chorizo Paella
                </Typography>
              </Grid>

              <Grid item xs={2} spacing={0} style={{ paddingTop: 35 }}>
                <Typography style={{ fontSize: 20, fontWeight: 300 }}  >
                  Time: 2 hrs
                </Typography>
              </Grid>

              <Grid item xs={2} style={{ paddingTop: 35 }}>
                <Typography style={{ fontSize: 20, fontWeight: 300 }}  >
                  Rating: 4.5
                </Typography>
              </Grid>

              <Grid item xs={12} >
                <ui.Divider light />
              </Grid>

              <Grid item xs={6} >
                <Grid container spacing={5}  >
                  <Grid item xs={12} >
                    <Typography style={{ fontSize: 20, fontWeight: 300 }}  >
                      This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of frozen peas along with the mussels, if you like.
                    </Typography>
                  </Grid>

                  <Grid item xs={6} >
                    <Grid container spacing={2}  >

                      <Grid item xs={12}>
                        <Button variant="contained" color="secondary">
                          Make this Recipe
                        </Button>
                      </Grid>

                      <Grid item xs={12} >
                        <Button variant="contained" color="secondary">
                          See More
                        </Button>
                      </Grid>

                    </Grid>
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
                  <img className={classes.media} src="https://media.eggs.ca/assets/RecipeThumbs/_resampled/FillWyIxMjgwIiwiNzIwIl0/Classic-Paella-020.jpg" />
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
            <CardContent>
              <Typography paragraph>Method:</Typography>
              <Typography paragraph>
                Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10
                minutes.
          </Typography>
              <Typography paragraph>
                Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high
                heat. Add chicken, shrimp and chorizo, and cook, stirring occasionally until lightly
                browned, 6 to 8 minutes. Transfer shrimp to a large plate and set aside, leaving chicken
                and chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes, onion, salt and
                pepper, and cook, stirring often until thickened and fragrant, about 10 minutes. Add
                saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
          </Typography>
              <Typography paragraph>
                Add rice and stir very gently to distribute. Top with artichokes and peppers, and cook
                without stirring, until most of the liquid is absorbed, 15 to 18 minutes. Reduce heat to
                medium-low, add reserved shrimp and mussels, tucking them down into the rice, and cook
                again without stirring, until mussels have opened and rice is just tender, 5 to 7
                minutes more. (Discard any mussels that don’t open.)
          </Typography>
              <Typography>
                Set aside off of the heat to let rest for 10 minutes, and then serve.
          </Typography>
            </CardContent>
          </Collapse>
        </Card>
      </Grid>
    </Grid>
  );
}

