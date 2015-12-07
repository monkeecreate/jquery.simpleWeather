/*! simpleWeather v4 - http://simpleweatherjs.com */

/* USAGE
  window.weather = new simpleWeather(document.getElementById('simple-weather'), {
    location: 'Boston, MA',
    unit: 'f'
  });
*/

function simpleWeather(element, options) {
  'use strict';

  function getAltTemp(unit, temp) {
    if (unit === 'f') {
      return Math.round((5.0 / 9.0) * (temp - 32.0));
    } else {
      return Math.round((9.0 / 5.0) * temp + 32.0);
    }
  }

  options = options || {};
  options.location = options.location || '';
  options.woeid = options.woeid || '';
  options.unit = options.unit || 'f';
  var now = new Date();
  var apiUrl = 'https://query.yahooapis.com/v1/public/yql?format=json&rnd=' + now.getFullYear() + now.getMonth() + now.getDay() + now.getHours() + '&diagnostics=true&callback=?&q=';

  if (options.location !== '') {
    apiUrl += 'select * from weather.forecast where woeid in (select woeid from geo.placefinder where text="' + options.location + '" and gflags="R" limit 1) and u="' + options.unit + '"';
  } else if (options.woeid !== '') {
    weatherUrl += 'select * from weather.forecast where woeid=' + options.woeid + ' and u="' + options.unit + '"';
  } else {
    /* TODO: Handle no location provided error. */
  }

  var request = new XMLHttpRequest();
  request.open('GET', apiUrl, true);

  request.onload = function() {
    if (this.status >= 200 && this.status < 400) {
      var data = JSON.parse(this.response);
      console.log('Data', data); // data.query.results.channel

      /* TODO: Set weather data from response. var weatherData = ''; */
      /*
        dataElements = document.querySelectorAll('[data-simple-weather]'); // Find all elements with a data attribute meant for simpleWeather.
        console.log(dataElements);

        for (i = 0, len = dataElements.length; i < len; i++) {
          element = dataElements[i];
          element.innerHTML = weatherData[element.dataset.simple-weather]; // Insert the associated weather data.
        }
      */
    } else {
      /* TODO: Handle when the API returns an error. */
    }
  };

  request.onerror = function() {
    /* TODO: Handle a connection error to the service. */
  };

  request.send();
}
