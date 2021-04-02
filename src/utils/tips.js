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

export const uploadRating = async (skill, newRating, oldRating, setObj) => {
	if(newRating == oldRating) {return;}
	let newData = {numRatings: skill.numRatings, avgRating: skill.avgRating};
	let sumRatings = skill.numRatings * skill.avgRating;
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
	setObj({...skill, ...newData});
	db.collection("skills").doc(skill.id).update(newData);
}

export const getSkill = async (id) => {
	db.collection("skills").doc(id).get().then((doc) => {
		if(doc.exists) {
			return doc.data();
		}
	});
}

export const setSkillListener = (id, callback) => {
	return db.collection("skills").doc(id).onSnapshot((doc) => callback(doc))
}