import firebase from '../../../utils/firebase';

export default (req, res) => {
  firebase
    .collection('recipes')
    .get()
    .then((querySnapshot) => {
      var recipes = [];
      querySnapshot.forEach((doc) => {
        recipes.push({...doc.data()})
      })
      res.json(recipes);
    })
    .catch((error) => {
      res.json({ error });
    });
};

// document.getElementById('review').addEventListener('post', postComment);

// Retrieve new posts as they are added to our database
// ref.on("child_added", function(snapshot, prevChildKey) {
//   var newPost = snapshot.val();
//   console.log("review: " + comment_input);

// });

// function postComment(comment){
//   comment.preventDefault();

//   var new_comment = getComment('comment_input');
// }

// function getComment(new_comment){
//   return document.getElementById(new_comment).nodeValue;
// }
