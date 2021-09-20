/* 
	when user tries to use an activation code to sign up for an account, 
	checkCode(code) is called and checked if the used code exists in the 
	'codes' firestore collection 
*/

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

// Called when user enters a code on the account creation page
export const checkCode = async (code, toDelete) => {
	// This feature is unused. Meant to be a way test or preview the site without a code
	if(code == "test" || code == "org") {
		return parseCodeData({role: code});
	// Check that the code exists and if so return its data as a promise
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

