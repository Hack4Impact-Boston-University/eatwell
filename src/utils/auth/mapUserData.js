// Used to extract data from the firebase.User object passed to the firebase.auth().onAuthStateChanged listener in useUser.js

export const mapUserData = (user) => {
    const { uid, email, xa } = user
    return {
      id: uid,
      email,
      token: xa,
      provider: user.providerData[0].providerId
    }
  }