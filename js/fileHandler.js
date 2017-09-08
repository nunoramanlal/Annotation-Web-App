if (typeof window.navigator.msSaveBlob === "undefined") {
    var saveJpeg = null;
} else {
    $("#up").append("IE 10 and 11, left-click on image to save.<br>");
    var n = 0;
    var saveJpeg = function (blob) {
        return function () {
            window.navigator.msSaveBlob(blob, "PiexifjsDemo" + (n++) + ".jpg");
        };
    };
}
function handleFileSelect(evt) {
    var f = evt.target.files[0]; // FileList object
    var reader = new FileReader();
    reader.onloadend = function(e) {
        var image = new Image();
        image.src = e.target.result;
        var dataUrl = e.target.result;
        var width = image.naturalWidth; // this will be 300
        var height = image.naturalHeight;
        image.onload = function() {
            var canvas = document.getElementById("canvas");
            var ctx = canvas.getContext("2d");
            ctx.drawImage(image, 120,50, 400, 400);
        };
        if(containsExif(dataUrl)===1){
            document.getElementById("latitude").innerHTML = (getExifLatitude(dataUrl));
            document.getElementById("longitude").innerHTML = (getExifLongitude(dataUrl));
        }
        else{
          var base = dataUrl.replace("data:image/jpeg;base64,", "");
          (upload(createRequestAsJSON(base)));
        }
    };

    reader.readAsDataURL(f);
}

function containsExif(dataURL){
  var exif = piexif.load(dataURL);
  var ifd = "GPS"
  var ifd_i = "";
  var s = "";
  if(JSON.stringify(exif[ifd]).length===2){
    return 0;
  }
  return 1;
}

function getExifLatitude(dataURL){
  var exif = piexif.load(dataURL);
  var ifd = "GPS"
  for (var tag in exif[ifd]) {
    var str=exif[ifd][tag];
    if(piexif.TAGS[ifd][tag]["name"]==="GPSLatitude"){
      return dmsToDegrees(str);
    }
  }
}

function getExifLongitude(dataURL) {
  var exif = piexif.load(dataURL);
  var ifd = "GPS"
  for (var tag in exif[ifd]) {
    var str=exif[ifd][tag];
    if(piexif.TAGS[ifd][tag]["name"]==="GPSLongitude"){
      return dmsToDegrees(str);
    }
  }
}

function dmsToDegrees(dms){
  var d = dms[0][0]/dms[0][1];
  var m = (dms[1][0]/dms[1][1])/60;
  var s = (dms[2][0]/dms[2][1])/3600;
  return d+m+s;
}

function createRequestAsJSON(str){
  var a = {
    "requests": [
    {
      "image": {
        "content": String(str)
      },
      "features": [
        {
          "type": "LANDMARK_DETECTION"
        }
      ]
    }
  ]

  }
  return a;
}

function upload(request) {

      $.ajax({
        method: 'POST',
        url: 'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyBcuLZurSQM6euHylZ4Yh-TQYcdSpgEWm8',
        contentType: 'application/json',
        data: JSON.stringify(request),
        processData: false,
        success: function(data){
          output = data;
          var faceData = data.responses[0];
          parseResponse((faceData));
        },
        error: function (data, textStatus, errorThrown) {
          
        }
      })
}

function parseResponse(faceData){
    document.getElementById("latitude").innerHTML = (faceData.landmarkAnnotations[0].locations[0].latLng.latitude);
    document.getElementById("longitude").innerHTML = (faceData.landmarkAnnotations[0].locations[0].latLng.longitude);
}
