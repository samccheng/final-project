mapboxgl.accessToken = "pk.eyJ1IjoibGVhcm50b3Byb2dyYW0iLCJhIjoiY2o1NXh2ODB4MGlqNDMybW44YXN6dmcyZiJ9.4zfzTch7XuQeOu_HhLDmYw";
// This adds the map to your page
var map = new mapboxgl.Map({
  // container id specified in the HTML
  container: 'map',
  // style URL
  style: 'mapbox://styles/mapbox/streets-v10',
  // initial position in [lon, lat] format
  center: [-104.9903, 39.7492],
  // initial zoom
  zoom: 14
});



var stores = {
  // data from sweetgreen.geojson, downloaded above
        
        "type": "FeatureCollection",
        "features": [
          {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [
                -105.007047, 39.757887
              ]
            },
            "properties": {
              "place": "GALVANIZE",
              "phoneFormatted": "(303) 749-0110",
              "phone": "2022347336",
              "address": "1644 Platte St",
              "city": "Denver CO"
            }
      
  			},
  			 {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [
                -105.001329, 39.758192 
              ]
            },
            "properties": {
              "place": "RAILYARD DOG PARK",
              "phoneFormatted": "",
              "phone": "",
              "address": "",
              "city": "Denver CO"
            }
      
  			},
  			 {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [
                -104.998844, 39.749140 
              ]
            },
            "properties": {
              "place": "DOG SAVVY",
              "phoneFormatted": "(303) 623-5200",
              "phone": "(303) 623-5200",
              "address": "1402 Larimer St",
              "city": "Denver CO"
            }
      
  			},
  			 {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [
                -105.009087, 39.757587 
              ]
            },
            "properties": {
              "place": "REPUBLIC OF PAWS",
              "phoneFormatted": "(303) 744-7067",
              "phone": "(303) 744-7067",
              "address": "2401 15th St #180",
              "city": "Denver CO"
            }
      
  			},
  			 {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [
                -104.999431, 39.757554
              ]
            },
            "properties": {
              "place": "KRISER'S NATURAL PET",
              "phoneFormatted": "(303) 295-0922",
              "phone": "(303) 295-0922",
              "address": "1910 Chestnut Pl",
              "city": "Denver CO"
            }
      
  			}
        ]
      
};


map.on('load', function(e) {
  // Add the data to your map as a layer
  // map.addLayer({
  //   id: 'locations',
  //   type: 'symbol',
  //   // Add a GeoJSON source containing place coordinates and information.
  //   source: {
  //     type: 'geojson',
  //     data: stores
  //   },
  //   layout: {
  //     'icon-image': 'restaurant-15',
  //     'icon-allow-overlap': true,
  //   }
  // });
   map.addSource('places', {
    type: 'geojson',
    data: stores
  });
  buildLocationList(stores)
});

function buildLocationList(data) {
  // Iterate through the list of stores
  for (i = 0; i < data.features.length; i++) {
    var currentFeature = data.features[i];
    // Shorten data.feature.properties to just `prop` so we're not
    // writing this long form over and over again.
    var prop = currentFeature.properties;
    // Select the listing container in the HTML and append a div
    // with the class 'item' for each store
    var listings = document.getElementById('listings');
    var listing = listings.appendChild(document.createElement('div'));
    listing.className = 'item';
    listing.id = 'listing-' + i;

    // Create a new link with the class 'title' for each store
    // and fill it with the store address

    // added class of place to display location
    var place = listing.appendChild(document.createElement('a'));
    place.href = '#';
    place.className = 'place';
    place.dataPosition = i;
    place.innerHTML = prop.place;

    var link = listing.appendChild(document.createElement('a'));
    link.href = '#';
    link.className = 'title';
    link.dataPosition = i;
    link.innerHTML = prop.address;

    // Create a new div with the class 'details' for each store
    // and fill it with the city and phone number
    var details = listing.appendChild(document.createElement('div'));
    details.innerHTML = prop.city;
    if (prop.phone) {
      details.innerHTML += ' &middot; ' + prop.phoneFormatted;
    }

      place.addEventListener('click', function(e) {
  // Update the currentFeature to the store associated with the clicked link
	  var clickedListing = data.features[this.dataPosition];
	  // 1. Fly to the point associated with the clicked link
	  flyToStore(clickedListing);
	  // 2. Close all other popups and display popup for clicked store
	  createPopUp(clickedListing);
	  // 3. Highlight listing in sidebar (and remove highlight for all other listings)
	  var activeItem = document.getElementsByClassName('active');
		  if (activeItem[0]) {
		    activeItem[0].classList.remove('active');
		  }
		  this.parentNode.classList.add('active');

	  stores.features.forEach(function(marker) {
	  // Create a div element for the marker
		  var el = document.createElement('div');
		  // Add a class called 'marker' to each div
		  el.className = 'marker';
		  // By default the image for your custom marker will be anchored
		  // by its top left corner. Adjust the position accordingly
		  // Create the custom markers, set their position, and add to map
		  new mapboxgl.Marker(el, { offset: [-28, -46] })
		    .setLngLat(marker.geometry.coordinates)
		    .addTo(map);

		  el.addEventListener('click', function(e) {
		  
		  var activeItem = document.getElementsByClassName('active');
		  // 1. Fly to the point
		  flyToStore(marker);
		  // 2. Close all other popups and display popup for clicked store
		  createPopUp(marker);
		  // 3. Highlight listing in sidebar (and remove highlight for all other listings)
		  e.stopPropagation();
		  if (activeItem[0]) {
		    activeItem[0].classList.remove('active');
		  }
		  var listing = document.getElementById('listing-' + i);
		  console.log(listing);
		  listing.classList.add('active');
});
});
});
  }
}

function flyToStore(currentFeature) {
  map.flyTo({
    center: currentFeature.geometry.coordinates,
    zoom: 15
  });
}

function createPopUp(currentFeature) {
  var popUps = document.getElementsByClassName('mapboxgl-popup');
  // Check if there is already a popup on the map and if so, remove it
  if (popUps[0]) popUps[0].remove();

  var popup = new mapboxgl.Popup({ closeOnClick: false })
    .setLngLat(currentFeature.geometry.coordinates)
    .setHTML('<h3>' + currentFeature.properties.place + '</h3>' +
      '<h4>' + currentFeature.properties.address + '</h4>')
    .addTo(map);
}

// Add an event listener for the links in the sidebar listing


// Add an event listener for when a user clicks on the map
map.on('click', function(e) {
  // Query all the rendered points in the view
  var features = map.queryRenderedFeatures(e.point, { layers: ['locations'] });
  if (features.length) {
    var clickedPoint = features[0];
    // 1. Fly to the point
    flyToStore(clickedPoint);
    // 2. Close all other popups and display popup for clicked store
    createPopUp(clickedPoint);
    // 3. Highlight listing in sidebar (and remove highlight for all other listings)
    var activeItem = document.getElementsByClassName('active');
    if (activeItem[0]) {
      activeItem[0].classList.remove('active');
    }
    // Find the index of the store.features that corresponds to the clickedPoint that fired the event listener
    var selectedFeature = clickedPoint.properties.place;

    for (var i = 0; i < stores.features.length; i++) {
      if (stores.features[i].properties.place === selectedFeature) {
        selectedFeatureIndex = i;
      }
    }
    // Select the correct list item using the found index and add the active class
    var listing = document.getElementById('listing-' + selectedFeatureIndex);
    listing.classList.add('active');
  }
});


