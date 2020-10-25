import * as firebase from "firebase";
import firebaseConfig from "./authkey.json"
if(!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export async function getAllRecipes() {
  return new Promise((resolve, reject) => {
    firebase.firestore().collection('recipes').get()
      .then((querySnapshot) => {
        var recipes = [];
        querySnapshot.forEach((doc) => {
          recipes[doc.id] = doc.data()
        })
        resolve(recipes);
      })
      .catch((reason) => reject(reason));
  });
}