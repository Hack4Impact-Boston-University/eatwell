import React, {useState} from 'react'
import * as ui from '@material-ui/core'
import * as firebase from 'firebase'
import 'firebase/firestore'
import initFirebase from '../../utils/auth/initFirebase'
import { DropzoneArea } from 'material-ui-dropzone'
import { PictureAsPdf, Router } from '@material-ui/icons'
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import InboxIcon from '@material-ui/icons/Inbox';
import StarIcon from '@material-ui/icons/Star';
import SendIcon from '@material-ui/icons/Send';
import DraftsIcon from '@material-ui/icons/Send';
import MultiImageInput from 'react-multiple-image-input';

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
    const [description, setDescription] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [videoSkills, setVideoSkills] = useState('')
    const [videoTips, setVideoTips] = useState('')
    const [errorAlert, setErrorAlert] = useState(false);
	const [successAlert, setSuccessAlert] = useState(false);
    // const [images, setImages] = useState({});
    // const [image, setImage] = useState('');


    const uploadImage = (e) => {
		e.preventDefault();
		console.log(e.target.files);
		const re = /(?:\.([^.]+))?$/;
		let ext = re.exec(e.target.files[0].name)[1];
		console.log("ext");
		if (ext !== "png" && ext !== "jpg" && ext !== "jpeg") {
			console.log("Please upload a .png, .jpg, or .jpeg file");
			setErrorAlert(true);
		} else {
			console.log("file uploaded");
			setSuccessAlert(true);
		}
		console.log(successAlert);
    };

    const crop = {
        unit: '%',
        aspect: 4 / 3,
        width: '100'
    };
    
    function upload() {

        const videoUrl = "https://player.vimeo.com/video/"

        var recipe = recipeName.toLowerCase()
        recipe = recipe.replace(/ /g, "_")

        var date = new Date()
        var dateUploaded = date.getFullYear().toString() + '/' +date.getMonth().toString() + '/' + date.getDate().toString()
    
        var i;
        var uploadedImages = [];
        for (i = 0; i < 3 ; i++) {
            uploadedImages.push(recipeName+" "+i+".img")
        }
        // console.log(images[0]);
        
        var collection = firebase.firestore().collection('recipes')
        var data = {
            nameOfDish: recipeName,
            description: description,
            // images: uploadedImages,
            imageUrl: imageUrl,
            videoRecipe: videoUrl + videoID,
            pdfRecipe: recipeName+".pdf",
            dateUploaded: dateUploaded,
            videoSkills: videoUrl + videoSkills,
            videoTips: videoUrl + videoTips,
        }
        
        // console.log(data)

        collection.doc(recipe).set(data)
        firebase.storage().ref().child(recipeName+".pdf").put(pdfFile).on(firebase.storage.TaskEvent.STATE_CHANGED, {
            'complete': function() {
                alert('upload successful!')
            }
        })

        // firebase.storage().ref().child(recipeName+" 0"+".img").put(image).on(firebase.storage.TaskEvent.STATE_CHANGED, {
        //     'complete': function() {
        //         alert('upload successful!')
        //     }
        // })

        // var uploadedImages = []
        // images.map(function (key,value) {
        //     uploadedImages.push(value)
        //     // firebase.storage().ref().child(recipeName+".img").put(1).on(firebase.storage.TaskEvent.STATE_CHANGED, {
        //     //     'complete': function() {
        //     //         alert('upload successful!')
        //     //     }
        //     // })
        // })
        // firebase.storage().ref().child(recipeName+".img").put(images).on(firebase.storage.TaskEvent.STATE_CHANGED, {
        //     'complete': function() {
        //         alert('upload successful!')
        //     }
        // })

        console.log(setPdfFile);
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
                    variant="outlined"
                />
            </ui.Grid>
            <ui.Grid item xs={12} sm={6}>
                <ui.TextField
                    required
                    value={videoID}
                    label="Vimeo Recipe Video ID"
                    onChange={(e) => setVideoID(e.target.value)}
                    fullWidth
                    variant="outlined"
                />
            </ui.Grid>
            <ui.Grid item xs={12} sm={6}>
                <ui.TextField
                    required
                    value={videoSkills}
                    label="Vimeo Skills Video ID"
                    onChange={(e) => setVideoSkills(e.target.value)}
                    fullWidth
                    variant="outlined"
                />
            </ui.Grid>
            <ui.Grid item xs={12} sm={6}>
                <ui.TextField
                    required
                    value={videoTips}
                    label="Vimeo Tips Video ID"
                    onChange={(e) => setVideoTips(e.target.value)}
                    fullWidth
                    variant="outlined"
                />
            </ui.Grid>
            {/* <MultiImageInput
                images={images}
                setImages={setImages}
                cropConfig={{ crop, ruleOfThirds: true }}
                inputId
                // onChange={(files) => setImage(files[0])}
            /> */}
            <ui.Grid item xs={12}>
                <ui.TextField
                    required
                    value={imageUrl}
                    label="Image URL"
                    multiline
                    onChange={(e) => setImageUrl(e.target.value)}
                    fullWidth
                    variant="outlined"
                />
            </ui.Grid>
            <ui.Grid item xs={12}>
                <ui.TextField
                    required
                    value={description}
                    label="Recipe Description"
                    multiline
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    variant="outlined"
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