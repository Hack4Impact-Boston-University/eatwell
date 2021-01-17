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
// export const uploadRating = async (newRatings, oldRatings, data) => {
// 	if(data === undefined) {return;}
// 	let recipeData = {};
// 	data.forEach(recipe => {recipeData[recipe.id] = recipe})
// 	let ratings = {};
// 	Object.keys(newRatings).forEach(recipe => {
// 		newRatings[recipe] = parseFloat(newRatings[recipe])
// 		ratings[recipe] = newRatings[recipe];
// 	})
// 	Object.keys(oldRatings).forEach(recipe => {
// 		oldRatings[recipe] = parseFloat(oldRatings[recipe])
// 		if(recipe in Object.keys(ratings) && ratings[recipe] == oldRatings[recipe]) {
// 			delete newRatings[recipe]; delete oldRatings[recipe]; delete ratings[recipe];
// 		} else {
// 			ratings[recipe] = oldRatings[recipe];
// 		}
// 	})
// 	Object.keys(ratings).forEach(recipe => {
// 		let newData = {numRatings: recipeData[recipe].numRatings, avgRating: recipeData[recipe].avgRating};
// 		let sumRatings = newData.avgRating * newData.numRatings;
// 		if(recipe in Object.keys(oldRatings) && recipe in Object.keys(newRatings)) {
// 			sumRatings -= oldRatings[recipe];
// 			sumRatings += newRatings[recipe];
// 			newData.avgRating = sumRatings / newData.numRatings;
// 		}
// 		else if(recipe in Object.keys(newRatings)){
// 			sumRatings += newRatings[recipe];
// 			newData.numRatings = newData.numRatings + 1;
// 			newData.avgRating = sumRatings / newData.numRatings;
// 		}
// 		else {
// 			sumRatings -= newRatings[recipe];
// 			newData.numRatings = newData.numRatings - 1;
// 			newData.avgRating = sumRatings / newData.numRatings;
// 		}
// 		db.collection("recipes").doc(recipe).update(newData);
// 	});
// 	return "";
// }

export const uploadRating = async (recipe, newRating, oldRating) => {
	console.log(recipe.id, newRating, oldRating)
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


