import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import initFirebase from "./auth/initFirebase";
import {getRecipe} from "./recipes.js"
<<<<<<< HEAD
import { setUserCookie } from "./cookies";
=======
>>>>>>> init

initFirebase();
var db = firebase.firestore();

export const checkCode = async (code) => {
	console.log("1")
	if(code == "test" || code == "org") {
		console.log("2.5")
		return parseCodeData({role: code});
	} else {
		return db.collection("codes").doc(code).get()
		.then((doc) => {
			console.log("2")
			if(doc.exists && code == doc.id)  {
				console.log("3");
				return db.collection("codes").doc(code).delete().then(() => {
					let data = parseCodeData(doc.data());
					return Promise.resolve(data);
				});
			} else {
				return Promise.reject("Code is incorrect");
			}
		});
	}
}

export const parseCodeData = (data) => {
	// Insert manipulation of data from code before passing to upload, for instance retrieving program name from program id
	return data;
}

