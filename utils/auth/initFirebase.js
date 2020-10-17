import firebase from 'firebase/app'
import 'firebase/auth'
import firebaseConfig from "../auth.json"

export default function initFirebase() {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
  }
}