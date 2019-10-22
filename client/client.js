const backendFileUploadServer = 'http://localhost:5100/uploadImage';
const dataSubmitButton = document.getElementById('submit-button');

var src = "";
var loadFile = event => {
    var image = document.getElementById('display');
    src = URL.createObjectURL(event.target.files[0]);
    image.setAttribute('src', src);
};

document.onload = event => {
    event.preventDefault();
    clearPrevMessage();
};

dataSubmitButton.addEventListener('click', event => {
    event.preventDefault();
    clearPrevMessage();

    var imgName = document.getElementById('imageName').nodeValue.toString().trim();
    var imgDescription = document.getElementById('imageDescr').nodeValue.toString().trim();
    var imgResolution = document.getElementById('resolution').nodeValue.toString().trim();
    var imgWidth = document.getElementById('width').nodeValue.toString().trim();
    var imgHeight = document.getElementById('height').nodeValue.toString().trim();
    var imageByteData = someFunction(src);

    const postObject = {
        name: imgName,
        description: imgDescription,
        resolution: imgResolution,
        width: imgWidth,
        height: imgHeight,
        imgByteData: imageByteData
    }

    sendDataToServer(postObject);
});

async function clearValues(message) {
    await document.getElementById('display').clear();
    await document.getElementById('fileUpload').clear();
    await awaitdocument.getElementById('imageName').clear();
    await document.getElementById('imageDescr').clear();
    await document.getElementById('resolution').clear();
    await document.getElementById('width').clear();
    await document.getElementById('height').clear();
    displayMessage(message);
};

function displayMessage(message) {
    var divTag = document.getElementById('message');
    var hTag = document.createElement('h3');
    hTag.setAttribute('id', 'dynamicMessage');
    hTag.textContent = message;
    divTag.appendChild(hTag);
};

function clearPrevMessage() {
    if (document.getElementById('dynamicMessage') != null || document.getElementById('dynamicMessage') != undefined) {
        document.getElementById('dynamicMessage').remove();
    }
}

async function sendDataToServer(sendObject) {
    let response = await fetch(backendFileUploadServer, {
        method: 'POST',
        body: JSON.stringify(sendObject),
        header: {
            "content-type": "application/JSON"
        }
    });

    let jsonResp = await response.json();

    let responseMessage = jsonResp.respMessage.toString().trim();

    if (pingback.includes('error')) {
        message = "Error while uploading the image.";
    } else {
        message = "Image uploaded.";
    }

    clearValues(message);
};