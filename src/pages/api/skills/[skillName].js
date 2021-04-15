import firebase from '../../../utils/firebase';

export default (req, res) => {
  firebase
    .collection('skills')
    .doc(req.query.skillName)
    .get()
    .then((doc) => {
      res.json(doc.data());
    })
    .catch((error) => {
      res.json({ error });
    });
};
