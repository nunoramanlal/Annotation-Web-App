function printExif(dataURL) {
    var exif = piexif.load(dataURL);
    var ifd = "GPS"
    if(JSON.stringify(exif[ifd]).length===2){
      document.getElementById('latitude').innerHTML = 0;
      document.getElementById('longitude').innerHTML = 0;
    }
    else{
      for (var tag in exif[ifd]) {
        var str=exif[ifd][tag];
        if(piexif.TAGS[ifd][tag]["name"]==="GPSLatitude"){
          document.getElementById('latitude').innerHTML = dmsToDegrees(str);
        }
        if(piexif.TAGS[ifd][tag]["name"]==="GPSLongitude"){
          document.getElementById('longitude').innerHTML = dmsToDegrees(str);
        }
      }
    }
}

function dmsToDegrees(dms){
  var d = dms[0][0]/dms[0][1];
  var m = (dms[1][0]/dms[1][1])/60;
  var s = (dms[2][0]/dms[2][1])/3600;
  console.log(d+m+s);
  return d+m+s;
}

function handleFileSelect(evt) {
    var file = evt.target.files[0];
    var reader = new FileReader();
    reader.onloadend = function(e){
        printExif(e.target.result);
    };
    reader.readAsDataURL(file);
}

document.getElementById('f').addEventListener('change', handleFileSelect, false);
