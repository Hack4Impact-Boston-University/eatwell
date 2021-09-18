/*
Contains functions and exports related to user authentication in Firebase
  and user data in Firestore.
 
useUser() is called in other pages to access:
	- The user state object
		- This is set or removed in the "firebase.auth().onAuthStateChanged" listener.
	- logout()
		- Calls firebase.auth() to sign out and return to the main page
	- upload()
		- Multiuse function to add or modify data to the current user's Firestore document
	- resolveUser
		- Indicates whether the user document has been found or is being resolved, for use in makeProfile.js

firebase.auth().onAuthStateChanged():
	- Listener which is passed the firebase.User object when the user signs in or out, or the user's id has been updated hourly
	- If the user has just signed in, their user data in Firestore is retrieved if it exists, and the data is combined to set 
	user state, favorite recipes, and recipe ratings cookies

upload():
	- See comments below

*/

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
	setRatingsCookie,
	removeRatingsCookie,

	removeFavSkillsCookie,
	setFavSkillsCookie,
	removeNotesSkillsCookie,
	setRatingsSkillsCookie,
	removeRatingsSkillsCookie,

	removeFavTipsCookie,
	setFavTipsCookie,
	removeNotesTipsCookie,
	setRatingsTipsCookie,
	removeRatingsTipsCookie,
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

	const checkProgram = async () => {
		const waitForAuthState = () => {
			return new Promise(resolve => {
				if(user) {
					resolve();
				}
			})
		}
		await waitForAuthState();
		return db.collection("users").doc(user.id).get().then((doc) => {
			const program = doc.data()["program"];
			return program == "";
		}).catch((err) => {
			console.log(err);
		});
	}

	const upload = async (newData) => {
		// If we are adding user profile data or changing password
		if("firstname" in newData || "lastname" in newData || "phone" in newData || "oldPassword" in newData || "role" in newData) {
			var currData = getUserFromCookie();
			// This should be true
			if(currData) { 
				// If the user has initialized their account with a program code and created a profile already
				if(!("firstname" in currData)) {
					if (user?.role != undefined) {
						newData["role"] = "client";
						newData["client"] = ""
						newData["program"] = []
					} else {
						newData["role"] = "user";
						newData["client"] = currData.client
					}
					var userData = Object.assign({}, currData, newData);
					// If the user just created their profile in makeProfile
					if("codeID" in userData) {
						// Delete the program code just used to create the account
						return db.collection("codes").doc(userData["codeID"]).delete().then(() => {
							delete userData["codeID"];

							// Add the code data (program) to the user document and append the user in the program document
							if("program" in userData && "id" in user) {
								setUserCookie(userData);
								setUser(userData);
								return db.collection("users").doc(user.id).set(userData).then(() => {
									return db.collection("programs").doc(userData["program"]).update({
										programUsers: firebase.firestore.FieldValue.arrayUnion(user["id"])
									})
								});
							} else {
								setUserCookie(userData);
								setUser(userData);
								return db.collection("users").doc(user.id).set(userData);
							}
					    });
					// If the user is updating their profile info
					} else {
						setUserCookie(userData);
						setUser(userData);
						return db.collection("users").doc(user.id).set(userData);
					}
				// If the user is changing their password
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
		// If we are adding a program to existing account
		} else if("program" in newData) {
				checkProgram().then((res) => {
					if(res) {
						var currData = getUserFromCookie();
						var updateData = _.omit(newData, "codeID")
						var userData = Object.assign({}, currData, updateData);
						setUserCookie(userData);
						setUser(userData);
						return db.collection("users").doc(user.uid).update(updateData).then(() => {
							return db.collection("codes").doc(newData.codeID).delete().then(() => {
								router.push("/profile/makeProfile");
							})
						})
					} else {
						return Promise.reject('Existing program')
					}
				})
		}
		// If we are updating the favorite recipes, skills, or tips for the user
		else if("favoriteRecipes" in newData) {
			newData.timestamp = firebase.firestore.FieldValue.serverTimestamp();
			if(user) {
				return db.collection("users").doc(user.id).update(newData);
			}
		} else if("favoriteSkills" in newData) {
			if(user) {
				return db.collection("users").doc(user.id).update(newData);
			}
		} else if("favoriteTips" in newData) {
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
			// u is the firebase.User object

			// Only set user cookie if it is not already set. Callback is sometimes called multiple times for a single state change
			if (u && !user) {
				setResolve("resolving");
				var userData = {};

				// Retrieve the user document. Use firebase.User data to initialize this document if it does not exist.
				// Set state cookies based on existing cookies and the document or auth data
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
						var fullData = {...userData, ...getUserFromCookie()};
						setUserCookie(fullData);
						setUser(fullData);
						var favData = {}
						for(var i in userData["favoriteRecipes"]) {
							favData[userData["favoriteRecipes"][i]] = "";
						}
						setFavCookie(favData);
						setRatingsCookie(userData["ratings"] || {})

						var favSkillsData = {}
						for(var i in userData["favoriteSkills"]) {
							favSkillsData[userData["favoriteSkills"][i]] = "";
						}
						setFavSkillsCookie(favSkillsData);
						setRatingsSkillsCookie(userData["ratingsSkills"] || {})


						var favTipsData = {}
						for(var i in userData["favoriteTips"]) {
							favTipsData[userData["favoriteTips"][i]] = "";
						}
						setFavTipsCookie(favTipsData);
						setRatingsTipsCookie(userData["ratingsTips"] || {})
					});
			} else if(!u){
				var userData = getUserFromCookie();
				if(userData && "id" in userData) {
					removeUserCookie();
				}
				setUser();
				removeFavCookie();
				removeRatingsCookie();

				removeFavSkillsCookie();
				removeRatingsSkillsCookie();

				removeFavTipsCookie();
				removeRatingsTipsCookie();
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
