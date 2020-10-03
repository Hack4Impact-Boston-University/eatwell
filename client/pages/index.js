import Head from 'next/head'
import styles from '../styles/Home.module.css'
import * as ui from '@material-ui/core';

export default function Home() {
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
          
          <ui.Button variant="outlined" href={"auth/userAuth"}>
            User Auth
          </ui.Button>
      
          <ui.Button variant="outlined" href={"home"} m={10}>
            Home
          </ui.Button>

          <ui.Button variant="outlined" href={"profile/userProfile"}>
            User Profile
          </ui.Button>
        
          <ui.Button variant="outlined" href={"recipe/recipeList"}>
            Recipe List
          </ui.Button>

          <ui.Button variant="outlined" href={"recipe/viewRecipe"}>
            View Recipe
          </ui.Button>

          <ui.Button variant="outlined" href={"mealkit/mealkitList"}>
            Meal Kit List
          </ui.Button>

          <ui.Button variant="outlined" href={"mealkit/orderHistory"}>
            Order History
          </ui.Button>

        </ui.Grid>

      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}
