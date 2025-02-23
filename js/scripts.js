// Map 2

var map2, geojson2;

// Define the info control for map2
var info2 = L.control();

info2.onAdd = function (map2) {
    this._div = L.DomUtil.create('div', 'info'); // Create a div with a class "info"
    this.update();
    return this._div;
};

// Method to update the control based on feature properties passed
info2.update = function (props) {
    this._div.innerHTML = '<h4>US Annual Emissions</h4>' + (props ?
        '<b>' + props.name + '</b><br />' + props['Variable observation value'] + ' Metric tons of CO<sub>2</sub>' :
        'Hover over a state');
};

// Function to highlight features on mouseover
function highlightFeature2(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.1
    });

    layer.bringToFront();

    // Update the info control for map2
    info2.update(layer.feature.properties);
}

// Function to reset the highlight on mouseout
function resetHighlight2(e) {
    geojson2.resetStyle(e.target);
    info2.update(); // Reset the info control for map2
}

// Function to zoom to a feature on click
function zoomToFeature2(e) {
    map2.fitBounds(e.target.getBounds());
}

// Function to handle each feature
function onEachFeature2(feature, layer) {
    layer.on({
        mouseover: highlightFeature2,
        mouseout: resetHighlight2,
        click: zoomToFeature2
    });
}

// Function to create map2
function createMap2() {
    map2 = L.map('map2', {
        center: [39.83, -98.58],
        zoom: 4
    });

    function style(feature) {
        return {
            fillColor: null,
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0
        };
    }

    // Add OSM base tile layer
    L.tileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(map2);

    // Add GeoJSON layer to map2 with styling and event handlers
    fetch("data/state_emissions.json")
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            // Use the JSON data to create the geojson2 layer
            geojson2 = L.geoJson(json, { 
                style: style,
                onEachFeature: onEachFeature2
            }).addTo(map2);

            // Add info control to map2
            info2.addTo(map2);
        })
        .catch(function (error) {
            console.error("Error loading the data: ", error);
        });
}

// Initialize the map when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    createMap2();
});
