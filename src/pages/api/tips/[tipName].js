import firebase from '../../../utils/firebase';

export default (req, res) => {
  firebase
    .collection('tips')
    .doc(req.query.tipName)
    .get()
    .then((doc) => {
      res.json(doc.data());
    })
    .catch((error) => {
      res.json({ error });
    });
};
