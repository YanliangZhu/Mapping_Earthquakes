let streets = L.tileLayer(
    'https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      accessToken: API_KEY
});
  
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});
  
let lighter = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});
  
let tectonicJSON = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";
  
let baseMaps = {
    Streets: streets,
    Satellite: satelliteStreets,
    Light: lighter
};
  
let earthquakes = new L.layerGroup();
  
let tectonic = new L.layerGroup();
  
let overlays = {
    'Tectonic Plates': tectonic,
    Earthquakes: earthquakes
};
  
let map = L.map('mapid', {
    center: [39.5, -98.5],
    zoom: 3, f
    layers: [streets]
});
  
let myStyle2 = {
      color: "#fc1303",
      weight: 2
}
  
let myStyle = {
    color: "#0221cf",
    weight: 1,
    fillColor: "#adaa63",
    fillOpacity: 0.8
};

L.control.layers(baseMaps, overlays).addTo(map);
  
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {
    L.geoJson(data, {
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
      },
      style: styleInfo,
      onEachFeature: function(feature, layer) {
        layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
      }
    }).addTo(earthquakes);
    earthquakes.addTo(map);
    let legend = L.control({
      position: 'bottomright'
    });
    legend.onAdd = function() {
      let div = L.DomUtil.create('div', 'info legend');
      const magnitudes = [0, 1, 2, 3, 4, 5];
      const colors = [
        "#98ee00",
        "#d4ee00",
        "#eecc00",
        "#ee9c00",
        "#ea822c",
        "#ea2c2c"
      ];
      for (var i = 0; i < magnitudes.length; i++) {
        div.innerHTML +=
          "<i style='background: " + colors[i] + "'></i> " +
          magnitudes[i] + (magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+");
      }
      return div;
    };
  
    legend.addTo(map);
    function styleInfo(feature) {
      return {
        opacity: 1,
        fillOpacity: 1,
        fillColor: getColor(feature.properties.mag),
        color: "#000000",
        radius: getRadius(feature.properties.mag),
        stroke: true,
        weight: 0.5
      };
    }

    function getColor(magnitude) {
      if (magnitude > 5) {
        return "#ea2c2c";
      }
      if (magnitude > 4) {
        return "#ea822c";
      }
      if (magnitude > 3) {
        return "#ee9c00";
      }
      if (magnitude > 2) {
        return "#eecc00";
      }
      if (magnitude > 1) {
        return "#d4ee00";
      }
      return "#98ee00";
    }

    function getRadius(magnitude) {
      if (magnitude === 0) {
        return 1;
      }
      return magnitude * 4;
    }
});
  
d3.json(tectonicJSON).then(function(data) {
    L.geoJson(data, {
      style: myStyle2,
      onEachFeature: function (feature, layer){
        layer.bindPopup("<h3> Tectonic Plate: " + feature.properties.Name + "</h3>");
      }
    }).addTo(tectonic);
    tectonic.addTo(map)
});