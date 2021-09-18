// Retrieve document for desired recipe, which is indexed by name

import firebase from '../../../utils/firebase';

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
