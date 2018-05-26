/*
    Testmap Gletscher Tirol
    -------------------------------------------------------------------

*/

// eine neue Leaflet Karte definieren
let myMap = L.map("map", {
    fullscreenControl: true,});

let GlacierfeatureGroup = L.featureGroup();

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
      attribution : "Datenquelle: <a href = 'https://www.openstreetmap.org/' > © OpenStreetMap</a> Mitwirkende, SRTM | Kartendarstellung: © <a href = 'https://opentopomap.org/' > © OpenTopoMap</a> (<a href = 'https://creativecommons.org/licenses/by-sa/3.0/' > CC-BY-SA</a>)"
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


// Baselayer control
let myMapControl  = L.control.layers({
  "OpenStreetMap" : myLayers.osm,
  "OpenTopoMap" : myLayers.otp,
  "Geoland Basemap" : myLayers.geolandbasemap,
  //"Orthophoto Tiol & Südtirol" : gdi_orthoGrp,
  //"Autonome Brovinz Bozen Orthophoto" :suedtirol_orthoGrp,
}, {
  //overlay // Overlay controls zum unabhängigem Ein-/Ausschalten der Route und Marker hinzufügen
  "Orthophoto Tiol & Südtirol" : gdi_orthoGrp,
  "Gletscher Tirol" : GlacierfeatureGroup,
  "Gletscher Südtirol" : myLayers.gletscherinv_suedtirol,
}, { //map control ausgeklappt lassen
  collapsed:false} );

myMap.addControl(myMapControl);



let geojson = L.geoJSON(tirol_glacierinv).addTo(GlacierfeatureGroup);


//something's not right here o.=
console.log(geojson._layers[50].feature.properties.GLETSCHERN);


myMap.setView([47.267,11.383], 9);
