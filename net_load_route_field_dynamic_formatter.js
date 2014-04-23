/**
 * @file
 * Javascript for Goole Map Dynamic API Formatter javascript code.
 * 
 * Many thanks to Lukasz Klimek http://www.klimek.ws for the help
 */

(function($) {

  Drupal.netloadrouteGooglemaps = Drupal.netloadrouteGooglemaps || {};
  Drupal.netloadrouteGooglemaps.maps = Drupal.netloadrouteGooglemaps.maps || {};
  Drupal.netloadrouteGooglemaps.markers_p = Drupal.netloadrouteGooglemaps.markers_p || {};
  Drupal.netloadrouteGooglemaps.markers_d = Drupal.netloadrouteGooglemaps.markers_d || {};

  Drupal.behaviors.netloadrouteGooglemapsDynamicFormatter = {

    attach : function(context, settings) {

      var fields = settings.netloadrouteGooglemaps.formatters;

      // Work on each map
      $.each(fields, function(instance, data) {
        var instanceSettings = data.settings;
        $.each(data.deltas, function(d, delta) {

          id = instance + "-" + d;

          // Only make this once ;)
          $("#net-load-route-googlemaps-dynamic-" + id).once('net-load-route-googlemaps-dynamic-formatter', function() {

            var map_type;
            var mapOptions;

            var lat_p = delta.lat_p;
            var lng_p = delta.lng_p;
            var latLng_p = new google.maps.LatLng(lat_p, lng_p);
            var lat_d = delta.lat_d;
            var lng_d = delta.lng_d;
            var latLng_d = new google.maps.LatLng(lat_d, lng_d);

            switch (instanceSettings.map_maptype) {
              case 'satellite':
                map_type = google.maps.MapTypeId.SATELLITE;
                break;

              case 'terrain':
                map_type = google.maps.MapTypeId.TERRAIN;
                break;

              case 'hybrid':
                map_type = google.maps.MapTypeId.HYBRID;
                break;

              default:
                map_type = google.maps.MapTypeId.ROADMAP;
                break;
            }

            mapOptions = {
              zoom : parseInt(instanceSettings.map_zoomlevel),
              center : latLng_p,
              mapTypeId : map_type,
              scrollwheel : instanceSettings.map_scrollwheel
            };

            // Create map
            Drupal.netloadrouteGooglemaps.maps[id] = new google.maps.Map(this, mapOptions);

            // Create and place marker
            Drupal.netloadrouteGooglemaps.markers_p[id] = new google.maps.Marker({
              map : Drupal.netloadrouteGooglemaps.maps[id],
              draggable : false,
              icon : instanceSettings.marker_icon,
              position : latLng_p
            });
            Drupal.netloadrouteGooglemaps.markers_d[id] = new google.maps.Marker({
              map : Drupal.netloadrouteGooglemaps.maps[id],
              draggable : false,
              icon : instanceSettings.marker_icon,
              position : latLng_d
            });
          });
        });
      });
    }
  };
}(jQuery));
