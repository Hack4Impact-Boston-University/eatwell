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
	setRatingsCookie,
	removeRatingsCookie,
} from "./cookies";
import { mapUserData } from "./auth/mapUserData";

initFirebase();
var db = firebase.firestore();

export const uploadRating = async (recipe, newRating, oldRating, setObj) => {
	if(newRating == oldRating) {return;}
	let newData = {numRatings: recipe.numRatings, avgRating: recipe.avgRating};
	let sumRatings = recipe.numRatings * recipe.avgRating;
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
	setObj({...recipe, ...newData});
	db.collection("recipes").doc(recipe.id).update(newData);
}

export const getRecipe = async (id) => {
	db.collection("recipes").doc(id).get().then((doc) => {
		if(doc.exists) {
			return doc.data();
		}
	});
}

export const setRecipeListener = (id, callback) => {
	return db.collection("recipes").doc(id).onSnapshot((doc) => callback(doc))
}


