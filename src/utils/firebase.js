/*
  Firebase admin app initialized via a private service account in "admin_key.json"
  Used by the functions in pages/api/ and pages/recipes/[recipeName] to support Next.js client side data fetching from Firebase 
    and dynamic recipe pages, respectively.
*/

import admin from 'firebase-admin';

import serviceAccount from "./admin_key.json";

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