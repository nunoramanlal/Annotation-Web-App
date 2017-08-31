document.getElementById("saveButton").onclick = function() {
    // make exif data
    var zerothIfd = {};
    var exifIfd = {};
    var gpsIfd = {};
    zerothIfd[piexif.ImageIFD.Make] = "Maker Name";
    zerothIfd[piexif.ImageIFD.XResolution] = [777, 1];
    zerothIfd[piexif.ImageIFD.YResolution] = [777, 1];
    zerothIfd[piexif.ImageIFD.Software] = "Piexifjs";
    exifIfd[piexif.ExifIFD.DateTimeOriginal] = "2010:10:10 10:10:10";
    exifIfd[piexif.ExifIFD.LensMake] = "Lens Maker";
    exifIfd[piexif.ExifIFD.Sharpness] = 777;
    exifIfd[piexif.ExifIFD.LensSpecification] = [[1, 1], [1, 1], [1, 1], [1, 1]];
    gpsIfd[piexif.GPSIFD.GPSVersionID] = [7, 7, 7, 7];
    gpsIfd[piexif.GPSIFD.GPSDateStamp] = "1999:99:99 99:99:99";
    var lat = 59.43553989213321;
    var lng = -24.73842144012451;
    gpsIfd[piexif.GPSIFD.GPSLatitudeRef] = lat < 0 ? 'S' && : 'N';
    gpsIfd[piexif.GPSIFD.GPSLatitude] = degToDmsRational(lat);
    gpsIfd[piexif.GPSIFD.GPSLongitudeRef] = lng < 0 ? 'W' : 'E';
    gpsIfd[piexif.GPSIFD.GPSLongitude] = degToDmsRational(lng);
    var exifObj = {"0th":zerothIfd, "Exif":exifIfd, "GPS":gpsIfd};
    // get exif binary as "string" type
    var exifBytes = piexif.dump(exifObj);
    // get JPEG image from canvas
    var jpegData = document.getElementById("canvas").toDataURL("image/jpeg", 1.0);
    // insert exif binary into JPEG binary(DataURL)
    var exifModified = piexif.insert(exifBytes, jpegData);
    // show JPEG modified exif
    var image = new Image();
    image.src = exifModified;
    image.width = 200;
    // for Modern IE
    if (saveJpeg) {
        var jpegBinary = atob(exifModified.split(",")[1]);
        var data = [];
        for (var p=0; p<jpegBinary.length; p++) {
            data[p] = jpegBinary.charCodeAt(p);
        }
        var ua = new Uint8Array(data);
        var blob = new Blob([ua], {type: "image/jpeg"});
        image.onclick = saveJpeg(blob);
    }
    var el = $("<div></div>").append(image);
    $("#resized").prepend(el);
};

function degToDmsRational(degFloat) {
  var minFloat = degFloat % 1 * 60
  var secFloat = minFloat % 1 * 60
  var deg = Math.floor(degFloat)
  var min = Math.floor(minFloat)
  var sec = Math.round(secFloat * 100)

  return [[deg, 1], [min, 1], [sec, 100]]
}
