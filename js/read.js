function printExif(dataURL) {
    var originalImg = new Image();
    originalImg.src = dataURL;
    var exif = piexif.load(dataURL);
    var ifds = [ "GPS"];
    var s = ""
    for (var i=0; i<1; i++)
    {
        var ifd = ifds[i];
        var ifd_i = "";
        for (var tag in exif[ifd]) {
            var str;
            if (exif[ifd][tag] instanceof Array) {
                str = JSON.stringify(exif[ifd][tag]);
            } else {
                str = escape(exif[ifd][tag]);
            }
            ifd_i += ("<tr><td class='te'>" + piexif.TAGS[ifd][tag]["name"] +
                      "</td><td class='te'><div class='divtd'>" +
                      str + "</div></td></tr>");
        }
        s += ("<table class='t'><tr><th colspan='2' class='th'>" +
              ifd + "</th></tr>" + ifd_i + "</table>");
    }
    if (exif["thumbnail"]) {
        var thumbStr = "data:image/jpeg;base64," + btoa(exif["thumbnail"]);
        var img = "<img src='{img}'></img>".replace("{img}", thumbStr);
        s += ("<table class='t'><tr><th class='th'>thumbnail</th></tr><tr><td>" +
              img + "</td></tr></table><br>");
    }
    var newDiv = $("<div class='z'></div>").html(s).hide();
    $("#output").prepend(newDiv);
    originalImg.onload = function () {
        var w = originalImg.width;
        var h = originalImg.height;
        var size = $("<div></div>").text("Original size:" + w + "*" + h);
        var im = $(originalImg).addClass("originalImage");
        newDiv.prepend(im);
        newDiv.prepend(size);
    }
    newDiv.slideDown(2000);
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
