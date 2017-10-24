function handleFileSelect(evt) {
    var latitude;
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
            ctx.drawImage(image, 0, 0, 300, 300);
        };
        latitude = 5;
        if (containsExif(dataUrl) === 1) {
            var latitude = getExifLatitude(dataUrl);
            var longitude = getExifLongitude(dataUrl);
            var pov = getExifPov(dataUrl);
            document.getElementById("latitude").innerHTML = latitude;
            document.getElementById("longitude").innerHTML = longitude;
            initMap(latitude, longitude, pov);
        } else {
            var base = dataUrl.replace("data:image/jpeg;base64,", "");
            (upload(createRequestAsJSON(base)));
        }
    };
    reader.readAsDataURL(f);
}

function save() {
    var gpsIfd = {};
    var lat = Number(document.getElementById("latitude").innerHTML);
    var lng = Number(document.getElementById("longitude").innerHTML);
    var pov = Number(document.getElementById("heading-cell").innerHTML);
    console.log(pov);
    gpsIfd[piexif.GPSIFD.GPSVersionID] = [7, 7, 7, 7];
    gpsIfd[piexif.GPSIFD.GPSDateStamp] = "1999:99:99 99:99:99";
    gpsIfd[piexif.GPSIFD.GPSImgDirectionRef] = 'T';
    gpsIfd[piexif.GPSIFD.GPSImgDirection] = piexif.GPSHelper.degToDmsRational(pov);
    gpsIfd[piexif.GPSIFD.GPSLatitudeRef] = lat < 0 ? 'S' : 'N';
    gpsIfd[piexif.GPSIFD.GPSLatitude] = piexif.GPSHelper.degToDmsRational(lat);
    gpsIfd[piexif.GPSIFD.GPSLongitudeRef] = lng < 0 ? 'W' : 'E';
    gpsIfd[piexif.GPSIFD.GPSLongitude] = piexif.GPSHelper.degToDmsRational(lng);
    var exifObj = {
        "GPS": gpsIfd
    };
    // get exif binary as "string" type
    var exifBytes = piexif.dump(exifObj);
    // get JPEG image from canvas
    var jpegData = document.getElementById("canvas").toDataURL("image/jpeg", 1.0);
    // insert exif binary into JPEG binary(DataURL)
    var exifModified = piexif.insert(exifBytes, jpegData);
    var blob = dataURLtoBlob(exifModified);
    savePic(blob);
};

function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {
        type: mime
    });
}

function savePic(blob) {
    saveAs(blob, "image" + ".jpg");
}

function containsExif(dataURL) {
    var exif = piexif.load(dataURL);
    var ifd = "GPS"
    var ifd_i = "";
    var s = "";
    if (JSON.stringify(exif[ifd]).length === 2) {
        return 0;
    }
    return 1;
}

function getExifLatitude(dataURL) {
    var ref = getExifLatitudeRef(dataURL);
    var exif = piexif.load(dataURL);
    var ifd = "GPS"
    for (var tag in exif[ifd]) {
        var str = exif[ifd][tag];
        if (piexif.TAGS[ifd][tag]["name"] === "GPSLatitude") {
            return dmsToDegrees(str, ref);
        }
    }
}

function getExifLatitudeRef(dataURL) {
    var exif = piexif.load(dataURL);
    var ifd = "GPS"
    for (var tag in exif[ifd]) {
        var str = exif[ifd][tag];
        if (piexif.TAGS[ifd][tag]["name"] === "GPSLatitudeRef") {
            return str;
        }
    }
}

function getExifLongitude(dataURL) {
    var ref = getExifLongitudeRef(dataURL);
    var exif = piexif.load(dataURL);
    var ifd = "GPS"
    for (var tag in exif[ifd]) {
        var str = exif[ifd][tag];
        if (piexif.TAGS[ifd][tag]["name"] === "GPSLongitude") {
            return dmsToDegrees(str, ref);
        }
    }
}

function getExifLongitudeRef(dataURL) {
    var exif = piexif.load(dataURL);
    var ifd = "GPS"
    for (var tag in exif[ifd]) {
        var str = exif[ifd][tag];
        if (piexif.TAGS[ifd][tag]["name"] === "GPSLongitudeRef") {
            return str;
        }
    }
}

