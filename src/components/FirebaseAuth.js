/*
Form component used for sign in and account creation.
*/

/* globals window */
import { useEffect, useState } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase/app";
import "firebase/auth";
import { setUserCookie, getUserFromCookie } from "../utils/cookies";
import { mapUserData } from "../utils/auth/mapUserData";
import { useUser } from "../utils/auth/useUser";
import { Grid, TextField, Button, Link, Box, Typography, makeStyles } from "@material-ui/core";
import {useRouter} from "next/router";

// Init the Firebase app.
import "firebase/firestore";
import initFirebase from "../utils/auth/initFirebase";
initFirebase();
var db = firebase.firestore();

const firebaseAuthConfig = {
	signInFlow: "popup",
	// Auth providers
	// https://github.com/firebase/firebaseui-web#configure-oauth-providers
	signInOptions: [
		{
			provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
			requireDisplayName: false,
		},
		firebase.auth.GoogleAuthProvider.PROVIDER_ID,
	],
	signInSuccessUrl: "/profile/makeProfile",
	credentialHelper: "none",
	callbacks: {
		signInSuccessWithAuthResult: async ({ user }, redirectUrl) => {
			const userData = mapUserData(user);
			const fullData = {...userData, ...getUserFromCookie()};
			setUserCookie({...fullData});
		},
	},
};

const useStyles = makeStyles((theme) => ({
}));

