/*
    Übersichtskarte Gletscher Tirol
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
let Glacierpts_st = L.markerClusterGroup();
let Glacierpolygon_st = L.featureGroup();


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
  gdi_ortho : L.tileLayer.wms(
    "https://gis.tirol.gv.at/arcgis/services/Service_Public/orthofoto/MapServer/WMSServer?", {
      layers: "Image_Aktuell_RGB",
      attribution : "Datenquelle: <a href ='https://www.tirol.gv.at/data/nutzungsbedingungen/'> Land Tirol - data.tirol.gv.at </a>",
      transparent: true,
      format: 'image/png',
      pane: "overlayPane",
    }
  ),
  /*gdi_ortho : L.tileLayer(
    "http://wmts.kartetirol.at/wmts/gdi_ortho/GoogleMapsCompatible/{z}/{x}/{y}.jpeg80", {
      attribution : "Datenquelle: <a href ='https://www.tirol.gv.at/data/nutzungsbedingungen/'> Land Tirol - data.tirol.gv.at </a>",
      transparent: true,
      format: 'image/png',
    }
  ),*/
  gdi_nomenklatur: L.tileLayer(
    "http://wmts.kartetirol.at/wmts/gdi_nomenklatur/GoogleMapsCompatible/{z}/{x}/{y}.png8", {
      attribution : "Datenquelle: <a href ='https://www.tirol.gv.at/data/nutzungsbedingungen/'> Land Tirol - data.tirol.gv.at </a>",
      pane: "overlayPane",
      transparent: true,
      format: 'image/png',
    }
  ),
  ortho_suedtirol: L.tileLayer.wms(
    "http://geoservices.buergernetz.bz.it/geoserver/ows?", {
      layers: "P_BZ_OF_2014_2015", /*Orthophoto_2011 */
      attribution : "Datenquelle: <a href ='http://dati.retecivica.bz.it/de/info'> Autonome Provinz Bozen </a>  (<a href ='https://creativecommons.org/licenses/by/4.0/deed.de'> CC-BY</a>)",
      transparent: true,
      format: 'image/png',
      pane: "overlayPane",
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



//===================Border==============
let TirolBorderGeojson = L.geoJSON(suedtirol_border, {
  style: function(feature) {
    return {color: "#de2d26"}; //http://colorbrewer2.org/#type=sequential&scheme=Reds&n=3
  }});
let SuedtirolBorderGeojson = L.geoJSON(tirol_border, {
  style: function(feature) {
    return {color: "#de2d26"};
  }});

const AllBorderGrp = L.layerGroup([TirolBorderGeojson, SuedtirolBorderGeojson]).addTo(myMap);



// TODO: Please credit as follows: Maps Icons Collection https://mapicons.mapsmarker.com
//===================Nordtirol==============
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
  <p> Fläche 2006:  ${Area} km²</p>`;
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
const geojson_st = L.geoJSON(gi_2006_st_points, {
  style: function(feature) {
    return {color: "#7fcdbb"};
  },
  pointToLayer: function(geoJsonPoint, latlng) {
    return L.marker(latlng, {icon: L.icon({
      iconUrl: 'icons/pinother_blue.png',
      iconAnchor : [16,37],
      popupAnchor : [0,-37],
    })
    });
  }
}).addTo(Glacierpts_st);
Glacierpts_st.addLayer(geojson_st);
//myMap.fitBounds(Glacierpts_st.getBounds());
Glacierpts_st.bindPopup(function(layer) {
  const props = layer.feature.properties;
  const Area2006 = (props.GLAC_AREA_06).toFixed(3)
  const Area1997 = (props.GLAC_AREA_97).toFixed(3)
  const popupText = `<h1>${props.GLETSCHERN}</h1>
   <p> Fläche 1997:  ${Area1997} km²</p> <p> Fläche 2006:  ${Area2006} km²</p>`;
  return popupText;  //replaced in geojson js GLAC_GLACIER_NAME_DE with GLETSCHERN
}
);

let geojson_st_2 = L.geoJSON(gi_2006_st_polygon).addTo(Glacierpolygon_st)

let geojson_st_2_layers = geojson_st_2.getLayers();


let GlacierfeatureGroup_st =  L.layerGroup([Glacierpts_st,Glacierpolygon_st], {
  attribution : "Gletscherdaten: <a href ='http://dati.retecivica.bz.it/de/info'> Autonome Provinz Bozen </a>  (<a href ='https://creativecommons.org/publicdomain/zero/1.0/deed.it'> CC0</a>)",
});

myMap.addLayer(Glacierpts_st);
myMap.addLayer(GlacierfeatureGroup_st);


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
  "Gletscher Südtirol Marker" : Glacierpts_st,
  "Gletscher Südtirol Fläche" : Glacierpolygon_st,
  "Orthophoto Tirol & Südtirol" : gdi_orthoGrp,
}, { //map control ausgeklappt lassen
  collapsed:false} );

myMap.addControl(myMapControl);

//=======================================================================

const hash = new L.Hash(myMap);

//=======================================================================
/*let searchlayer = ['GLETSCHERN','GLAC_GLACIER_NAME_DE']; !!!!*/

myMap.addControl( new L.Control.Search({
  layer: L.featureGroup([Glacierpts, Glacierpts_st]),
  initial: false,
  propertyName: 'GLETSCHERN',
}));


//test logs.
/*
console.log(geojson.getLayers());
console.log(geojson_layers);
console.log(geojson_layers.length);
console.log(geojson.getLayerId(geojson._layers));

console.log(geojson._layers[50].feature.properties.GLETSCHERN);
*/
