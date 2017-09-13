# Annotation-Web-App

This web application geolocates an uploaded .jpeg file and displays the inferred coordinates on a map. 

Once the .jpeg file is uploaded it checks if it has Exif data assigned to it. If yes, the application retrieves the latitude and longitude and displays the location on the map based on retrieved fields.
If there isn't any Exif data, the applications invoke the Google 'Cloud Vision Api' to get the longitude and latitude and does the same previous procedure. 

If one wants to change the geographic coordinates of an uploaded .jpeg file, it can be done by adding a marker on the map over the place. Once the image is saved, the coordinates of where the marker is set are assigned to the exif data of the .jpeg file.

<ul>
<li><b> File uploadded must be a .jpeg </b></li>
</ul>

