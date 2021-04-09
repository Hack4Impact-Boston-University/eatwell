import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import initFirebase from "./auth/initFirebase";
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
} from "./cookies";
import { mapUserData } from "./auth/mapUserData";

initFirebase();
var db = firebase.firestore();

export const uploadRating = async (tip, newRating, oldRating, setObj) => {
	if(newRating == oldRating) {return;}
	let newData = {numRatings: tip.numRatings, avgRating: tip.avgRating};
	let sumRatings = tip.numRatings * tip.avgRating;
	if(oldRating == 0) {
		sumRatings += newRating;
		newData.numRatings = newData.numRatings + 1;
	} else if(newRating == 0) {
		sumRatings -= oldRating;
		newData.numRatings = newData.numRatings - 1;
	} else {
		sumRatings -= oldRating;
		sumRatings += newRating;
	}
	newData.avgRating = sumRatings / newData.numRatings;
	setObj({...tip, ...newData});
	db.collection("tips").doc(tip.id).update(newData);
}

export const getTip = async (id) => {
	db.collection("tips").doc(id).get().then((doc) => {
		if(doc.exists) {
			return doc.data();
		}
	});
}

export const setTipListener = (id, callback) => {
	return db.collection("tips").doc(id).onSnapshot((doc) => callback(doc))
}