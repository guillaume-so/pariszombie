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
  // Départ : place d'Italie, devant le Mémorial aux enfants du 13e morts
  // (angle du 1 bd Auguste-Blanqui) — Arrivée : place Denfert-Rochereau
  var depart = new google.maps.LatLng(48.8307, 2.3544);
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

  addMarker(depart, 'D', "Rassemblement dès 13h00, départ à 15h00 : place d'Italie, devant le Mémorial aux enfants du 13e morts (angle du 1 bd Auguste-Blanqui)");
  addMarker(arrivee, 'A', 'Arrivée : place Denfert-Rochereau');

  // Affiche le départ et l'arrivée dans la carte
  var bounds = new google.maps.LatLngBounds();
  bounds.extend(depart);
  bounds.extend(arrivee);
  map.fitBounds(bounds, 70);

  drawRoute();
  startZombies();
  }

  // Tracé du cortège : bd Auguste-Blanqui puis bd Saint-Jacques
  var parcours = [
    [48.8307, 2.3544], // place d'Italie, Mémorial (1 bd Auguste-Blanqui)
    [48.8299, 2.3506], // Corvisart
    [48.8304, 2.3468],
    [48.8311, 2.3433], // Glacière
    [48.8317, 2.3410], // rue de la Santé
    [48.8329, 2.3372], // Saint-Jacques
    [48.8335, 2.3345],
    [48.8339, 2.3324]  // place Denfert-Rochereau
  ];

  function drawRoute() {
    var path = parcours.map(function(p) { return new google.maps.LatLng(p[0], p[1]); });
    // trace de sang : un trait pointillé rouge
    new google.maps.Polyline({
      map: map,
      path: path,
      strokeOpacity: 0,
      icons: [{
        icon: {path: 'M 0,-1 0,1', strokeColor: '#b3170f', strokeOpacity: 0.9, strokeWeight: 5, scale: 3},
        offset: '0',
        repeat: '16px'
      }]
    });
  }

  // Petits zombies qui avancent le long du parcours
  var hordes = ['🧟', '🧟‍♀️', '🧟‍♂️', '🧟', '🧟‍♀️', '🧟‍♂️', '🧟'];
  var zombies = [];

  function startZombies() {
    // longueur de chaque tronçon (approximation plane, suffisante sur 2 km)
    var cosLat = Math.cos(48.83 * Math.PI / 180);
    var segs = [], total = 0;
    for (var i = 0; i < parcours.length - 1; i++) {
      var dy = parcours[i + 1][0] - parcours[i][0];
      var dx = (parcours[i + 1][1] - parcours[i][1]) * cosLat;
      var len = Math.sqrt(dx * dx + dy * dy);
      segs.push({len: len, dx: dx, dy: dy});
      total += len;
    }

    function pointAt(t, wobble) {
      var d = t * total;
      for (var i = 0; i < segs.length; i++) {
        if (d <= segs[i].len || i === segs.length - 1) {
          var k = segs[i].len ? d / segs[i].len : 0;
          var lat = parcours[i][0] + (parcours[i + 1][0] - parcours[i][0]) * k;
          var lng = parcours[i][1] + (parcours[i + 1][1] - parcours[i][1]) * k;
          // petit balancement perpendiculaire au trajet : la démarche du zombie
          var n = segs[i].len || 1;
          lat += (segs[i].dx / n) * wobble;
          lng += (-segs[i].dy / n) * wobble / cosLat;
          return new google.maps.LatLng(lat, lng);
        }
        d -= segs[i].len;
      }
    }

    for (var j = 0; j < hordes.length; j++) {
      var z = {
        t: j / hordes.length,
        speed: 0.00025 + Math.random() * 0.0002,
        phase: Math.random() * Math.PI * 2,
        marker: new google.maps.Marker({
          map: map,
          icon: {path: google.maps.SymbolPath.CIRCLE, scale: 0},
          label: {text: hordes[j], fontSize: '26px'},
          title: 'Zombie en route vers Denfert',
          clickable: false,
          zIndex: 10
        })
      };
      z.marker.setPosition(pointAt(z.t, 0));
      zombies.push(z);
    }

    // pas d'animation si le visiteur a demandé à réduire les mouvements
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var last = null;
    function step(now) {
      var dt = last === null ? 16 : Math.min(now - last, 100);
      last = now;
      for (var j = 0; j < zombies.length; j++) {
        var z = zombies[j];
        z.t += z.speed * dt / 16;
        if (z.t > 1) z.t -= 1; // arrivé : un nouveau zombie repart d'Italie
        var wobble = Math.sin(now / 180 + z.phase) * 0.00006;
        z.marker.setPosition(pointAt(z.t, wobble));
      }
      window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
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
