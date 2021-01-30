import firebase from '../../../utils/firebase';

export default (req, res) => {
  firebase
    .collection('users')
    .get()
    .then((querySnapshot) => {
      var users = {};
      querySnapshot.forEach((doc) => {
        users[doc.id] = {...doc.data()}
      })
      res.json(users);
    })
    .catch((error) => {
      res.json({ error });
    });
};