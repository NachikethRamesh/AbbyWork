const backendFileUploadServer = 'http://localhost:5004/uploadImage';
const dataSubmitButton = document.getElementById('submit-button');

var loadFile = event => {
    var img = document.getElementById('display');
    src = URL.createObjectURL(event.target.files[0]);
    img.setAttribute('src', src);
    toDataURL(src, async function (dataURL) {
        img.setAttribute('src', dataURL);
    });
};

async function toDataURL(src, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onload = async function () {
        var fileReader = new FileReader();
        fileReader.onloadend = async function () {
            await callback(fileReader.result);
        };
        fileReader.readAsDataURL(xhttp.response);
    };

    xhttp.responseType = 'blob';
    xhttp.open('GET', src, true);
    xhttp.send();
};

window.onload = async function (event) {
    event.preventDefault();
    document.getElementById('fileUpload').value = "";
    document.getElementById('imageName').value = "";
    document.getElementById('imageDescr').value = "";
    document.getElementById('resolution').value = "";
    document.getElementById('width').value = "";
    document.getElementById('height').value = "";
    var image = document.getElementById('display');
    image.setAttribute('src', "");
    clearPrevMessage();
};

dataSubmitButton.addEventListener('click', event => {
    event.preventDefault();
    clearPrevMessage();

    var imgName = document.getElementById('imageName').value.toString().trim();
    var imgDescription = document.getElementById('imageDescr').value.toString().trim();
    var imgResolution = document.getElementById('resolution').value.toString().trim();
    var imgWidth = document.getElementById('width').value.toString().trim();
    var imgHeight = document.getElementById('height').value.toString().trim();
    var imageByteData = document.getElementById('display').getAttribute('src')

    var postObject = {
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
    document.getElementById('fileUpload').value = "";
    document.getElementById('imageName').value = "";
    document.getElementById('imageDescr').value = "";
    document.getElementById('resolution').value = "";
    document.getElementById('width').value = "";
    document.getElementById('height').value = "";
    var image = document.getElementById('display');
    image.setAttribute('src', "");
    displayMessage(message);
};

function displayMessage(message) {
    var divTag = document.getElementById('message');
    var hTag = document.createElement('h3');
    hTag.setAttribute('id', 'dynamicMessage');
    hTag.textContent = message;
    divTag.appendChild(hTag);
};

async function clearPrevMessage() {
    if (document.getElementById('dynamicMessage') != null || document.getElementById('dynamicMessage') != undefined) {
        document.getElementById('dynamicMessage').remove();
    }
}

async function sendDataToServer(sendObject) {
    console.log(JSON.stringify(sendObject))
    let response = await fetch(backendFileUploadServer, {
        method: 'POST',
        body: JSON.stringify(sendObject),
        headers: {
            'content-type': 'application/JSON'
        }
    });

    let jsonResp = await response.json();

    console.log(jsonResp)

    let responseMessage = jsonResp.respMessage.toString().trim();

    if (responseMessage.includes('error')) {
        message = "Error while uploading the image.";
    } else {
        message = "Image uploaded.";
    }

    clearValues(message);
};