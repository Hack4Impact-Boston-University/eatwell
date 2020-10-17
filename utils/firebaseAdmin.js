import * as admin from 'firebase-admin'

export const verifyIdToken = (token) => {

  if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://eatwell-f06d9.firebaseio.com"
      });
  }

  return admin
    .auth()
    .verifyIdToken(token)
    .catch((error) => {
      throw error
    })
}