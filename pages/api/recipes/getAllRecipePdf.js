import firebase from '../../../utils/firebase';
import 'firebase/firestore';
// import { useState, useEffect } from "react";

export default (req, res) => {
    // const [pdf_url, setPdfURL] = React.useState('')
    // const [recipesPdfUrl, setRecipesPdfUrl] = React.useState({});
    var recipesPdfUrlTemp = [];

    firebase
    .collection('recipes')
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        firebase.storage().ref().child(doc.data().pdfRecipe).getDownloadURL().then(function(url) {
            // setPdfURL(url)
            recipesPdfUrlTemp[doc.id] = url
            // recipesPdfUrlTemp[doc.id] = pdf_url
            // setRecipesPdfUrl(recipesPdfUrlTemp)
          }).catch(function(error) {
        })
      })
      res.json(recipesPdfUrlTemp);
    })
    .catch((error) => {
      res.json({ error });
    });
};