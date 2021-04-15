import firebase from '../../../utils/firebase';

export default (req, res) => {
  firebase
    .collection('skills')
    .orderBy("dateUploaded", "desc")
    .get()
    .then((querySnapshot) => {
      var skills = [];
      querySnapshot.forEach((doc) => {
        skills.push({...doc.data(), id:doc.id})
      })
      res.json(skills);
    })
    .catch((error) => {
      res.json({ error });
    });
};