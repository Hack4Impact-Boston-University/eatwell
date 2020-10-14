import admin from 'firebase-admin';
import serviceAccount from "./key.json"
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://eatwell-f06d9.firebaseio.com"
  });
} catch (error) {
  /*
   * We skip the "already exists" message which is
   * not an actual error when we're hot-reloading.
   */
  if (!/already exists/u.test(error.message)) {
    // eslint-disable-next-line no-console
    console.error('Firebase admin initialization error', error.stack);
  }
}

export default admin.firestore();
