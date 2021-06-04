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
	const upload = async (newData) => {
		if("firstname" in newData || "lastname" in newData || "phone" in newData || "oldPassword" in newData) {
			var currData = getUserFromCookie();
			if(currData) {
				if(!("firstname" in currData)) {
					newData["role"] = "user";
					var userData = Object.assign({}, currData, newData);
					if("code" in userData) {
						return db.collection("codes").doc(userData["code"]["id"]).delete().then(() => {
							delete userData["code"];
							if("program" in userData && "id" in user) {
								setUserCookie(userData);
								setUser(userData);
								return db.collection("users").doc(user.id).set(userData).then(() => {
									console.log("ello00");
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
					} else {
						setUserCookie(userData);
						setUser(userData);
						return db.collection("users").doc(user.id).set(userData);
					}
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
			newData.timestamp = firebase.firestore.FieldValue.serverTimestamp();
			if(user) {
				return db.collection("users").doc(user.id).update(newData);
			}
		} else if("favoriteSkills" in newData){
			if(user) {
				return db.collection("users").doc(user.id).update(newData);
			}
		} else if("favoriteTips" in newData){
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
