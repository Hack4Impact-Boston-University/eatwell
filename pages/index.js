import React, {useState} from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import * as ui from '@material-ui/core'
import Link from 'next/link'
import { useUser } from '../utils/auth/useUser'
import FirebaseAuth from '../components/FirebaseAuth'

const Index = () => {
  const { user, logout } = useUser()
  const [login, setLogin] = useState(false);

  function signInClick(event) {
    setLogin(true);
  }
  function Login() {
    if(login) {
      return (
        <div>
          <FirebaseAuth/>
        </div>
      );
    }
    return (
      <ui.Grid container direction="row" justify="center" alignItems="center">
          <ui.Button variant="outlined">
            <Link href={`recipes/chicken_fried_rice`}>
              <a>Recipe</a>
            </Link>
          </ui.Button>
          {user ? 
            <ui.Button variant="outlined">
              <Link href={`profile`}>
                <a>Profile</a>
              </Link>
            </ui.Button>
          :<ui.Button variant="outlined" onClick={(e) => signInClick(e)}>
            Login
          </ui.Button>}
        </ui.Grid>
    );
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <img src="/assets/eatwell.png"/>

        <h1 className={styles.title}>
          Welcome to EatWell!
        </h1>

        <Login/>
        
      </main>
    </div>
  )
}

export default Index
