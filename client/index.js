import React from 'react'
import ReactDOM from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import * as ui from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'

import {_login, _create} from './api/auth/auth.js'
import { resolveHref } from 'next/dist/next-server/lib/router/router'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
      <img src="/assets/eatwell.png" width="75%"/>

        <h2 className={styles.title}>
          Welcome to EatWell!
        </h2>

        <Grid/>
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
  );
}

class Grid extends React.Component {
  constructor(props) {
    super(props);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.state = {login: false};
  }

  handleLoginClick() {
    this.setState({login: true});
  }

  handleLoginSubmit() {
    this.setState({login: false});
  }


  render() {
    if(this.state.login) {
      return <Login action={this.handleLoginSubmit}/>
    }
    else {
      return (
        <ui.Grid container direction="row" justify="center" alignItems="center">
            
            <ui.Button variant="outlined" onClick={this.handleLoginClick}>
              Login
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
      );
    }
  }
}

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {"email": '', "pwd": '', "cpwd": '', "error": '', "isLogin": true}; 
    // Error: 0 is no errors, 1 is incorrect email/pass combo, 2 is password does not match, 3 is invalid email, 4 is 
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.switchLogin = this.switchLogin.bind(this)
  }

  handleChange(type, event) {
    var j = {};
    j[type] =  event.target.value;
    this.setState(j);
  }
  handleSubmit(event) {
    if(this.state.email == '') {
      this.setState({"error": "Please enter an email address"});
    } else if(this.state.pwd == '') {
      this.setState({"error": "Please enter a password"});
    } else if(this.state.isLogin) {
      // try {
      //   const result  = _login(this.state).then(() => {
      //     //this.props.action();
      //   });
      // } catch (err) {
      //   console.log(err.message);
      //   var m = "";
      //   switch(err.code) {
      //     case "auth/invalid-email":
      //       m = "Email address is not valid";
      //       break;
      //     case "auth/user-disabled":
      //       m = "User account has been disabled";
      //       break;
      //     case "auth/user-not-found":
      //     case "auth/wrong-password":
      //       m = "Incorrect email or password";
      //       break;
      //     default:
      //   }
      //   if(m) {this.setState({"error": m});}
      // }
      _login(this.state).then(val => {
        this.props.action();
      }, err => {
        //console.log(err.message);
        var m = "";
        switch(err.code) {
          case "auth/invalid-email":
            m = "Email address is not valid";
            break;
          case "auth/user-disabled":
            m = "User account has been disabled";
            break;
          case "auth/user-not-found":
          case "auth/wrong-password":
            m = "Incorrect email or password";
            break;
          default:
        }
        if(m) {console.log(m); this.setState({"error": m});}
      });
    } else if(this.state.cpwd == '') {
      this.setState({"error": "Please confirm your password"});
    } else if(this.state.pwd != this.state.cpwd){ 
      this.setState({"error": "Passwords do not match"});
    } else {
      _create(this.state).then(val => {
        
      }, err => {
        //console.log(err.message);
        var m = "";
        switch(err.code) {
          case "auth/email-already-in-use":
            m = "Account with given email address already exists";
            break;
          case "auth/invalid-email":
            m = "Email address is not valid";
            break;
          case "auth/weak-password":
            m = "Password is too weak";
            break;
        }
        if(m) {this.setState({"error": m});}
      });
    }
    event.preventDefault();
  }

  switchLogin(event) {
    this.setState({"isLogin" : !this.state.isLogin});
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <ui.Grid container direction="column" justify="center" alignItems="center">
          <ui.TextField id="standard-basic" label="Email" onChange={(e) => this.handleChange("email", e)} error={this.state.error == 3} helperText={this.state.error == 3 ? "Invalid email" : ""}/>
          <ui.TextField id="standard-basic" label="Password" type="password" onChange={(e) => this.handleChange("pwd", e)} error={this.state.error == 1} helperText={this.state.error == 1 ? "Incorrect Username or Password" : ""}/>
          {!this.state.isLogin && 
            <ui.TextField id="standard-basic" label="Confirm Password" type="password" onChange={(e) => this.handleChange("cpwd", e)} error={this.state.error == 2} helperText={this.state.error == 2 ? "Password does not match" : ""}/>
          }
          {this.state.error && 
            <Alert severity="error">{this.state.error}</Alert>}
          <ui.Button disableElevation={true} disableRipple={false} onClick={(e) => this.switchLogin(e)}> 
            {this.state.isLogin ? "Create an account" : "Log In"}
          </ui.Button>
          <ui.Button variant="contained" type="submit"> 
            Submit
          </ui.Button>
        </ui.Grid>
      </form>
    );
  }
}