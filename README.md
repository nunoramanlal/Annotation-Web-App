# Geospatial Annotation of (old) Photos

This web application geolocates a uploaded .jpeg file and displays the inferred coordinates on a map.

Once the .jpeg file is uploaded it checks if it has Exif data assigned to it. If yes, the application retrieves the latitude and longitude and displays the location on the map based on retrieved fields.
If there isn't any Exif data, the applications invoke the Google 'Cloud Vision API' to get the longitude and latitude and does the same previous procedure.

If one wants to change the geographic coordinates of an uploaded .jpeg file, it can be done by positioning the street view location in the desired location. Once the image is saved, the coordinates are assigned to the EXIF data of the .jpeg file. The point of view can also be set to be saved with the coordinates.

<ul>
<li><b> File uploaded must be a .jpeg </b></li>
</ul>
