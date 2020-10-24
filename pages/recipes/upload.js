import React, {useState} from 'react'
import * as ui from '@material-ui/core'
import initFirebase from '../../utils/auth/initFirebase'
import firebase from 'firebase/app'
import 'firebase/database'


const UploadForm = () => {
    const [recipeName, setRecipeName] = useState('')
    const [videoID, setVideoID] = useState('')
    const [pdfUrl, setPdfUrl] = useState('')
    
    function upload() {
        const videoUrl = "https://player.vimeo.com/video/" + videoID

        initFirebase()
        var db = firebase.database()

        db.ref('recipes/' + recipeName).set({
            pdfUrl: pdfUrl,
            videoUrl: videoUrl
        })

        alert('here')

        // var storageRef = firebase.database().ref('recipes/'+recipeName)
        // storageRef.set(data)
        //    .then(function() {
        //      console.log('posted!');
        //    })
        //    .catch(function(error) {
        //      console.log(error);
        //    });       
    }

    return (
        <React.Fragment>
        <ui.Typography variant="h6" gutterBottom>
            Upload New Recipe
        </ui.Typography>
        <ui.Grid container spacing={3}>
            <ui.Grid item xs={12} sm={6}>
            <ui.TextField
                required
                value={recipeName}
                label="Recipe Name"
                onChange={(e) => setRecipeName(e.target.value)}
                fullWidth
            />
            </ui.Grid>
            <ui.Grid item xs={12} sm={6}>
            <ui.TextField
                required
                value={videoID}
                label="Vimeo Video ID"
                onChange={(e) => setVideoID(e.target.value)}
                fullWidth
            />
            </ui.Grid>
            <ui.Grid item xs={12}>
            <ui.TextField
                required
                value={pdfUrl}
                label="URL of PDF File"
                onChange={(e) => setPdfUrl(e.target.value)}
                fullWidth
            />
            </ui.Grid>
            <ui.Button variant="outlined">
            <a onClick={() => upload()}>Upload</a>
            </ui.Button>

        </ui.Grid>
        </React.Fragment>
    )
}

export default UploadForm