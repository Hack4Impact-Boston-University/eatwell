import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import initFirebase from "./auth/initFirebase";
import {getRecipe} from "./recipes.js"
import { setUserCookie } from "./cookies";

initFirebase();
var db = firebase.firestore();

export const checkCode = async (code, toDelete) => {
	console.log("1")
	if(code == "test" || code == "org") {
		return parseCodeData({role: code});
	} else {
		return db.collection("codes").doc(code).get()
		.then((doc) => {
			if(doc.exists && code == doc.id)  {
				let data = parseCodeData(doc.data());
				data = {...data};
				setUserCookie(data);
				return Promise.resolve(data);
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

