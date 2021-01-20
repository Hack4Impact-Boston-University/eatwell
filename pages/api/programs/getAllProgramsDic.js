import firebase from '../../../utils/firebase';

export default (req, res) => {
  firebase
    .collection('programs')
    .get()
    .then((querySnapshot) => {
      var programs = {};
      querySnapshot.forEach((doc) => {
        programs[doc.id] = {...doc.data()}
      })
      res.json(programs);
    })
    .catch((error) => {
      res.json({ error });
    });
};