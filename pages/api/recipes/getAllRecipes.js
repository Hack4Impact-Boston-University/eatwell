import firebase from '../../../utils/firebase';

export default (req, res) => {
  firebase
    .collection('recipes')
    .get()
    .then((querySnapshot) => {
      var recipes = [];
      querySnapshot.forEach((doc) => {
        recipes.push({...doc.data()})
      })
      res.json(recipes);
    })
    .catch((error) => {
      res.json({ error });
    });
};
