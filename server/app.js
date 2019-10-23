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
const url = 'mongodb+srv://AbbyWork:Abbytao123@pagecluster-v39xp.mongodb.net/AbbyWork?retryWrites=true&w=majority';

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

    const db = monk(url);

    db.then(() => {
            const imageDataCollection = db.get('imageData');
            imageDataCollection.insert(dataObject)
                .then(() => {
                    db.close();
                    res.status(200);
                    res.end(JSON.stringify({
                        respMessage: "posted",
                    }));
                })
                .catch(() => {
                    db.close();
                    res.status(400);
                    res.end(JSON.stringify({
                        respMessage: "error",
                    }));
                });
        })
        .catch(() => {
            res.status(400);
            res.end(JSON.stringify({
                respMessage: "error",
            }));
        });
});

const port = 5004;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});