// set initial center point, zoom, and layers
let startCenter = [47.267, 11.383];
let startZoom = 10;
let minZoom = 9;

let Glacierpts = L.markerClusterGroup();

// define baselayers and insert further below, and also in index.html

let ortho_1970_1982 = L.tileLayer.wms(
  "https://gis.tirol.gv.at/arcgis/services/Service_Public/orthofoto/MapServer/WMSServer?", {
    layers: "Image_1970-1982",
    attribution : "Datenquelle: <a href ='https://www.tirol.gv.at/data/nutzungsbedingungen/'> Land Tirol - data.tirol.gv.at </a>",
    transparent: true,
    format: 'image/png',
    //pane: "overlayPane",
  }
)

let ortho_1999_2004 = L.tileLayer.wms(
  "https://gis.tirol.gv.at/arcgis/services/Service_Public/orthofoto/MapServer/WMSServer?", {
    layers: "Image_1999-2004",
    attribution : "Datenquelle: <a href ='https://www.tirol.gv.at/data/nutzungsbedingungen/'> Land Tirol - data.tirol.gv.at </a>",
    transparent: true,
    format: 'image/png',
    //pane: "overlayPane",
  }
)

let ortho_2004_2009 = L.tileLayer.wms(
  "https://gis.tirol.gv.at/arcgis/services/Service_Public/orthofoto/MapServer/WMSServer?", {
    layers: "Image_2004-2009",
    attribution : "Datenquelle: <a href ='https://www.tirol.gv.at/data/nutzungsbedingungen/'> Land Tirol - data.tirol.gv.at </a>",
    transparent: true,
    format: 'image/png',
    //pane: "overlayPane",
  }
)

let ortho_2009_2012 = L.tileLayer.wms(
  "https://gis.tirol.gv.at/arcgis/services/Service_Public/orthofoto/MapServer/WMSServer?", {
    layers: "Image_2009-2012",
    attribution : "Datenquelle: <a href ='https://www.tirol.gv.at/data/nutzungsbedingungen/'> Land Tirol - data.tirol.gv.at </a>",
    transparent: true,
    format: 'image/png',
    //pane: "overlayPane",
  }
)

let ortho_2013_2015 = L.tileLayer.wms(
  "https://gis.tirol.gv.at/arcgis/services/Service_Public/orthofoto/MapServer/WMSServer?", {
    layers: "Image_2013-2015",
    attribution : "Datenquelle: <a href ='https://www.tirol.gv.at/data/nutzungsbedingungen/'> Land Tirol - data.tirol.gv.at </a>",
    transparent: true,
    format: 'image/png',
    //pane: "overlayPane",
  }
)

let ortho_aktuell_rgb = L.tileLayer.wms(
  "https://gis.tirol.gv.at/arcgis/services/Service_Public/orthofoto/MapServer/WMSServer?", {
    layers: "Image_Aktuell_RGB",
    attribution : "Datenquelle: <a href ='https://www.tirol.gv.at/data/nutzungsbedingungen/'> Land Tirol - data.tirol.gv.at </a>",
    transparent: true,
    format: 'image/png',
    //pane: "overlayPane",
  }
)

// Create two maps
let map1 = L.map('map1', {
    layers: ortho_1970_1982,
    center: startCenter,
    zoom: startZoom,
    zoomControl: false,
    minZoom: minZoom,
    scrollWheelZoom: false,

});

let map2 = L.map('map2', {
    layers: ortho_aktuell_rgb,
    center: startCenter,
    zoom: startZoom,
    minZoom: minZoom,
    zoomControl: false,
    scrollWheelZoom: false,

});

// Reposition zoom control other than default topleft
L.control.zoom({position: "topright"}).addTo(map1);
L.control.zoom({position: "topright"}).addTo(map2);


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
Glacierpts.bindPopup(function(layer) {
  const props = layer.feature.properties;
  const popupText = `<h1>${props.GLETSCHERN}</h1>`;
  return popupText;
});

let GlacierfeatureGroup =  L.layerGroup([Glacierpts], {
  attribution : "Gletscherdaten: <a href ='https://doi.pangaea.de/10.1594/PANGAEA.806960'> Abermann et al. (2012) </a> (<a href ='https://creativecommons.org/licenses/by/3.0/'> CC BY 3.0 </a>)",
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
	map1basemaps.innerHTML += '<select name="basemaps"><option value="ortho_1970_1982">1970-1982</option><option value="ortho_1999_2004">1999-2004</option><option value="ortho_2004_2009">2004-2009</option><option value="ortho_2009_2012">2009-2012</option><option value="ortho_2013_2015">2013-2015</option></select>';

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
	div.innerHTML += '<strong>Orthophoto Aktuell (2016)</strong>';

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
  let featureLayerCollection = [ortho_1970_1982,ortho_1999_2004,ortho_2004_2009,ortho_2009_2012,ortho_2013_2015,ortho_aktuell_rgb]
  for (let i = 0; i < featureLayerCollection.length; i++) {
      mAp.removeLayer(featureLayerCollection[i]);
  }
  //this line empties the array
  featureLayerCollection.length = 0;
  }
  clearAllLayers()

  // Add appropriate new layer -- insert all basemap letiables
  switch (basemap) {
    case 'ortho_1970_1982':
      mAp.addLayer(ortho_1970_1982);
      break;
    case 'ortho_1999_2004':
      mAp.addLayer(ortho_1999_2004);
      break;
    case 'ortho_2004_2009':
      mAp.addLayer(ortho_2004_2009);
      break;
    case 'ortho_2009_2012':
      mAp.addLayer(ortho_2009_2012);
      break;
    case 'ortho_2013_2015':
      mAp.addLayer(ortho_2013_2015);
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
