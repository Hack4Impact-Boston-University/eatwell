import React, {useState, useEffect} from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import * as ui from '@material-ui/core'
import Link from 'next/link'
import { useUser } from '../utils/auth/useUser'
import FirebaseAuth from '../components/FirebaseAuth'
import Navbar from "../components/Navbar";
import {makeStyles,
        Button,
        Box,
        Grid,
        Dialog,
        DialogTitle,
        DialogContent,
        TextField,
        Typography,
        } from "@material-ui/core";
import RecipeCard from "../components/recipeCard";
import {getUserFromCookie, removeUserCookie} from "../utils/cookies"
import { useRouter } from 'next/router';
import {checkCode} from "../utils/codes.js";
import useSWR from "swr";
import _, { map } from "underscore";

const useStyles = makeStyles((theme) => ({
  containerHome: {
		background: `url(${"/assets/backgroundImage.png"}) repeat center center fixed`,
		height: "100vh",
		overflow: "hidden",
	},
  container: {
		background: `url(${"/assets/backgroundImage.png"}) repeat center center fixed`,
		height: "40%",
		overflow: "hidden",
	},
}));

const Index = () => {
  const classes = useStyles();
  const { user, upload } = useUser()
  const [login, setLogin] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [errorText, setErrorText] = useState("");
  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
  };
  function signInClick(event) {
    setLogin(true);
  }

  const router = useRouter();

  const submit = () => {
    console.log("0");
    if(code != "") {
      console.log("1");
      checkCode(code.trim().toUpperCase(), false).then((data) => {
        console.log(data)
        setErrorText("");
        // Save program info for later
        router.push("/profile/create");
      }).catch((err) => {
        // Check if firebase error or incorrect code, return error accordingly
        console.log(err);
        setErrorText(typeof(err) == "string" ? err : err.message);
      });
    } else {
      setErrorText("");
    }
  }

  // const userData = getUserFromCookie();
  // if(userData) {
  //   if("code" in userData) {
  //     removeUserCookie();
  //   } else if(!("firstname" in userData)) {
  //     router.push("/profile/makeProfile", {code: true});
  //   }
  // }

  // display recipes
  const fetcher = async (...args) => {
    const res = await fetch(...args);
    return res.json();
  };
	const [uploadDate, setUploadDate] = React.useState(Date.now());
	const { data: recipes } = useSWR(`/api/recipes/getAllRecipes`, fetcher);
	const { data: recipesDic } = useSWR(`/api/recipes/getAllRecipesDic`, fetcher);
	const { data: programsDic } = useSWR(`/api/programs/getAllProgramsDic`,fetcher);

  if (!recipes || !recipesDic || !programsDic ) {
		return "Loading...";
	}

  const recipesUser = [];
	if (!user?.program == "") {
		const keysList = Object.keys(programsDic[user.program]?.programRecipes);
		if (_.isEqual(user?.role, "user")) {
			if (!_.isEqual(user.program, "")) {
				if (!_.isEqual(keysList, [])) {
					var i;
					for (i = 0; i < keysList.length; i++) {
						console.log(programsDic[user.program].programRecipes[keysList[i]]);
						var d = Date.parse(
							programsDic[user.program].programRecipes[keysList[i]] +
								"T00:00:00.0000"
						);
						if (d < uploadDate) {
							recipesUser.push(recipesDic[keysList[i]]);
						}
					}
				}
			}
		}
	}

  return (
    <div>
      <Box className={!user ? classes.containerHome : classes.container}>
        <div className={styles.container}>
          <Head>
            <title>EatWell</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <main className={styles.main}>
            <img className={styles.logo} src="/assets/eatwell_logo 2.png"/>

            <h4 className={styles.title}>
              Welcome to EatWell, {user?.firstname}!
            </h4>

            {!user && 
                <Grid container justify="center" alignItems="flex-start">
                  <Grid item xs={5}>
                    <Grid container justify="center">
                      <Grid xs={12} className={classes.welcomeHeader} item>
                        <Typography align="center" gutterBottom>
                          Input your organization-provided activation code to register:
                        </Typography>
                      </Grid>
                      <Grid justify="center" className={classes.formItems} container style={{marginTop: "20px"}}>
                        <TextField
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          error={false}
                          label="Activation Code"
                          placeholder="Your Organization's Code"
                          required
                          // helperText="Please enter your first name"
                        />
                      </Grid>
                      <Grid container justify="center" item style={{marginTop: "20px"}}>
                        <Button variant="contained" color="primary" className={classes.btn} onClick={() => submit()}>
                          Submit
                        </Button>
                      </Grid>
                      <Grid justify="center" className={classes.formItems} container>
                          <Box component="div" textOverflow="clip">
                            <Typography variant="h6" color={'error'}>
                              {errorText}
                            </Typography>
                          </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={5} justify="center">
                      <Typography align="center" gutterBottom>
                        Already registered? Sign in to proceed:
                      </Typography>
                      <Grid container justify="center">
                        <FirebaseAuth isLogin={true}/>
                      </Grid>
                  </Grid>
                </Grid>
            }
          </main>
        </div>
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
          <DialogTitle id="form-dialog-title">Login</DialogTitle>
            <DialogContent>
              {/* <FirebaseAuth/> */}
            </DialogContent>
        </Dialog>
      </Box>
      {user?.role == "admin" && (
				!_.isEqual(recipes, []) ? (
					<Grid container className={classes.gridContainerMain}>
						{recipes.map((obj, idx) => {
							if (!obj.nameOfDish || !obj.id) {return;}
								return (
									<Grid item container xs={12} md={6} justify="center">
										<RecipeCard
											key={obj.id}
											object={obj}
                      isHome={true}
										/>
									</Grid>
								);
						})}
					</Grid>
				) : (
					<Grid>
						<h4>No recipes to display</h4>
					</Grid>
				)
			)}
      {!_.isEqual(recipesUser, []) && (
				<Grid container spacing={1000} className={classes.gridContainerMain}>
					{recipesUser?.map((obj, idx) => {
						if (!obj.nameOfDish || !obj.id) {return;}
							return (
								<Grid item container xs={12} md={6} justify="center">
									<RecipeCard
										key={obj.id}
										object={obj}
                    isHome={true}
									/>
								</Grid>
							);
					})}
				</Grid>
			)}
       {/* (<Grid><h4>No recipes to display</h4></Grid>)} */}
      
      <div className={styles.nav}>
        <Navbar/>
      </div>
    </div>
  )
}

export default Index
