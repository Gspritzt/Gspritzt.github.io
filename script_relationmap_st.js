// set initial center point, zoom, and layers
let startCenter = [46.49926,11.35661];
let startZoom = 10;
let minZoom = 9;

let Glacierpts = L.markerClusterGroup();

// define baselayers and insert further below, and also in index.html

let ortho_1992_1997 = L.tileLayer.wms(
  "http://geoservices.buergernetz.bz.it/geoserver/ows?", {
    layers: "Orthophoto_1992_97",
    attribution : "Datenquelle: <a href ='http://dati.retecivica.bz.it/de/info'> Autonome Provinz Bozen </a>  (<a href ='https://creativecommons.org/licenses/by/4.0/deed.de'> CC-BY</a>)",
    transparent: true,
    format: 'image/png',
    //pane: "overlayPane",
  }
)

let ortho_2000 = L.tileLayer.wms(
  "http://geoservices.buergernetz.bz.it/geoserver/ows?", {
    layers: "Orthophoto_2000",
    attribution : "Datenquelle: <a href ='http://dati.retecivica.bz.it/de/info'> Autonome Provinz Bozen </a>  (<a href ='https://creativecommons.org/licenses/by/4.0/deed.de'> CC-BY</a>)",
    transparent: true,
    format: 'image/png',
    //pane: "overlayPane",
  }
)

let ortho_2003 =  L.tileLayer.wms(
  "http://geoservices.buergernetz.bz.it/geoserver/ows?", {
    layers: "Orthophoto_2003",
    attribution : "Datenquelle: <a href ='http://dati.retecivica.bz.it/de/info'> Autonome Provinz Bozen </a>  (<a href ='https://creativecommons.org/licenses/by/4.0/deed.de'> CC-BY</a>)",
    transparent: true,
    format: 'image/png',
    //pane: "overlayPane",
  }
)

let ortho_2006 =  L.tileLayer.wms(
  "http://geoservices.buergernetz.bz.it/geoserver/ows?", {
    layers: "Orthophoto_2006",
    attribution : "Datenquelle: <a href ='http://dati.retecivica.bz.it/de/info'> Autonome Provinz Bozen </a>  (<a href ='https://creativecommons.org/licenses/by/4.0/deed.de'> CC-BY</a>)",
    transparent: true,
    format: 'image/png',
    //pane: "overlayPane",
  }
)

let ortho_2008 =  L.tileLayer.wms(
  "http://geoservices.buergernetz.bz.it/geoserver/ows?", {
    layers: "P_BZ_OF_2008",
    attribution : "Datenquelle: <a href ='http://dati.retecivica.bz.it/de/info'> Autonome Provinz Bozen </a>  (<a href ='https://creativecommons.org/licenses/by/4.0/deed.de'> CC-BY</a>)",
    transparent: true,
    format: 'image/png',
    //pane: "overlayPane",
  }
)

let ortho_2011 =  L.tileLayer.wms(
  "http://geoservices.buergernetz.bz.it/geoserver/ows?", {
    layers: "P_BZ_OF_2011",
    attribution : "Datenquelle: <a href ='http://dati.retecivica.bz.it/de/info'> Autonome Provinz Bozen </a>  (<a href ='https://creativecommons.org/licenses/by/4.0/deed.de'> CC-BY</a>)",
    transparent: true,
    format: 'image/png',
    //pane: "overlayPane",
  }
)

let ortho_aktuell_rgb = L.tileLayer.wms(
  "http://geoservices.buergernetz.bz.it/geoserver/ows?", {
    layers: "P_BZ_OF_2014_2015", /*Orthophoto_2011 */
    attribution : "Datenquelle: <a href ='http://dati.retecivica.bz.it/de/info'> Autonome Provinz Bozen </a>  (<a href ='https://creativecommons.org/licenses/by/4.0/deed.de'> CC-BY</a>)",
    transparent: true,
    format: 'image/png',
    //pane: "overlayPane",
  }
)

// Create two maps
let map1 = L.map('map1', {
    layers: ortho_1992_1997,
    center: startCenter,
    zoom: startZoom,
    zoomControl: false,
    minZoom: minZoom,
    scrollWheelZoom: false,
    //maxBounds: [minLatLng,maxLatLng]
});

let map2 = L.map('map2', {
    layers: ortho_aktuell_rgb,
    center: startCenter,
    zoom: startZoom,
    minZoom: minZoom,
    zoomControl: false,
    scrollWheelZoom: false,
    //maxBounds: [minLatLng,maxLatLng]
});

// Reposition zoom control other than default topleft
L.control.zoom({position: "topright"}).addTo(map1);
L.control.zoom({position: "topright"}).addTo(map2);