// code and addProgram are only set when FirebaseAuth is used in the create page after a program code has been submitted
const FirebaseAuth = ({isLogin, code, addProgram}) => {
	const classes = useStyles();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [checkPassword, setCheckPassword] = useState('');
	const [error, setError] = useState('');
	const [forgotPasswordPage, setForgotPasswordPage] = useState(false);
	const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
	const [forgotPasswordError, setForgotPasswordError] = useState('');
	const [loading, setLoading] = useState(false)
	const { upload, logout } = useUser();
	// Error types: 
	// 0 - No Error
	// 1 - Email error
	// 2 - Password error
	// 3 - Password confirm error
	// 4 - Sensitive error, do not give error info
	const [errorType, setErrorType] = useState(0);
	const [forgotPasswordErrorType, setForgotPasswordErrorType] = useState(0);
	const router = useRouter();
	
	const handleSubmit = (event) => {

		if(email == '') {
		  setError("Please enter an email address");
		  setErrorType(1);
		// If the user is logging in, use signInWithEmailAndPassword to authenticate with Firebase
		} else if(isLogin) {
			setErrorType(0);
			setError("");

			firebase.auth().signInWithEmailAndPassword(email, password)
			.then(async (userCredential) => {

				// If adding a program code to an existing account
				if(addProgram) {
					/*
						Add the code data to the user's document if the user already exists and has no active programs
						If the user does not exist in the database, then they should not exist in firebase auth, 
							so sign in should fail with error code "auth/user-not-found"
					*/
					upload(code).then(() => {
						// Route to makeProfile on success
						router.push("/profile/makeProfile");
					}).catch((err) => {
						console.log(err)
						if(err.message == 'Existing program') {
							setError("This account has an active program. Joining multiple active programs is not allowed.")
							logout();
						}
					})
				// If signing in again, track the number of visits in the user's document
				} else {
					const ref = firebase.firestore().collection("users").doc(userCredential.user.uid);
					const doc = await ref.get();
					if (doc.exists) {
						var timesVisited = doc.data()?.timesVisited + 1;
						await firebase.firestore().collection("users").doc(userCredential.user.uid).update({timesVisited: timesVisited})
					}
					router.push("/profile/makeProfile");
				}
			// Display the proper error message based on the error code returned by the function. 
			// See https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#signinwithemailandpassword
			}).catch((err) => {
				var m = "";
				switch(err.code) {
					case "auth/invalid-email":
						m = "Email address is not valid";
						setErrorType(1);
						break;
					case "auth/user-disabled":
						m = "User account has been disabled";
						setErrorType(4);
						break;
					case "auth/user-not-found":
					case "auth/wrong-password":
						m = "Incorrect email or password";
						setErrorType(4);
						break;
					default:
						console.log(err)
				}
				if(m) {
					setError(m);
				}
		  	});
		} else if(checkPassword == '') {
			setError("Please confirm your password");
			setErrorType(3);
		} else if(password != checkPassword) { 
			setError("Passwords do not match");
			setErrorType(3);
		// If the user is creating an account, use createUserWithEmailAndPassword to authenticate with Firebase
		} else {
			setErrorType(0);
			setError("");
			firebase.auth().createUserWithEmailAndPassword(email, password)
			// On successful authentication, wait for onAuthStateChanged in useUser.js to create a user document ("await ref.get()"),
			// then update the document with the new timesVisited field.
			.then(async (userCredential) => {
				const ref = firebase.firestore().collection("users").doc(userCredential.user.uid);
				const doc = await ref.get();
				if (doc.exists) {
					var timesVisited = doc.data()?.timesVisited + 1;
					await firebase.firestore().collection("users").doc(userCredential.user.uid).update({timesVisited: timesVisited})
				}
				router.push("/profile/makeProfile");
			// Display the proper error message based on the error code returned by the function. 
			// See https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#createuserwithemailandpassword
			}).catch((err) => {
			var m = "";
			switch(err.code) {
			  case "auth/email-already-in-use":
				m = "Account with given email address already exists";
				setErrorType(1);
				break;
			  case "auth/invalid-email":
				m = "Email address is not valid";
				setErrorType(1);
				break;
			  case "auth/weak-password":
				m = "Password is too weak";
				setErrorType(2);
				break;
			}
			if(m) {setError(m)}
		  });
		}
		event.preventDefault();
	}

	const handleForgotPassword = async (event) => {
		if(forgotPasswordEmail == '') {
		  setForgotPasswordError("Please enter an email address");
		  setForgotPasswordErrorType(1);
		} else {
			try {
				setForgotPasswordErrorType(0)
				setForgotPasswordError("")
				setLoading(true)
				await firebase.auth().sendPasswordResetEmail(forgotPasswordEmail)
				setForgotPasswordError("Successfully sent reset password link to your email! Please check your inbox for further instructions.")
				setForgotPasswordErrorType(2);
			} catch {
				setForgotPasswordError("Please enter a valid email address")
				setForgotPasswordErrorType(1);
			}
			setForgotPasswordEmail("")
			setLoading(false)
		}
		event.preventDefault();
	}

	// Do not SSR FirebaseUI, because it is not supported.
	// https://github.com/firebase/firebaseui-web/issues/213
	const [renderAuth, setRenderAuth] = useState(false);
	useEffect(() => {
		if (typeof window !== "undefined") {
			setRenderAuth(true);
		}
	}, []);
	return (
		<Grid container direction="row" justify="center" alignItems="center">

			{!forgotPasswordPage ? 
				<Grid item style={{marginTop: "10px"}}>
					<form onSubmit={(e) => handleSubmit(e)}>
						<Grid container direction="column" justify="center" alignItems="center">
						<Typography variant="h6"> 
							{isLogin ? "Log In" : "Create an account"}
						</Typography>
						<TextField id="standard-basic" label="Email" onChange={(e) => setEmail(e.target.value)} error={errorType == 1 || errorType == 4 } helperText={errorType == 1  ? error : ""}/>
						<TextField id="standard-basic" label="Password" type="password" onChange={(e) => setPassword(e.target.value)} error={errorType == 2 || errorType == 4 } helperText={errorType == 2  ? error : ""}/>
						{!isLogin && 
							<TextField id="standard-basic" label="Confirm Password" type="password" onChange={(e) => setCheckPassword(e.target.value)} error={errorType == 3 || errorType == 4 } helperText={errorType == 3  ? error : ""}/>
						}
						<Button variant="contained" type="submit" style={{marginTop: "5px"}}> 
							Submit
						</Button>
						{errorType == 4 && 
							<Typography variant="subtitle" color={'error'} style={{marginTop: "10px"}}>
								{error}
							</Typography>
						}
						{isLogin ? 
							<Grid>
								<Box height="20px"></Box>
								<Link onClick={() => {setForgotPasswordPage(true)}}>Forgot Password?</Link>
							</Grid>
							:
							<Grid></Grid>
						}
						</Grid>
					</form>
				</Grid>
				:
				<Grid item style={{marginTop: "10px"}}>
						<Grid container direction="column" justify="center" alignItems="center">
							<Typography variant="h6"> 
								Reset your password
							</Typography>
							<TextField id="standard-basic" label="Email" onChange={(e) => setForgotPasswordEmail(e.target.value)}/>
							<Button variant="contained" onClick={(e) => handleForgotPassword(e)} style={{marginTop: "5px"}} disabled={loading}> 
								Send Reset Link
							</Button>
							{forgotPasswordErrorType == 1 && 
								<Typography variant="subtitle" color={'error'} style={{marginTop: "10px"}}>
									{forgotPasswordError}
								</Typography>
							}
							{forgotPasswordErrorType == 2 && 
								<Typography variant="subtitle" color={'black'} style={{marginTop: "10px"}}>
									{forgotPasswordError}
								</Typography>
							}
							<Box height="20px"></Box>
							<Link onClick={() => {setForgotPasswordPage(false); setForgotPasswordError('')}}>Back to log in</Link>
						</Grid>
				</Grid>
			}
			
		</Grid>
	);
};

export default FirebaseAuth;
