import firebase from '../../../utils/firebase';
import './getUser'

export default (req, res) => {
  firebase
    .collection('users')
    //.doc(req.query.favoriteRecipe)
    .doc(user)
    .get()
    .then((querySnapshot) => {
      var favRec = querySnapshot.get('favorite_recipes')
      //console.log(favRec)
      res.json({favRec})

      //console.log(querySnapshot);
      //console.log(querySnapshot.get('favorite_recipes'))
      
    })
    .catch((error) => {
      res.json({ error });
    });
};
