 var markers = [];
    var uniqueId = 1;
      function initMap() {
        //Map options
        var options = {
          zoom:18,
          mapTypeId : google.maps.MapTypeId.ROADMAP
        }
        //New map
        var map = new google.maps.Map(document.getElementById('map'), options);
        var latitude = Number(document.getElementById("latitude").innerHTML);
        var longitude = Number(document.getElementById("longitude").innerHTML);
        //StreetView options
        var streetOption ={
          position: {lat: latitude,lng:longitude},
        }
        //New streetView
        var streetview = new google.maps.StreetViewPanorama(document.getElementById('streetview'), streetOption);
        map.setStreetView(streetview);
        map.bindTo("center", streetview, "position");

        var streetViewLayer = new google.maps.ImageMapType({
          getTileUrl : function(coord, zoom) {
            return "http://www.google.com/cbk?output=overlay&zoom=" + zoom + "&x=" + coord.x + "&y=" + coord.y + "&cb_client=api";
          },
        tileSize: new google.maps.Size(256, 256)
        });

        map.overlayMapTypes.insertAt(0, streetViewLayer);
        //Listen for click on map
        google.maps.event.addListener(map, 'dblclick',
        function(event){
          DeleteMarker();
          var location = event.latLng;
          console.log(event.latLng);
          document.getElementById("latitude").innerHTML = location.lat();
          document.getElementById("longitude").innerHTML= location.lng();
          //Add marker
          var marker = new google.maps.Marker({
              position: location,
              map: map,
              draggable: true
          });


          google.maps.event.addListener(marker, "click", function (e) {

              var content = "<input type = 'button' value = 'Delete' onclick = 'DeleteMarker();' value = 'Delete' />";
              document.getElementById("latitude").innerHTML = location.lat();
              document.getElementById("longitude").innerHTML= location.lng();
              var infoWindow = new google.maps.InfoWindow({
                  content: content
              });
              infoWindow.open(map, marker);
          });
          markers.push(marker);
          //Set unique id
          marker.id = uniqueId;
          uniqueId++;
        });

      }
      function DeleteMarker() {
          //Find and remove the marker from the Array
          for (var i = 0; i < markers.length; i++) {
            //  if (markers[i].id == id) {
                  //Remove the marker from Map
                  markers[i].setMap(null);

                  //Remove the marker from array.
                  markers.splice(i, 1);
                  return;
            //  }
          }
      };
