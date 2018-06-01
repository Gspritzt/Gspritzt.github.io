/*
    Testmap Gletscher Tirol
    -------------------------------------------------------------------

*/

//  Leaflet Map with fullscreen
let myMap = L.map("map", {
    fullscreenControl: true,
    zoom: 9,
    center: new L.LatLng(47.267,11.383),  // like -> myMap.setView([47.267,11.383], 10);
  });

let Glacierpts = L.markerClusterGroup();
let Glacierpolygon = L.featureGroup();
let Glacierpts_SI = L.markerClusterGroup();
let Glacierpolygon_SI = L.featureGroup();

//make selectable maps and overlays
let myLayers = {
  osm : L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      subdomains : ["a", "b", "c"],
      attribution : "Datenquelle: <a href = 'https://www.openstreetmap.org/' > © OpenStreetMap</a> Mitwirkende"
    }
  ),
  otp : L.tileLayer(
    "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
      subdomains : ["a", "b", "c"],
      attribution : "Datenquelle: <a href = 'https://www.openstreetmap.org/' > © OpenStreetMap</a> Mitwirkende, SRTM | Kartendarstellung: <a href = 'https://opentopomap.org/' > © OpenTopoMap</a> (<a href = 'https://creativecommons.org/licenses/by-sa/3.0/' > CC-BY-SA</a>)"
    }
  ),
  geolandbasemap : L.tileLayer(
    "https://{s}.wien.gv.at/basemap/geolandbasemap/normal/google3857/{z}/{y}/{x}.png", {
      subdomains : ["maps", "maps1", "maps2", "maps3", "maps4"],                                // http://leafletjs.com/reference-1.3.0.html#tilelayer-subdomains
      attribution : "Datenquelle: <a href ='https://basemap.at'> basemap.at </a>",               // http://leafletjs.com/reference-1.3.0.html#layer-attribution
      transparent: true,
      format: 'image/png',
    }
  ),
  gdi_ortho : L.tileLayer(
    "http://wmts.kartetirol.at/wmts/gdi_ortho/GoogleMapsCompatible/{z}/{x}/{y}.jpeg80", {
      attribution : "Datenquelle: <a href ='https://www.tirol.gv.at/data/nutzungsbedingungen/'> Land Tirol - data.tirol.gv.at </a>",
      transparent: true,
      format: 'image/png',
    }
  ),
  gdi_nomenklatur: L.tileLayer(
    "http://wmts.kartetirol.at/wmts/gdi_nomenklatur/GoogleMapsCompatible/{z}/{x}/{y}.png8", {
      attribution : "Datenquelle: <a href ='https://www.tirol.gv.at/data/nutzungsbedingungen/'> Land Tirol - data.tirol.gv.at </a>",
      pane: "overlayPane",
      transparent: true,
      format: 'image/png',
    }
  ),
  gletscherinv_suedtirol: L.tileLayer.wms(
    "http://geoservices.buergernetz.bz.it/geoserver/p_bz-hydrology/ows?", {
      layers: "GlacierInventory",
      attribution : "Datenquelle: <a href ='http://dati.retecivica.bz.it/de/info'> Autonome Provinz Bozen </a>  (<a href ='https://creativecommons.org/publicdomain/zero/1.0/deed.de'> CC0</a>)",
      transparent: true,
      format: 'image/png',
    }
  ),
  ortho_suedtirol: L.tileLayer.wms(
    "http://geoservices.buergernetz.bz.it/geoserver/ows?", {
      layers: "Orthophoto_2011",
      attribution : "Datenquelle: <a href ='http://dati.retecivica.bz.it/de/info'> Autonome Provinz Bozen </a>  (<a href ='https://creativecommons.org/licenses/by/4.0/deed.de'> CC-BY</a>)",
      transparent: true,
      format: 'image/png',
    }
  ),
};

const gdi_orthoGrp = L.layerGroup([myLayers.gdi_ortho, myLayers.gdi_nomenklatur, myLayers.ortho_suedtirol])
const suedtirol_orthoGrp = L.layerGroup([myLayers.ortho_suedtirol])

myMap.addLayer(myLayers.otp);

// Maßstab metrisch ohne inch
//Maßstabsleiste
let myScale = L.control.scale({
  position : "bottomleft",
  maxWidth : 200,
  imperial : false,
  metric : true
});

myScale.addTo(myMap);