function getExifPov(dataURL){
  var exif = piexif.load(dataURL);
  var ifd = "GPS"
  for (var tag in exif[ifd]) {
      var str = exif[ifd][tag];
      if (piexif.TAGS[ifd][tag]["name"] === "GPSImgDirection") {
          return dmsToDegrees(str, 'N');
      }
  }
}

function dmsToDegrees(dms, ref) {
    var d = dms[0][0] / dms[0][1];
    var m = (dms[1][0] / dms[1][1]) / 60;
    var s = (dms[2][0] / dms[2][1]) / 3600;
    if (ref === 'N' || ref === 'E')
        return Number(d + m + s);
    else {
        return Number(d + m + s) * -1
    }
}

function createRequestAsJSON(str) {
    var a = {
        "requests": [{
            "image": {
                "content": String(str)
            },
            "features": [{
                "type": "LANDMARK_DETECTION"
            }]
        }]

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
        success: function(data) {
            output = data;
            var faceData = data.responses[0];
            parseResponse((faceData));
        },
        error: function(data, textStatus, errorThrown) {

        }
    })
}

function parseResponse(faceData) {
    var latitude;
    var longitude;

    if (containsCoords(faceData) !== -1) {
        latitude = (faceData.landmarkAnnotations[0].locations[0].latLng.latitude);
        longitude = (faceData.landmarkAnnotations[0].locations[0].latLng.longitude);
    } else {
        latitude = 37.773972;
        longitude = -122.431297;
        alert("No coordinates found. Default coordinates displayed");
    }
    document.getElementById("latitude").innerHTML = latitude;
    document.getElementById("longitude").innerHTML = longitude;
    initMap(latitude, longitude, 90);
}

function containsCoords(faceData) {
    return JSON.stringify(faceData).indexOf("latitude");
}

var markers = [];
var uniqueId = 1;

function initMap(lat, long, pov) {
    //Map options
    var options = {
        zoom: 18,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    //New map
    var map = new google.maps.Map(document.getElementById('map'), options);
    var latitude = lat;
    var longitude = long;
    var pointOfView = pov;

    //StreetView options
    var streetOption = {
        position: {
            lat: latitude,
            lng: longitude
        },
        pov: {
            heading: pointOfView,
            pitch: 0
        },
        visible: true
    }
    //New streetView
    var streetview = new google.maps.StreetViewPanorama(document.getElementById('streetview'), streetOption);
    map.setStreetView(streetview);
    map.bindTo("center", streetview, "position");

    var streetViewLayer = new google.maps.ImageMapType({
        getTileUrl: function(coord, zoom) {
            return "http://www.google.com/cbk?output=overlay&zoom=" + zoom + "&x=" + coord.x + "&y=" + coord.y + "&cb_client=api";
        },
        tileSize: new google.maps.Size(256, 256)
    });
    map.overlayMapTypes.insertAt(0, streetViewLayer);

    streetview.addListener('pov_changed', function() {
      document.getElementById("latitude").innerHTML = streetview.getPosition().lat();
      document.getElementById("longitude").innerHTML = streetview.getPosition().lng();
       });
     streetview.addListener('pov_changed', function() {
       document.getElementById('heading-cell').innerHTML = streetview.getPov().heading;
       document.getElementById('pitch-cell').innerHTML = streetview.getPov().pitch;
        });
    //Listen for click on map
    google.maps.event.addListener(map, 'click',
        function(event) {
            var location = event.latLng;
            document.getElementById("latitude").innerHTML = location.lat();
            document.getElementById("longitude").innerHTML = location.lng();
        });

        streetViewLayer.addListener('pov_changed', function() {
          document.getElementById('heading-cell').innerHTML = streetViewLayer.getPov().heading;
          document.getElementById('pitch-cell').innerHTML = streetViewLayer.getPov().pitch;
           });

}

function DeleteMarker() {
    //Find and remove the marker from the Array
    for (var i = 0; i < markers.length; i++) {
        //Remove the marker from Map
        markers[i].setMap(null);
        //Remove the marker from array.
        markers.splice(i, 1);
        return;
    }
}
