import firebase from '../../../utils/firebase';

export default (req, res) => {
  firebase
    .collection('tips')
    .orderBy("dateUploaded", "desc")
    .get()
    .then((querySnapshot) => {
      var tips = [];
      querySnapshot.forEach((doc) => {
        tips.push({...doc.data(), id:doc.id})
      })
      res.json(tips);
    })
    .catch((error) => {
      res.json({ error });
    });
};