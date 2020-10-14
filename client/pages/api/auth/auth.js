import * as firebase from "firebase/app";
import firebaseConfig from "./authkey.json"
if(!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
require("firebase/auth")

var user = null;

firebase.auth().onAuthStateChanged(function(u) {
  if(u) {
    user = u;
  } else {
    user = null;
  }
})

export async function _create(data) {
  //return firebase.auth().createUserWithEmailAndPassword(data["email"], data["pwd"]);
  return new Promise((resolve, reject) => {
    firebase.auth().createUserWithEmailAndPassword(data["email"], data["pwd"])
      .then((userCreds) => resolve(userCreds))
      .catch((reason) => reject(reason));
  });
}

export function _login(data) {
  return new Promise((resolve, reject) => {
    firebase.auth().signInWithEmailAndPassword(data["email"], data["pwd"])
      .then((userCreds) => resolve(userCreds))
      .catch((reason) => reject(reason));
  });
}

export function _logout() {
  return new Promise((resolve, reject) => {
    firebase.auth().signOut()
      .then((userCreds) => resolve(userCreds))
      .catch((reason) => reject(reason));
  });
}

export function getUser(data) {
  if(user == null || data == null) {
    return user;
  } else {
    for(const [key, value] of Object.entries(data)) {
      if(user.hasOwnProperty(key)) {
        data[key] = user[key];
      }
    }
    return data;
  }
}
