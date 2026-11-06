var greyStyles = [
{
featureType: "all",
stylers: [
      {saturation: '-55'},
      {hue: '#555ff00'},
      {gamma: '0.90'},
]
},
{
featureType: 'road.highway',
      rules: [
      {hue: -80},
      {saturation: -40},
      {lightness: 8.8}
]
    }
  ];
  var map;
  // Départ : place d'Italie — Arrivée : place Denfert-Rochereau
  var depart = new google.maps.LatLng(48.8313, 2.3557);
  var arrivee = new google.maps.LatLng(48.8339, 2.3324);
  var markers = [];

  function initialize() {
  var greyMapType = new google.maps.StyledMapType(greyStyles,
  {name: "Grey Area"});
  var mapOptions = {
  zoom: 15,
  center: depart,
      scrollwheel: false,
      navigationControl: false,
      mapTypeControl: true,
      scaleControl: true,
      draggable: true,
      mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'grey_area']
      }
    };
  map = new google.maps.Map(document.getElementById('map_canvas'),
    mapOptions);

  //Associate the styled map with the MapTypeId and set it to display.
  map.mapTypes.set('grey_area', greyMapType);
  map.setMapTypeId('grey_area');

  addMarker(depart, 'D', "Départ : place d'Italie");
  addMarker(arrivee, 'A', 'Arrivée : place Denfert-Rochereau');

  // Affiche le départ et l'arrivée dans la carte
  var bounds = new google.maps.LatLngBounds();
  bounds.extend(depart);
  bounds.extend(arrivee);
  map.fitBounds(bounds, 70);
  }

  function addMarker(position, label, title) {
    var marker = new google.maps.Marker({
      map: map,
      position: position,
      label: label,
      title: title,
      animation: google.maps.Animation.DROP
    });
    var infowindow = new google.maps.InfoWindow({content: title});
    google.maps.event.addListener(marker, 'click', function() {
      toggleBounce(marker);
      infowindow.open(map, marker);
    });
    markers.push(marker);
  }

  function toggleBounce(marker) {
    if (marker.getAnimation() != null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
    }
  }
