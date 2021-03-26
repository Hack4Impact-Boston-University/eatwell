import firebase from '../../../utils/firebase';

export default (req, res) => {
  firebase
    .collection('tips')
    .get()
    .then((querySnapshot) => {
      var tips = [];
      querySnapshot.forEach((doc) => {
        tips.push({...doc.data()})
      })
      res.json(tips);
    })
    .catch((error) => {
      res.json({ error });
    });
};