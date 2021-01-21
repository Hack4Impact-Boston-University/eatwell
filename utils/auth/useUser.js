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
	removeFavCookie,
	setFavCookie,
	setNotesCookie,
	removeNotesCookie,
	setRatingsCookie,
	removeRatingsCookie,
} from "../cookies";
import { mapUserData } from "./mapUserData";

initFirebase();
var db = firebase.firestore();
const useUser = () => {
	const [user, setUser] = useState();
	const router = useRouter();
	const [resolveUser, setResolve] = useState("resolving");

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
	const upload = async (newData) => {
		if("firstname" in newData || "lastname" in newData || "phone" in newData || "oldPassword" in newData) {
			var currData = getUserFromCookie();
			if(currData) {
				if(!("firstname" in currData)) {
					newData["role"] = "user";
					var userData = Object.assign({}, currData, newData);
					setUserCookie(userData);
					setUser(userData);
					return db.collection("users").doc(user.id).set(userData);
				} else {
					var updateData = {...newData}
					var auth = null;
					if("oldPassword" in newData) {
						if(user.provider == "password") {
							var credential = firebase.auth.EmailAuthProvider.credential(
								user.email,
								newData.oldPassword
							);
							auth = firebase.auth().currentUser.reauthenticateWithCredential(credential).then(() => {
								firebase.auth().currentUser.updatePassword(newData.newPassword);
							})
						}
						delete updateData.oldPassword
						delete updateData.newPassword
					}
					if(Object.keys(updateData).length > 0) {
						var u = db.collection("users").doc(user.id).update(updateData)	
						if(!auth) {
							return u
						}
					}	
					return auth;
				}
			}
		} else if("favoriteRecipes" in newData){
			if(user) {
				return db.collection("users").doc(user.id).update(newData);
			}
		}	
	}

	useEffect(() => {
		// Firebase updates the id token every hour, this
		// makes sure the react state and the cookie are
		// both kept up to date
		const cancelAuthListener = firebase.auth().onAuthStateChanged(function(u) {
			if (u && !user) {
				setResolve("resolving");
				var userData = {};
				db.collection("users")
					.doc(u.uid)
					.get()
					.then((doc) => {
						if (doc.exists) {
							setResolve("found");
							userData = doc.data();
							userData.provider = u.providerData[0].providerId
						} else {
							setResolve("not found");
							userData = mapUserData(u);
						}
						setUserCookie(userData);
						setUser(userData);
						var favData = {}
						for(var i in userData["favoriteRecipes"]) {
							favData[userData["favoriteRecipes"][i]] = "";
						}
						setFavCookie(favData);
						setNotesCookie(userData["notes"] || {})
						setRatingsCookie(userData["ratings"] || {})
					});
			} else if(!u){
				removeUserCookie();
				setUser();
				removeFavCookie();
				removeNotesCookie();
				removeRatingsCookie();
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
	return { user, logout, resolveUser, upload};
};

export { useUser };
