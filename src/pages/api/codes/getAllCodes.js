import firebase from '../../../utils/firebase';

export default (req, res) => {
  firebase
    .collection('codes')
    .get()
    .then((querySnapshot) => {
      var codes = [];
      querySnapshot.forEach((doc) => {
        codes.push({...doc.data(), id: doc.id})
      })
      res.json(codes);
    })
    .catch((error) => {
      res.json({ error });
    });
};