import firebase from '../../../utils/firebase';
import './getUser';

export default (req, res) => {
  firebase
    .collection('users')
    .doc(user)
    .get()
    .then((querySnapshot) => {
      var favRec = querySnapshot.get('favorite_recipes')
      console.log(favRec)
      res.favRec
      //({ favRec })
    })
    .catch((error) => {
      res.json({ error });
    });
};
