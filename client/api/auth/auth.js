import * as firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCigAOzXJYOEbrWtZBo6ZkvX0SmJf0S4Jg",
  authDomain: "eatwell-f06d9.firebaseapp.com",
  databaseURL: "https://eatwell-f06d9.firebaseio.com",
  projectId: "eatwell-f06d9",
  storageBucket: "eatwell-f06d9.appspot.com",
  messagingSenderId: "144128258782",
  appId: "1:144128258782:web:8696a98f98e36226df084f",
  measurementId: "G-3DZ83WM9V0"
};
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

export function getUser(data) {
  if(user == null || data == null) {
    return user;
  } else {
    for(const [key, value] of Object.entries(data)) {
      if(user.hasOwnProperty(key)) {
        data[key] = user[key];
      }
    }
  }
}
