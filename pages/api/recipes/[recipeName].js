import firebase from '../../../lib/firebase';

export default (req, res) => {
  firebase
    .collection('recipes')
    .doc(req.query.recipeName)
    .get()
    .then((doc) => {
      res.json(doc.data());
    })
    .catch((error) => {
      res.json({ error });
    });
};