//===================Nordtirol==============
const geojson = L.geoJSON(gi_2006_st_points, {
  style: function(feature) {
    return {color: "#ff0000"};
  },
  pointToLayer: function(geoJsonPoint, latlng) {
    return L.marker(latlng, {icon: L.icon({
      iconUrl: 'icons/pinother_blue.png',
      iconAnchor : [16,37],
      popupAnchor : [0,-37],
    })
    });
  }
}).addTo(Glacierpts);
Glacierpts.addLayer(geojson);
Glacierpts.bindPopup(function(layer) {
  const props = layer.feature.properties;
  const popupText = `<h1>${props.GLETSCHERN}</h1>`;
  return popupText;
});

let GlacierfeatureGroup =  L.layerGroup([Glacierpts], {
  attribution : "Gletscherdaten: <a href ='http://dati.retecivica.bz.it/de/info'> Autonome Provinz Bozen </a>  (<a href ='https://creativecommons.org/publicdomain/zero/1.0/deed.it'> CC0</a>)",
});

//myMap.addLayer(Glacierpts);
//map1.addLayer(GlacierfeatureGroup);
map2.addLayer(GlacierfeatureGroup);

// Maßstab metrisch ohne inch
//Maßstabsleiste
let myScale = L.control.scale({
  position : "bottomleft",
  maxWidth : 200,
  imperial : false,
  metric : true
});

myScale.addTo(map1);

//################Map1 Legend###########################
// Create Leaflet Control Object for Legend
let legend_drop = L.control({position: 'topleft'});

// Function that runs when legend is added to map
legend_drop.onAdd = function (map) {

	// Create Div Element and Populate it with HTML
	let map1basemaps = L.DomUtil.create('map1basemaps', 'legend_drop');
	map1basemaps.innerHTML += '<select name="basemaps"><option value="ortho_1992-1997">1992-1997</option><option value="ortho_2000">2000</option><option value="ortho_2003">2003</option><option value="ortho_2006">2006</option><option value="ortho_2008">2008</option><option value="ortho_2011">2011</option></select>';

	// Return the Legend div containing the HTML content
	return map1basemaps;
};

// Add Legend to Map
legend_drop.addTo(map1);

//################Map2 Legend###########################
// Create Leaflet Control Object for Legend
let legend = L.control({position: 'topleft'});

// Function that runs when legend is added to map
legend.onAdd = function (map) {

	// Create Div Element and Populate it with HTML
	let div = L.DomUtil.create('div', 'legend');
	div.innerHTML += '<strong>Orthophoto Aktuell (2014-2015)</strong>';

	// Return the Legend div containing the HTML content
	return div;
};

// Add Legend to Map
legend.addTo(map2);

map2.addControl( new L.Control.Search({
  layer: Glacierpts,
  initial: false,
  propertyName: 'GLETSCHERN',
}));

// sync code adapted from https://www.mapbox.com/mapbox.js/example/v1.0.0/sync-layer-movement/
// when either map finishes moving, trigger an update on the other one
map1.on('moveend', follow).on('zoomend', follow);
map2.on('moveend', follow).on('zoomend', follow);

// when calling sync, do not infinitely loop again and sync other maps
let quiet = false;
function follow(e) {
    if (quiet) return;
    quiet = true;
    if (e.target === map1) sync(map2, e);
    if (e.target === map2) sync(map1, e);
    quiet = false;
}

// sync steals settings from the moved map (e.target) and applies them to other map
function sync(map, e) {
    map.setView(e.target.getCenter(), e.target.getZoom(), {
        animate: false,
        reset: true
    });
}

function changeBasemap(map, basemap) {
  let mAp = map1

// function that removes loaded layers
function clearAllLayers(){
  let featureLayerCollection = [ortho_1992_1997,ortho_2000,ortho_2003,ortho_2006,ortho_2008,ortho_2011]
  for (let i = 0; i < featureLayerCollection.length; i++) {
      mAp.removeLayer(featureLayerCollection[i]);
  }
  //this line empties the array
  featureLayerCollection.length = 0;
  }
  clearAllLayers()

  // Add appropriate new layer -- insert all basemap letiables
  switch (basemap) {
    case 'ortho_1992_1997':
      mAp.addLayer(ortho_1992_1997);
      break;
    case 'ortho_2000':
      mAp.addLayer(ortho_2000);
      break;
    case 'ortho_2003':
      mAp.addLayer(ortho_2003);
      break;
      case 'ortho_2006':
        mAp.addLayer(ortho_2006);
        break;
    case 'ortho_2008':
      mAp.addLayer(ortho_2008);
      break;
    case 'ortho_2011':
      mAp.addLayer(ortho_2011);
      break;
    case 'ortho_aktuell_rgb':
      mAp.addLayer(ortho_aktuell_rgb);
      break;
    default:
      break;
  }
};

// combine map1basemap select with changeBasemap function
$(document).ready(function() {
  $('map1basemaps select').change(function() {
    changeBasemap('map1', $(this).val());
  });
});

//=======================================================================

const hash = new L.Hash(map1);
