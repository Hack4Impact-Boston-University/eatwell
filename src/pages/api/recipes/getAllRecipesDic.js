import firebase from '../../../utils/firebase';

export default (req, res) => {
  firebase
    .collection('recipes')
    .get()
    .then((querySnapshot) => {
      var recipes = {};
      querySnapshot.forEach((doc) => {
        recipes[doc.id] = {...doc.data()}
      })
      res.json(recipes);
    })
    .catch((error) => {
      res.json({ error });
    });
};