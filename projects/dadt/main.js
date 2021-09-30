var MAP = null;
var ZOOM_LEVEL = 13;
var PATHAO_HQ = [23.7936914, 90.4118172];
var userMarker = null;
var restaurantMarker = null;
var primaryCircle = null;
var secondaryCircle = null;
var customCircle = null;
var popup = null;


function bodyLoaded() {
    var drawButton = document.getElementById("draw-it");
    var resetButton = document.getElementById("reset");
    drawButton.addEventListener("click", drawIt);
    resetButton.addEventListener("click", resetAll);
    initMap();
    MAP.on('click', onMapClick);

}

function initMap() {
    MAP = L.map('map-canvas').setView(PATHAO_HQ, ZOOM_LEVEL);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(MAP);
    primaryCircle = new L.circle();
    secondaryCircle = new L.circle();
    customCircle = new L.circle();
    userMarker = L.marker();
    restaurantMarker = L.marker();
    popup = L.popup();

}

function drawIt() {
    resetMap();
    var userLat = document.getElementById("user-lat").value;
    var userLon = document.getElementById("user-lon").value;
    var userLocation = [userLat, userLon];
    if (userLat > 0 && userLon > 0) {
        var primaryRadius = document.getElementById("primary-radius").value;
        var secondaryRadius = document.getElementById("secondary-radius").value;

        MAP._resetView(userLocation, ZOOM_LEVEL);
        var userIcon = L.icon({
            iconUrl: 'user.png',
            iconSize: [32, 32]
        });
        userMarker = L.marker(userLocation, {
            icon: userIcon
        }).addTo(MAP).bindPopup("I'm the Eater");

        primaryCircle = L.circle(userLocation, {
            color: 'green',
            fillOpacity: 0,
            radius: primaryRadius
        }).addTo(MAP);

        secondaryCircle = L.circle(userLocation, {
            color: 'blue',
            fillOpacity: 0,
            radius: secondaryRadius
        }).addTo(MAP);
    }

    var restoLat = document.getElementById("resto-lat").value;
    var restoLon = document.getElementById("resto-lon").value;
    if (restoLat > 0 && restoLon > 0) {
        var customRadius = document.getElementById("custom-radius").value;
        var restaurantIcon = L.icon({
            iconUrl: 'restaurant.png',
            iconSize: [32, 32]
        });
        restaurantMarker = L.marker([restoLat, restoLon], {
            icon: restaurantIcon
        }).addTo(MAP).bindPopup("I'm the Chef");

        if (customRadius > 0) {
            customCircle = L.circle([restoLat, restoLon], {
                color: 'orange',
                fillOpacity: 0,
                radius: customRadius
            }).addTo(MAP)
        }
    }

    var polygonString = document.getElementById("polygon").value;
    if (polygonString.length > 0) {
        var lines = polygonString.split(/\r?\n/);
        var coordinatesList = []
        for (const line of lines) {
            coordinates = line.split(',')
            coordinatesList.push([parseFloat(coordinates[0].trim()), parseFloat(coordinates[1].trim())])
        }
        polygon = [coordinatesList]
        L.polygon(polygon, {
            fillOpacity: 0
        }).addTo(MAP);
    }

}

function resetMap() {
    MAP.eachLayer(function(layer) {
        if (layer._path != null) {
            layer.remove()
        }
    });
    MAP.removeLayer(userMarker)
    MAP.removeLayer(restaurantMarker);
    MAP._resetView(PATHAO_HQ, ZOOM_LEVEL);
}

function resetAll() {
    resetMap();
    document.getElementById("resto-lat").value = "";
    document.getElementById("resto-lon").value = "";
    document.getElementById("user-lat").value = "";
    document.getElementById("user-lon").value = "";
    document.getElementById("custom-radius").value = "";
    document.getElementById("polygon").value = "";
}

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent(e.latlng.lat + ", " + e.latlng.lng)
        .openOn(MAP);
}