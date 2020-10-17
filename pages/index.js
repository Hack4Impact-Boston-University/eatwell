import React from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import * as ui from '@material-ui/core'
import Link from 'next/link'
import { useUser } from '../utils/auth/useUser'

const Index = () => {
  const { user, logout } = useUser()
  if (!user) {
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

          <ui.Grid container direction="row" justify="center" alignItems="center">
            <ui.Button variant="outlined">
              <Link href={`recipes/chicken_fried_rice`}>
                <a>Recipe</a>
              </Link>
            </ui.Button>

            <ui.Button variant="outlined">
              <Link href={`/auth`}>
                <a>Sign in</a>
              </Link>
            </ui.Button>
          </ui.Grid>
        </main>
      </div>
    )
  }

  return (
    <div>
      
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

          <ui.Grid container direction="row" justify="center" alignItems="center">
            <ui.Button variant="outlined">
              <Link href={`recipes/chicken_fried_rice`}>
                <a>Recipe</a>
              </Link>
            </ui.Button>

            <ui.Button variant="outlined">
              <Link href={`profile`}>
                <a>Profile</a>
              </Link>
            </ui.Button>
          </ui.Grid>

          <div>
            <p>You're signed in. Email: {user.email}</p>
          </div>
        </main>
      </div>
    </div>
    
  )
}

export default Index
