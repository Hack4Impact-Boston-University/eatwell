import React, {useState} from 'react'
import * as ui from '@material-ui/core'
import * as firebase from 'firebase';
import 'firebase/firestore';
import initFirebase from '../../utils/auth/initFirebase';

initFirebase()

const UploadForm = () => {
    const [recipeName, setRecipeName] = useState('')
    const [videoID, setVideoID] = useState('')
    const [pdfUrl, setPdfUrl] = useState('')

    function upload() {
        const videoUrl = "https://player.vimeo.com/video/" + videoID

        var recipe = recipeName.toLowerCase()
        recipe = recipe.replace(/ /g, "_")
    
        var collection = firebase.firestore().collection('recipes')
        var data = {
            pdfUrl: pdfUrl,
            videoUrl: videoUrl
        }
        
        collection.doc(recipe).set(data)

        alert('upload successful!')
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