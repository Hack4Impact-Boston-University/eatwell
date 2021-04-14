/* globals window */
import { useEffect, useState } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase/app";
import "firebase/auth";
import initFirebase from "../utils/auth/initFirebase";
import { setUserCookie, getUserFromCookie } from "../utils/cookies";
import { mapUserData } from "../utils/auth/mapUserData";
import { useUser } from "../utils/auth/useUser";
import { useRadioGroup } from "@material-ui/core";

// Init the Firebase app.
initFirebase();

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
	signInSuccessUrl: "/",
	credentialHelper: "none",
	callbacks: {
		signInSuccessWithAuthResult: async ({ user }, redirectUrl) => {
			const userData = mapUserData(user);
			const fullData = {...userData, ...getUserFromCookie()};
			setUserCookie(fullData);
		},
	},
};

const FirebaseAuth = () => {
	firebaseAuthConfig.signInSuccessUrl = "/profile/makeProfile";

	// Do not SSR FirebaseUI, because it is not supported.
	// https://github.com/firebase/firebaseui-web/issues/213
	const [renderAuth, setRenderAuth] = useState(false);
	useEffect(() => {
		if (typeof window !== "undefined") {
			setRenderAuth(true);
		}
	}, []);
	return (
		<div>
			{renderAuth ? (
				<StyledFirebaseAuth
					uiConfig={firebaseAuthConfig}
					firebaseAuth={firebase.auth()}
				/>
			) : null}
		</div>
	);
};

export default FirebaseAuth;
