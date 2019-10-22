const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
var dotenv = require('dotenv');
const monk = require('monk');

dotenv.config();
const app = express();

//Morgan is used for logging
app.use(morgan('tiny'));

//Cors allows cross origin requests
app.use(cors());

//Body parser parses the data received from client
app.use(bodyParser.json());

// Connection URL - put env variable
const url = '';

app.get('/', (req, res) => {
    res.json({
        message: 'backend and frontend connected'
    })
});

app.post('/uploadImage', (req, res) => {
    var imgName = req.body.name;
    var imgDescription = req.body.description;
    var imgResolution = req.body.resolution;
    var imgWidth = req.body.width;
    var imgHeight = req.body.height;
    var imageByteData = req.body.imgByteData;

    var dataObject = {
        name: imgName,
        description: imgDescription,
        resolution: imgResolution,
        width: imgWidth,
        height: imgHeight,
        imgByteData: imageByteData
    };

    if (pushDataToDB(url, dataObject)) {
        res.status(200);
        res.end(JSON.stringify({
            respMessage: "posted",
        }));
    } else {
        res.status(400);
        res.end(JSON.stringify({
            respMessage: "error",
        }));
    }

});

async function pushDataToDB(mongoURL, dataObject) {
    try {
        const db = await monk(url);

        const imageDataCollection = await db.get('imageData');

        await imageDataCollection.insert(dataObject);

        await db.close();

        return true;

    } catch (err) {
        await db.close();
        console.log(err);
        return false;
    }
}