import firebase from 'firebase/app'
import 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyAYd5-p2FwjSRiru6Bmr97jb3-Bg0QisjA",
  authDomain: "eatwell-f06d9.firebaseapp.com",
  databaseURL: "https://eatwell-f06d9.firebaseio.com",
  projectId: "eatwell-f06d9",
  storageBucket: "eatwell-f06d9.appspot.com",
  messagingSenderId: "144128258782",
  appId: "1:144128258782:web:8696a98f98e36226df084f",
  measurementId: "G-3DZ83WM9V0"
};

export default function initFirebase() {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
  }
}