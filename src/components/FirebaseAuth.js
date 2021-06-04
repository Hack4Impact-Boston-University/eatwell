/* globals window */
import { useEffect, useState } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase/app";
import "firebase/auth";
import { setUserCookie, getUserFromCookie } from "../utils/cookies";
import { mapUserData } from "../utils/auth/mapUserData";
import { useUser } from "../utils/auth/useUser";
import { Grid, TextField, Button, Typography, makeStyles } from "@material-ui/core";
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
			setUserCookie({...fullData, code});
		},
	},
};

const useStyles = makeStyles((theme) => ({
}));

const FirebaseAuth = ({isLogin, code, checkProgram}) => {
	const classes = useStyles();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [checkPassword, setCheckPassword] = useState('');
	const [error, setError] = useState('');
	const { upload, logout } = useState('');
	// Error types: 
	// 0 - No Error
	// 1 - Email error
	// 2 - Password error
	// 3 - Password confirm error
	// 4 - Sensitive error, do not give error info
	const [errorType, setErrorType] = useState(0);
	const router = useRouter();
	
	//  const handleChange = (type, event) => {
	// 	var j = {};
	// 	j[type] =  event.target.value;
	// 	this.setState(j);
	//   }
	const handleSubmit = (event) => {
		if(email == '') {
		  setError("Please enter an email address");
		  setErrorType(1);
		} else if(password == '') {
		  setError("Please enter a password");
		  setErrorType(2);
		} else if(isLogin) {
			setErrorType(0);
			setError("");


			firebase.auth().signInWithEmailAndPassword(email, password)
			.then((userCredential) => {
				var user = userCredential.user;
				console.log(checkProgram, user)
				const userData = mapUserData(user);
				const fullData = {...userData, ...getUserFromCookie()};
				const codeID = code.codeID
				delete code.codeID

				if(checkProgram) {
					return db.collection("users").doc(user.uid).get().then((doc) => {
						const program = doc.data()["program"];
						console.log("program: ", program)
						if(program != "") {
							setError("This account has an active program. Joining multiple active programs is not allowed.")
							logout();
						} else {
							setUserCookie({...fullData, code});
							return db.collection("users").doc(user.uid).update(code).then(() => {
								return db.collection("codes").doc(codeID).delete().then(() => {
									router.push("/profile/makeProfile");
								})
							})
						}
					}).catch((err) => {
						console.log(err);
					});
				}
				setUserCookie({...fullData, code});
				router.push("/profile/makeProfile");

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
		} else {
			setErrorType(0);
			setError("");
			firebase.auth().createUserWithEmailAndPassword(email, password)
			.then((userCredential) => {
				var user = userCredential.user;
				const userData = mapUserData(user);
				const fullData = {...userData, ...getUserFromCookie()};
				setUserCookie({...fullData, code});
				router.push("/profile/makeProfile");
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
			{/* <Grid item>
				{renderAuth ? (
					<StyledFirebaseAuth
						uiConfig={firebaseAuthConfig}
						firebaseAuth={firebase.auth()}
					/>
				) : null}
			</Grid> */}
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
				</Grid>
			</form>
			</Grid>
		</Grid>
	);
};

export default FirebaseAuth;
