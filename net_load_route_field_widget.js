/**
 * @file
 * Javascript for Goole Map widget of Geolocation field.
 */

(function ($) {
  var geocoder;
  Drupal.net_load_route = Drupal.net_load_route || {};
  Drupal.net_load_route.maps = Drupal.net_load_route.maps || {};
  Drupal.net_load_route.markers_p = Drupal.net_load_route.markers_p || {};
  Drupal.net_load_route.markers_d = Drupal.net_load_route.markers_d || {};

  /**
   * Set the latitude and longitude values to the input fields
   * And optionaly update the address field
   *
   * @param latLng
   *   a location (latLng) object from google maps api
   * @param i
   *   the index from the maps array we are working on
   * @param op
   *   the op that was performed
   */
  Drupal.net_load_route.codeLatLng_p = function(latLng_p, i, op) {
    // Update the lat and lng input fields
    $('#net-load-route-lat-p-' + i + ' input').attr('value', latLng_p.lat());
    $('#net-load-route-lat-item-p-' + i + ' .net-load-route-lat-item-value').html(latLng_p.lat());
    $('#net-load-route-lng-p-' + i + ' input').attr('value', latLng_p.lng());
    $('#net-load-route-lng-item-p-' + i + ' .net-load-route-lat-item-value').html(latLng_p.lng());
 
    // Update the address field
    if ((op == 'marker' || op == 'geocoder') && geocoder) {
      geocoder.geocode({'latLng': latLng_p}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          $('#net-load-route-address-p-' + i + ' input').val(results[0].formatted_address);
          if (op == 'geocoder') {
            Drupal.net_load_route.setZoom(i, results[0].geometry.location_type);
          }
        }
        else {
          $('#net-load-route-address-p-' + i + ' input').val('');
          if (status != google.maps.GeocoderStatus.ZERO_RESULTS) {
            alert(Drupal.t('Geocoder failed due to: ') + status);
          }
        }
      });
    }
  }

  Drupal.net_load_route.codeLatLng_d = function(latLng_d, i, op) {
    // Update the lat and lng input fields
    $('#net-load-route-lat-d-' + i + ' input').attr('value', latLng_d.lat());
    $('#net-load-route-lat-item-d-' + i + ' .net-load-route-lat-item-value').html(latLng_d.lat());
    $('#net-load-route-lng-d-' + i + ' input').attr('value', latLng_d.lng());
    $('#net-load-route-lng-item-d-' + i + ' .net-load-route-lat-item-value').html(latLng_d.lng());
 
    // Update the address field
    if ((op == 'marker' || op == 'geocoder') && geocoder) {
      geocoder.geocode({'latLng': latLng_d}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          $('#net-load-route-address-d-' + i + ' input').val(results[0].formatted_address);
          if (op == 'geocoder') {
            Drupal.net_load_route.setZoom(i, results[0].geometry.location_type);
          }
        }
        else {
          $('#net-load-route-address-d-' + i + ' input').val('');
          if (status != google.maps.GeocoderStatus.ZERO_RESULTS) {
            alert(Drupal.t('Geocoder failed due to: ') + status);
          }
        }
      });
    }
  }
 
  /**
   * Get the location from the address field
   *
   * @param i
   *   the index from the maps array we are working on
   */
  Drupal.net_load_route.codeAddress_p = function(i) {
    var address_p = $('#net-load-route-address-p-' + i + ' input').val();
    geocoder.geocode( { 'address': address_p }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        Drupal.net_load_route.maps[i].setCenter(results[0].geometry.location);
        Drupal.net_load_route.setMapMarker_p(results[0].geometry.location, i);
        Drupal.net_load_route.codeLatLng_p(results[0].geometry.location, i, 'textinput');
        Drupal.net_load_route.setZoom(i, results[0].geometry.location_type);
      }
      else {
        alert(Drupal.t('Geocode was not successful for the following reason: ') + status);
      }
    });
  }

  Drupal.net_load_route.codeAddress_d = function(i) {
    var address_d = $('#net-load-route-address-d-' + i + ' input').val();
    geocoder.geocode( { 'address': address_d }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        //Drupal.net_load_route.maps[i].setCenter(results[0].geometry.location);
        Drupal.net_load_route.setMapMarker_d(results[0].geometry.location, i);
        Drupal.net_load_route.codeLatLng_d(results[0].geometry.location, i, 'textinput');
        //Drupal.net_load_route.setZoom(i, results[0].geometry.location_type);
      }
      else {
        alert(Drupal.t('Geocode was not successful for the following reason: ') + status);
      }
    });
  }

  /**
   * Set zoom level depending on accuracy (location_type)
   *
   * @param location_type
   *   location type as provided by google maps after geocoding a location
   */
   Drupal.net_load_route.setZoom = function(i, location_type) {
     if (location_type == 'APPROXIMATE') {
       Drupal.net_load_route.maps[i].setZoom(10);
     }
     else if (location_type == 'GEOMETRIC_CENTER') {
       Drupal.net_load_route.maps[i].setZoom(12);
     }
     else if (location_type == 'RANGE_INTERPOLATED' || location_type == 'ROOFTOP') {
       Drupal.net_load_route.maps[i].setZoom(16);
     }
   }

   
  /**
   * Set/Update a marker on a map
   *
   * @param latLng
   *   a location (latLng) object from google maps api
   * @param i
   *   the index from the maps array we are working on
   */
  Drupal.net_load_route.setMapMarker_p = function(latLng_p, i) {
    // remove old marker
    if (Drupal.net_load_route.markers_p[i]) {
      Drupal.net_load_route.markers_p[i].setMap(null);
    }
    Drupal.net_load_route.markers_p[i] = new google.maps.Marker({
      map: Drupal.net_load_route.maps[i],
      draggable: Drupal.settings.net_load_route_field.settings.marker_draggable ? true : false,
      // I dont like this much, rather have no effect
      // Will leave it to see if someone notice and shouts at me!
      // If so, will see consider enabling it again
      // animation: google.maps.Animation.DROP,
      position: latLng_p
    });

    google.maps.event.addListener(Drupal.net_load_route.markers_p[i], 'dragend', function(me) {
      Drupal.net_load_route.codeLatLng_p(me.latLng, i, 'marker');
      Drupal.net_load_route.setMapMarker_p(me.latLng, i);
    });

    return false; // if called from <a>-Tag
  }

  Drupal.net_load_route.setMapMarker_d = function(latLng_d, i) {
    
    // remove old marker
    if (Drupal.net_load_route.markers_d[i]) {
      Drupal.net_load_route.markers_d[i].setMap(null);
    }
    Drupal.net_load_route.markers_d[i] = new google.maps.Marker({
      map: Drupal.net_load_route.maps[i],
      draggable: Drupal.settings.net_load_route_field.settings.marker_draggable ? true : false,
      // I dont like this much, rather have no effect
      // Will leave it to see if someone notice and shouts at me!
      // If so, will see consider enabling it again
      // animation: google.maps.Animation.DROP,
      position: latLng_d
    });

    google.maps.event.addListener(Drupal.net_load_route.markers_d[i], 'dragend', function(me) {
      Drupal.net_load_route.codeLatLng_d(me.latLng, i, 'marker');
      Drupal.net_load_route.setMapMarker_d(me.latLng, i);
    });

    return false; // if called from <a>-Tag
  }
 
  /**
   * Get the current user location if one is given
   * @return
   *   Formatted location
   */
  Drupal.net_load_route.getFormattedLocation = function() {
    if (google.loader.ClientLocation.address.country_code == "US" &&
      google.loader.ClientLocation.address.region) {
      return google.loader.ClientLocation.address.city + ", " 
          + google.loader.ClientLocation.address.region.toUpperCase();
    }
    else {
      return  google.loader.ClientLocation.address.city + ", "
          + google.loader.ClientLocation.address.country_code;
    }
  }
 
  /**
   * Clear/Remove the values and the marker
   *
   * @param i
   *   the index from the maps array we are working on
   */
  Drupal.net_load_route.clearLocation_p = function(i) {
    $('#net-load-route-lat-p-' + i + ' input').attr('value', '');
    $('#net-load-route-lat-item-p-' + i + ' .net-load-route-lat-item-value').html('');
    $('#net-load-route-lng-p-' + i + ' input').attr('value', '');
    $('#net-load-route-lng-item-p-' + i + ' .net-load-route-lat-item-value').html('');
    $('#net-load-route-address-p-' + i + ' input').attr('value', '');
    Drupal.net_load_route.markers_p[i].setMap();
  }

  Drupal.net_load_route.clearLocation_d = function(i) {
    $('#net-load-route-lat-d-' + i + ' input').attr('value', '');
    $('#net-load-route-lat-item-d-' + i + ' .net-load-route-lat-item-value').html('');
    $('#net-load-route-lng-d-' + i + ' input').attr('value', '');
    $('#net-load-route-lng-item-d-' + i + ' .net-load-route-lat-item-value').html('');
    $('#net-load-route-address-d-' + i + ' input').attr('value', '');
    Drupal.net_load_route.markers_d[i].setMap();
  }
 
  /**
   * Do something when no location can be found
   *
   * @param supportFlag
   *   Whether the browser supports geolocation or not
   * @param i
   *   the index from the maps array we are working on
   */
  Drupal.net_load_route.handleNoGeolocation = function(supportFlag, i) {
    var siberia = new google.maps.LatLng(60, 105);
    var newyork = new google.maps.LatLng(40.69847032728747, -73.9514422416687);
    if (supportFlag == true) {
      alert(Drupal.t("Geolocation service failed. We've placed you in NewYork."));
      initialLocation = newyork;
    } 
    else {
      alert(Drupal.t("Your browser doesn't support geolocation. We've placed you in Siberia."));
      initialLocation = siberia;
    }
    Drupal.net_load_route.maps[i].setCenter(initialLocation);
    Drupal.net_load_route.setMapMarker_p(newyork, i);
    Drupal.net_load_route.setMapMarker_d(siberia, i);
  }

  Drupal.behaviors.netloadrouteGooglemaps = {
    attach: function(context, settings) {
      geocoder = new google.maps.Geocoder();

      var lat_p;
      var lng_p;
      var latLng_p;
      var lat_d;
      var lng_d;
      var latLng_d;
      var mapOptions;
      var browserSupportFlag =  new Boolean();
      var singleClick;

      window.console.log(Drupal.settings);

      // Work on each map
      $.each(Drupal.settings.net_load_route_field.defaults, function(i, mapDefaults) {
        // Only make this once ;)
        $("#net-load-route-map-" + i).once('net-load-route-googlemaps', function(){

          // Attach listeners
          $('#net-load-route-address-p-' + i + ' input').keypress(function(ev){
            if(ev.which == 13){
              ev.preventDefault();
              Drupal.net_load_route.codeAddress_p(i);
            }
          });
          $('#net-load-route-address-geocode-p-' + i).click(function(e) {
            Drupal.net_load_route.codeAddress_p(i);
          });

          $('#net-load-route-remove-p-' + i).click(function(e) {
            Drupal.net_load_route.clearLocation_p(i);
          });

          $('#net-load-route-address-d-' + i + ' input').keypress(function(ev){
            if(ev.which == 13){
              ev.preventDefault();
              Drupal.net_load_route.codeAddress_d(i);
            }
          });
          $('#net-load-route-address-geocode-d-' + i).click(function(e) {
            Drupal.net_load_route.codeAddress_d(i);
          });

          $('#net-load-route-remove-d-' + i).click(function(e) {
            Drupal.net_load_route.clearLocation_d(i);
          });

          // START: Autodetect clientlocation.
          // First use browser geolocation
          if (navigator.geolocation) {
            browserSupportFlag = true;
            $('#net-load-route-help-p-' + i + ':not(.net-load-route-googlemaps-processed)').addClass('net-load-route-googlemaps-processed').append(Drupal.t(', or use your browser geolocation system by clicking this link') +': <span id="net-load-route-client-location-p-' + i + '" class="net-load-route-client-location">' + Drupal.t('My Location') + '</span>');
            $('#net-load-route-help-d-' + i + ':not(.net-load-route-googlemaps-processed)').addClass('net-load-route-googlemaps-processed').append(Drupal.t(', or use your browser geolocation system by clicking this link') +': <span id="net-load-route-client-location-d-' + i + '" class="net-load-route-client-location">' + Drupal.t('My Location') + '</span>');
            // Set current user location, if available
            $('#net-load-route-client-location-p-' + i + ':not(.net-load-route-googlemaps-processed)').addClass('net-load-route-googlemaps-processed').click(function() {
              navigator.geolocation.getCurrentPosition(function(position) {
                latLng_p = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                Drupal.net_load_route.maps[i].setCenter(latLng_p);
                Drupal.net_load_route.setMapMarker_p(latLng_p, i);
                Drupal.net_load_route.codeLatLng_p(latLng_p, i, 'geocoder');
              }, function() {
                Drupal.net_load_route.handleNoGeolocation(browserSupportFlag, i);
              });
            });
            $('#net-load-route-client-location-d-' + i + ':not(.net-load-route-googlemaps-processed)').addClass('net-load-route-googlemaps-processed').click(function() {
              navigator.geolocation.getCurrentPosition(function(position) {
                latLng_d = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                Drupal.net_load_route.maps[i].setCenter(latLng_d);
                Drupal.net_load_route.setMapMarker_d(latLng_d, i);
                Drupal.net_load_route.codeLatLng_d(latLng_d, i, 'geocoder');
              }, function() {
                Drupal.net_load_route.handleNoGeolocation(browserSupportFlag, i);
              });
            });
          }
          // If browser geolication is not supoprted, try ip location
          else if (google.loader.ClientLocation) {
            //latLng = new google.maps.LatLng(google.loader.ClientLocation.latitude, google.loader.ClientLocation.longitude);
            $('#net-load-route-help-p-' + i + ':not(.net-load-route-googlemaps-processed)').addClass('net-load-route-googlemaps-processed').append(Drupal.t(', or use the IP-based location by clicking this link') +': <span id="net-load-route-client-location-p-' + i + '" class="net-load-route-client-location">' + Drupal.net_load_route.getFormattedLocation() + '</span>');
            $('#net-load-route-help-d-' + i + ':not(.net-load-route-googlemaps-processed)').addClass('net-load-route-googlemaps-processed').append(Drupal.t(', or use the IP-based location by clicking this link') +': <span id="net-load-route-client-location-d-' + i + '" class="net-load-route-client-location">' + Drupal.net_load_route.getFormattedLocation() + '</span>');

            // Set current user location, if available
            $('#net-load-route-client-location-p-' + i + ':not(.net-load-route-googlemaps-processed)').addClass('net-load-route-googlemaps-processed').click(function() {
              latLng_p = new google.maps.LatLng(google.loader.ClientLocation.latitude, google.loader.ClientLocation.longitude);
              Drupal.net_load_route.maps[i].setCenter(latLng_p);
              Drupal.net_load_route.setMapMarker_p(latLng_p, i);
              Drupal.net_load_route.codeLatLng_p(latLng_p, i, 'geocoder');
            });
            $('#net-load-route-client-location-d-' + i + ':not(.net-load-route-googlemaps-processed)').addClass('net-load-route-googlemaps-processed').click(function() {
              latLng_d = new google.maps.LatLng(google.loader.ClientLocation.latitude, google.loader.ClientLocation.longitude);
              Drupal.net_load_route.maps[i].setCenter(latLng_d);
              Drupal.net_load_route.setMapMarker_d(latLng_d, i);
              Drupal.net_load_route.codeLatLng_d(latLng_d, i, 'geocoder');
            });
          }
          // END: Autodetect clientlocation.
          // Get current/default values

          // Get default values
          // This might not be necesarry
          // It can always come from e
          lat_p = $('#net-load-route-lat-p-' + i + ' input').attr('value') == false ? mapDefaults.lat_p : $('#net-load-route-lat-p-' + i + ' input').attr('value');
          lng_p = $('#net-load-route-lng-p-' + i + ' input').attr('value') == false ? mapDefaults.lng_p : $('#net-load-route-lng-p-' + i + ' input').attr('value');
          latLng_p = new google.maps.LatLng(lat_p, lng_p);
          lat_d = $('#net-load-route-lat-d-' + i + ' input').attr('value') == false ? mapDefaults.lat_d : $('#net-load-route-lat-d-' + i + ' input').attr('value');
          lng_d = $('#net-load-route-lng-d-' + i + ' input').attr('value') == false ? mapDefaults.lng_d : $('#net-load-route-lng-d-' + i + ' input').attr('value');
          latLng_d = new google.maps.LatLng(lat_d, lng_d);

          // Set map options
          mapOptions = {
            zoom: 2,
            center: latLng_p,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: (Drupal.settings.net_load_route_field.settings.scrollwheel != undefined) ? Drupal.settings.net_load_route_field.settings.scrollwheel : false
          }

          // Create map
          Drupal.net_load_route.maps[i] = new google.maps.Map(document.getElementById("net-load-route-map-" + i), mapOptions);

          if (lat_p && lng_p) {
            // Set initial marker
            Drupal.net_load_route.codeLatLng_p(latLng_p, i, 'geocoder');
            Drupal.net_load_route.setMapMarker_p(latLng_p, i);
          }
          if (lat_d && lng_d) {
            // Set initial marker
            Drupal.net_load_route.codeLatLng_d(latLng_d, i, 'geocoder');
            Drupal.net_load_route.setMapMarker_d(latLng_d, i);
          }

          // Listener to set marker
          // google.maps.event.addListener(Drupal.net_load_route.maps[i], 'click', function(me) {
          //   // Set a timeOut so that it doesn't execute if dbclick is detected
          //   singleClick = setTimeout(function() {
          //     Drupal.net_load_route.codeLatLng(me.latLng, i, 'marker');
          //     Drupal.net_load_route.setMapMarker(me.latLng, i);
          //   }, 500);
          // });

          // // Detect double click to avoid setting marker
          // google.maps.event.addListener(Drupal.net_load_route.maps[i], 'dblclick', function(me) {
          //   clearTimeout(singleClick);
          // });
        })
      });
    }
  };
})(jQuery);
