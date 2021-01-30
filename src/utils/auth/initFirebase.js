import firebase from 'firebase/app'
import 'firebase/auth'

var firebaseConfig = {
  apiKey: "AIzaSyC2_aOpnms38eo6G2CmEwfIHMA04utDnis",
  authDomain: "eatwell-87d0c.firebaseapp.com",
  projectId: "eatwell-87d0c",
  storageBucket: "eatwell-87d0c.appspot.com",
  messagingSenderId: "270259249884",
  appId: "1:270259249884:web:799489f9bda4607144ca19"
};

export default function initFirebase() {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
  }
}