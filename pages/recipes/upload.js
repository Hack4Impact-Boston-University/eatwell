import React, {useState} from 'react'
import * as ui from '@material-ui/core'
// import firebase from '../../utils/firebase'

const UploadForm = () => {
    const [recipeName, setRecipeName] = useState('')
    const [videoID, setVideoID] = useState('')
    const [pdfUrl, setPdfUrl] = useState('')
    
    function upload() {
        const videoUrl = "https://player.vimeo.com/video/" + videoID

        const data = {
            recipeName: recipeName,
            pdfUrl: pdfUrl,
            videoUrl: videoUrl
        }

        // firebase
        //     .collection('recipes')
        //     .add(recipeName)
        //     .set(data)
        alert("Uploaded!");
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