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
        var width = image.naturalWidth; // this will be 300
        var height = image.naturalHeight;
        image.onload = function() {
            var canvas = document.getElementById("canvas");
            var ctx = canvas.getContext("2d");
            ctx.drawImage(image, 120,50, 400, 400);
        };
    };
    reader.readAsDataURL(f);
}
