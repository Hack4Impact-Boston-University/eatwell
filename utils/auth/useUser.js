import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import initFirebase from "../auth/initFirebase";
import {
	removeUserCookie,
	setUserCookie,
	getUserFromCookie,
} from "./userCookies";
import { mapUserData } from "./mapUserData";

initFirebase();
var db = firebase.firestore();
const useUser = () => {
	const [user, setUser] = useState();
	const router = useRouter();
	let userExists = getUserFromCookie();
	const logout = async () => {
		return firebase
			.auth()
			.signOut()
			.then(() => {
				// Sign-out successful.
				router.push("/");
			})
			.catch((e) => {
				console.error(e);
			});
	};

	useEffect(() => {
		// Firebase updates the id token every hour, this
		// makes sure the react state and the cookie are
		// both kept up to date
		const cancelAuthListener = firebase.auth().onAuthStateChanged(function(u) {
			if (u && !user) {
				var dbData;
				db.collection("users")
					.doc(u.uid)
					.get()
					.then((doc) => {
						if (doc.exists) {
							dbData = doc.data();
							userExists = true;
						} else {
							dbData = {
								email: u.email,
								enrolledProgram: 0,
							};
							userExists = false;
							db.collection("users").doc(u.uid).set(dbData);
						}
						const authData = mapUserData(u);
						const userData = Object.assign({}, authData, dbData);
						setUserCookie(userData);
						setUser(userData);
					});
			} else if(!u){
				removeUserCookie();
				setUser();
			}
		});
		if(!user) {
			const userFromCookie = getUserFromCookie();
			if (!userFromCookie) {
				//router.push('/')
				return;
			}
			setUser(userFromCookie);
		}

		return () => {
			cancelAuthListener();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	//console.log(user)
	return { user, logout, userExists };
};

export { useUser };
