import firebase from '../../../utils/firebase';

export default (req, res) => {
  firebase
    .collection('skills')
    .get()
    .then((querySnapshot) => {
      var skills = [];
      querySnapshot.forEach((doc) => {
        skills.push({...doc.data()})
      })
      res.json(skills);
    })
    .catch((error) => {
      res.json({ error });
    });
};