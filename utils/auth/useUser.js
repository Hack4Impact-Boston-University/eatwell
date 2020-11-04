import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import initFirebase from '../auth/initFirebase'
import {
  removeUserCookie,
  setUserCookie,
  getUserFromCookie,
} from './userCookies'
import { mapUserData } from './mapUserData'

initFirebase()
var db = firebase.firestore();

const useUser = () => {
  const [user, setUser] = useState()
  const router = useRouter()

  const logout = async () => {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        // Sign-out successful.
        router.push('/')
      })
      .catch((e) => {
        console.error(e)
      })
  }

  useEffect(() => {
    // Firebase updates the id token every hour, this
    // makes sure the react state and the cookie are
    // both kept up to date
    const cancelAuthListener = firebase.auth().onIdTokenChanged((user) => {
      console.log("Boop")
      if (user) {
        var dbData;
        db.collection('users').doc(user.uid).get()
          .then((doc) => {
            if(doc.exists) {
              dbData = doc.data();
            }
            else {
              dbData = {
                email: user.email,
                enrolledProgram: 0
              }
              db.collection('users').doc(user.uid).set(dbData)
            }
            console.log(dbData)
            const authData = mapUserData(user)
            const userData = Object.assign({}, authData, dbData)
            setUserCookie(userData)
            setUser(userData)
          })
      } else {
        removeUserCookie()
        setUser()
      }
    })

    const userFromCookie = getUserFromCookie()
    if (!userFromCookie) {
      //router.push('/')
      return
    }
    setUser(userFromCookie)

    return () => {
      cancelAuthListener()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  //console.log(user)
  return { user, logout }
}

export { useUser }