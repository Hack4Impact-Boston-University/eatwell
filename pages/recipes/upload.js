import React, {useState} from 'react'
import * as ui from '@material-ui/core'
import * as firebase from 'firebase'
import 'firebase/firestore'
import initFirebase from '../../utils/auth/initFirebase'
import { DropzoneArea } from 'material-ui-dropzone'
import { PictureAsPdf } from '@material-ui/icons'

initFirebase()

const handlePreviewIcon = (fileObject, classes) => {
    const iconProps = {
      className : classes.image,
    }
    return <PictureAsPdf {...iconProps} />
}

const UploadForm = () => {
    const [recipeName, setRecipeName] = useState('')
    const [videoID, setVideoID] = useState('')
    const [pdfFile, setPdfFile] = useState('')

    function upload() {
        const videoUrl = "https://player.vimeo.com/video/" + videoID

        var recipe = recipeName.toLowerCase()
        recipe = recipe.replace(/ /g, "_")
    
        var collection = firebase.firestore().collection('recipes')
        var data = {
            videoUrl: videoUrl,
        }
        
        collection.doc(recipe).set(data)
        firebase.storage().ref().child(recipeName+".pdf").put(pdfFile)

        alert("Your upload was successful!")
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
                <DropzoneArea
                    accept="application/pdf"
                    maxFileSize={10485760}
                    dropzoneText="Click to select or drag and drop recipe PDF"
                    filesLimit={1}
                    getPreviewIcon={handlePreviewIcon}
                    onChange={(files) => setPdfFile(files[0])}
                />
            </ui.Grid>
            <ui.Grid item xs={12}>
                <ui.Button variant="outlined" fullWidth>
                    <a onClick={() => upload()}>Upload</a>
                </ui.Button>
            </ui.Grid>

        </ui.Grid>
        </React.Fragment>
    )
}

export default UploadForm