//===================test(a)==============
const geojson = L.geoJSON(gi3_tirol_2006_points, {
  style: function(feature) {
    return {color: "#ff0000"};
  },
  pointToLayer: function(geoJsonPoint, latlng) {
    return L.marker(latlng, {icon: L.icon({
      iconUrl: 'icons/pinother.png',
      iconAnchor : [16,37],
      popupAnchor : [0,-37],
    })
    });
  }
}).addTo(Glacierpts);
Glacierpts.addLayer(geojson);
myMap.fitBounds(Glacierpts.getBounds());
Glacierpts.bindPopup(function(layer) {
  const props = layer.feature.properties;
  const Area = (props.Shape_Area/100000).toFixed(2)
  const popupText = `<h1>${props.GLETSCHERN}</h1>
  <p> <p> Fläche 2006:  ${Area} km²</p>`;
  return popupText;
});

let geojson2 = L.geoJSON(gi3_tirol_2006_polygon).addTo(Glacierpolygon)
let geojson2_layers = geojson2.getLayers();


let GlacierfeatureGroup =  L.layerGroup([Glacierpts,Glacierpolygon], {
  attribution : "Gletscherdaten: <a href ='https://doi.pangaea.de/10.1594/PANGAEA.806960'> Abermann et al. (2012) </a> (<a href ='https://creativecommons.org/licenses/by/3.0/'> CC BY 3.0 </a>)",
});

myMap.addLayer(Glacierpts);
myMap.addLayer(GlacierfeatureGroup);

//=================Suedtirol Test===========================================
/*
const geojson = L.geoJSON(gi_2006_st_points, { 
  style: function(feature) {
    return {color: "#ff0000"};
  },
  pointToLayer: function(geoJsonPoint, latlng) {
    return L.marker(latlng, {icon: L.icon({
      iconUrl: 'icons/pinother.png',
      iconAnchor : [16,37],
      popupAnchor : [0,-37],
    })
    });
  }
}).addTo(Glacierpts_SI);
Glacierpts_SI.addLayer(geojson);
myMap.fitBounds(Glacierpts_SI.getBounds());
Glacierpts_SI.bindPopup(function(layer) {
  const props = layer.feature.properties;
  const Area = (props.Shape_Area/100000).toFixed(2)
  const popupText = `<h1>${props.GLETSCHERN}</h1>
  <p> <p> Fläche 2006:  ${Area} km²</p>`;
  return popupText;
} 
);

let geojson3 = L.geoJSON(gi_2006_st_polygon).addTo(Glacierpolygon_SI)

let geojson3_layers = geojson3.getLayers();


let GlacierfeatureGroup_SI =  L.layerGroup([Glacierpts_SI,Glacierpolygon_SI], {
  attribution : "Gletscherdaten: <a href ='https://doi.pangaea.de/10.1594/PANGAEA.806960'> Abermann et al. (2012) </a> (<a href ='https://creativecommons.org/licenses/by/3.0/'> CC BY 3.0 </a>)",
});

myMap.addLayer(Glacierpts_SI);
myMap.addLayer(GlacierfeatureGroup_SI);
*/
//=======================================================================


const hash = new L.Hash(myMap);
myMap.addControl( new L.Control.Search({
  layer: Glacierpts,
  initial: false,
  propertyName: 'GLETSCHERN',    
}));

// Baselayer control
let myMapControl  = L.control.layers({
  "OpenStreetMap" : myLayers.osm,
  "OpenTopoMap" : myLayers.otp,
  "Geoland Basemap" : myLayers.geolandbasemap,
  //"Orthophoto Tiol & Südtirol" : gdi_orthoGrp,
  //"Autonome Brovinz Bozen Orthophoto" :suedtirol_orthoGrp,
}, {
  //overlay // Overlay controls zum unabhängigem Ein-/Ausschalten der Route und Marker hinzufügen
  "Gletscher Tirol Marker" : Glacierpts,
  "Gletscher Tirol Fläche" : Glacierpolygon,
  "Gletscher Südtirol Marker" : Glacierpts_SI,
  "Gletscher Südtirol Fläche" : Glacierpolygon_SI,
  "Orthophoto Tiol & Südtirol" : gdi_orthoGrp,
  "Gletscher Südtirol" : myLayers.gletscherinv_suedtirol,
}, { //map control ausgeklappt lassen
  collapsed:false} );

myMap.addControl(myMapControl);

//test logs.
/*
console.log(geojson.getLayers());
console.log(geojson_layers);
console.log(geojson_layers.length);
console.log(geojson.getLayerId(geojson._layers));

console.log(geojson._layers[50].feature.properties.GLETSCHERN);
*/
