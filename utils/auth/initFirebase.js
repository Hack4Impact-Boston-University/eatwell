import firebase from 'firebase/app'
import 'firebase/auth'

const config = {
  apiKey: "AIzaSyCigAOzXJYOEbrWtZBo6ZkvX0SmJf0S4Jg",
  authDomain: "eatwell-f06d9.firebaseapp.com",
  databaseURL: "https://eatwell-f06d9.firebaseio.com",
  projectId: "eatwell-f06d9",
}

export default function initFirebase() {
  if (!firebase.apps.length) {
    firebase.initializeApp(config)
  }
}