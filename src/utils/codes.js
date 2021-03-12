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
	console.log("1")
	return db.collection("codes").doc(code).get()
	.then((doc) => {
		console.log("2")
		if(doc.exists && code == doc.id)  {
			console.log("3");
			return db.collection("codes").doc(code).delete().then(() => {
				return Promise.resolve(true);
			});
		} else {
			return Promise.resolve(false);
		}
	})
	.then((val) => {
		if (val) {
			console.log("4")
			// Save data in cookie
		}
		return Promise.resolve(val);
	})
	.catch((err) => {
		console.log(err);
		return Promise.reject(err);
	});
}


