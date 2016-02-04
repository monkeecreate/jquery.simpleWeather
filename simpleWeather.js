/*! simpleWeather v4 - http://simpleweatherjs.com */

/*
OPTIONS
  location: location name (city, region, state) or lat,long coordinates
  woeid: unique location woeid
  unit: c or f
  format: attributes or callback
    attributes will use existing elements and data-attributes to insert the weather data.
    callback will return the weather data for you to use or insert as you want.

USAGE
  window.weather = simpleWeather('weather', {
    location: 'Boston, MA',
    format: 'attributes'
  }, function(weather, forecast) {
    console.log('Callback', weather, forecast);
  });
*/

function simpleWeather(element, options, callback) {
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
  options.format = options.format || 'attributes';
  var now = new Date();
  var apiUrl = 'https://query.yahooapis.com/v1/public/yql?format=json&rnd=' + now.getFullYear() + now.getMonth() + now.getDay() + now.getHours() + '&q=';

  if (options.location !== '') {
    /* If latitude/longitude coordinates, need to format a little different. */
    var location = '';
    if(/^(\-?\d+(\.\d+)?),\s*(\-?\d+(\.\d+)?)$/.test(options.location)) {
      location = '(' + options.location + ')';
    } else {
      location = options.location;
    }

    apiUrl += 'select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="' + location + '") and u="' + options.unit + '"';
  } else if (options.woeid !== '') {
    weatherUrl += 'select * from weather.forecast where woeid=' + options.woeid + ' and u="' + options.unit + '"';
  } else {
    /* TODO: Handle no location provided error. */
  }

  var request = new XMLHttpRequest();
  request.open('GET', apiUrl, true);

  request.onload = function() {
    if (this.status >= 200 && this.status < 400) {
      var response = JSON.parse(this.response);
      var data = response.query.results.channel;

      var compass = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW', 'N'],
      image404 = 'https://s.yimg.com/os/mit/media/m/weather/images/icons/l/44d-100567.png';

      var weatherData = new Object();
      weatherData.title = data.item.title;
      weatherData.currentTemp = data.item.condition.temp;
      weatherData.code = data.item.condition.code;
      weatherData.todayCode = data.item.forecast[0].code;
      weatherData.currently = data.item.condition.text;
      weatherData.high = data.item.forecast[0].high;
      weatherData.low = data.item.forecast[0].low;
      weatherData.text = data.item.forecast[0].text;
      weatherData.description = data.item.description;
      weatherData.unit = options.unit;
      weatherData.humidity = data.atmosphere.humidity;
      weatherData.pressure = data.atmosphere.pressure;
      weatherData.rising = data.atmosphere.rising;
      weatherData.visibility = data.visibility;
      weatherData.sunrise = data.astronomy.sunrise;
      weatherData.sunset = data.astronomy.sunset;
      weatherData.city = data.location.city;
      weatherData.country = data.location.country;
      weatherData.region = data.location.region;
      weatherData.updated = data.item.pubDate;
      weatherData.link = data.item.link;
      weatherData.unitTemp = data.units.temperature;
      weatherData.unitDistance = data.units.distrance;
      weatherData.unitPressure = data.units.pressure;
      weatherData.unitSpeed = data.units.speed;
      weatherData.windSpeed = data.wind.speed;
      weatherData.windChill = data.wind.chill;
      weatherData.windDirection = compass[Math.round(data.wind.direction / 22.5)]

      if(data.item.condition.temp < 80 && data.atmosphere.humidity < 40) {
        weatherData.heatIndex = -42.379+2.04901523*data.item.condition.temp+10.14333127*data.atmosphere.humidity-0.22475541*data.item.condition.temp*data.atmosphere.humidity-6.83783*(Math.pow(10, -3))*(Math.pow(data.item.condition.temp, 2))-5.481717*(Math.pow(10, -2))*(Math.pow(data.atmosphere.humidity, 2))+1.22874*(Math.pow(10, -3))*(Math.pow(data.item.condition.temp, 2))*data.atmosphere.humidity+8.5282*(Math.pow(10, -4))*data.item.condition.temp*(Math.pow(data.atmosphere.humidity, 2))-1.99*(Math.pow(10, -6))*(Math.pow(data.item.condition.temp, 2))*(Math.pow(data.atmosphere.humidity,2));
      } else {
        weatherData.heatIndex = data.item.condition.temp;
      }

      if(data.item.condition.code == '3200') {
        weatherData.thumbnail = image404;
        weatherData.image = image404;
      } else {
        weatherData.thumbnail = 'https://s.yimg.com/zz/combo?a/i/us/nws/weather/gr/' + data.item.condition.code + 'ds.png';
        weatherData.image = 'https://s.yimg.com/zz/combo?a/i/us/nws/weather/gr/' + data.item.condition.code + 'd.png';
      }

      weatherData.altCurrentTemp = getAltTemp(options.unit, data.item.condition.temp);
      weatherData.altHigh = getAltTemp(options.unit, data.item.forecast[0].high);
      weatherData.altLow = getAltTemp(options.unit, data.item.forecast[0].low);

      if(options.unit === 'f') {
        weatherData.altUnit = 'c';
      } else {
        weatherData.altUnit = 'f';
      }

      /* TODO: Add forecast. */
      var weatherForecast = [],
      forecast;
      for(var i=0;i<data.item.forecast.length;i++) {
        forecast = data.item.forecast[i];
        forecast.alt = {high: getAltTemp(options.unit, data.item.forecast[i].high), low: getAltTemp(options.unit, data.item.forecast[i].low)};

        if(data.item.forecast[i].code == "3200") {
          forecast.thumbnail = image404;
          forecast.image = image404;
        } else {
          forecast.thumbnail = 'https://s.yimg.com/zz/combo?a/i/us/nws/weather/gr/' + data.item.forecast[i].code + 'ds.png';
          forecast.image = 'https://s.yimg.com/zz/combo?a/i/us/nws/weather/gr/' + data.item.forecast[i].code + 'd.png';
        }

        weatherForecast.push(forecast);
      }

      if (options.format === 'attributes') {
        var dataElements = document.querySelectorAll('#' + element + ' [data-simple-weather]'); // Find all elements with a data attribute meant for simpleWeather.

        for (var i = 0, len = dataElements.length; i < len; i++) {
          var dataElement = dataElements[i];

          if (dataElement.dataset.simpleWeather === "forecast") {
            dataElement.innerHTML = weatherForecast[dataElement.dataset.forecast][dataElement.dataset.forecastValue];
          } else {
            dataElement.innerHTML = weatherData[dataElement.dataset.simpleWeather];
          }
        }
      } else {
        callback(weatherData, weatherForecast);
      }
    } else {
      /* TODO: Handle when the API returns an error. */
    }
  };

  request.onerror = function() {
    /* TODO: Handle a connection error to the service. */
  };

  request.send();
}
