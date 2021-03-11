import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import initFirebase from "./auth/initFirebase";
import {getRecipe} from "./recipes.js"

initFirebase();
var db = firebase.firestore();

export const checkCode = async (code) => {
	// console.log(getRecipe("chicken_fried_rice"))
	db.collection("codes").doc(code).get().then((doc) => {
		if(doc.exists) {
			return doc.data();
		}
	}).catch((err) => {
		console.log(err);
	});

	// db.collection("codes").doc("4AWZnp1za2SjhVRI5iYh").get().then((doc) => {
	// 	if(doc.exists)  {
	// 		// let data = doc.data()
	// 		// if (code in data) {
	// 		// 	//db.collection("codes").doc("codes").set({"codes": {[code] : db.FieldValue.delete()}})
	// 		// 	return true;
	// 		// }
	// 		return true
	// 	}
	// }).catch((err) => {
	// 	console.log(err);
	// });
	return false;
}


