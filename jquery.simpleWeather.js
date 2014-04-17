/*
 * simpleWeather
 * http://simpleweatherjs.com
 *
 * A simple jQuery plugin to display current weather data
 * for any location and doesn't get in your way.
 *
 * Developed by James Fleeting <@fleetingftw> <http://iwasasuperhero.com>
 * Another project from monkeeCreate <http://monkeecreate.com>
 *
 * Version 2.7.0 - Last updated: April 17 2014
 */
(function($) {
  "use strict";
  $.extend({
    simpleWeather: function(options){
      options = $.extend({
        location: '',
        woeid: '2357536',
        unit: 'f',
        success: function(weather){},
        error: function(message){}
      }, options);

      var now = new Date();
      var weatherUrl = '//query.yahooapis.com/v1/public/yql?format=json&rnd='+now.getFullYear()+now.getMonth()+now.getDay()+now.getHours()+'&diagnostics=true&callback=?&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&q=';
      if(options.location !== '') {
        weatherUrl += 'select * from weather.forecast where woeid in (select woeid from geo.placefinder where text="'+options.location+'" and gflags="R") and u="'+options.unit+'"';
      } else if(options.woeid !== '') {
        weatherUrl += 'select * from weather.forecast where woeid='+options.woeid+' and u="'+options.unit+'"';
      } else {
        options.error("Could not retrieve weather due to an invalid location.");
        return false;
      }

      $.getJSON(
        encodeURI(weatherUrl),
        function(data) {
          if(data !== null && data.query !== null && data.query.results !== null && data.query.results.channel.description !== 'Yahoo! Weather Error') {
            $.each(data.query.results, function(i, result) {
              if (result.constructor.toString().indexOf("Array") !== -1) {
                result = result[0];
              }

              var altTemps = [], heatIndex, images = [];
              var compass = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW', 'N'];
              var windDirection = compass[Math.round(result.wind.direction / 22.5)];

              if(result.item.condition.temp < 80 && result.atmosphere.humidity < 40) {
                heatIndex = -42.379+2.04901523*result.item.condition.temp+10.14333127*result.atmosphere.humidity-0.22475541*result.item.condition.temp*result.atmosphere.humidity-6.83783*(Math.pow(10, -3))*(Math.pow(result.item.condition.temp, 2))-5.481717*(Math.pow(10, -2))*(Math.pow(result.atmosphere.humidity, 2))+1.22874*(Math.pow(10, -3))*(Math.pow(result.item.condition.temp, 2))*result.atmosphere.humidity+8.5282*(Math.pow(10, -4))*result.item.condition.temp*(Math.pow(result.atmosphere.humidity, 2))-1.99*(Math.pow(10, -6))*(Math.pow(result.item.condition.temp, 2))*(Math.pow(result.atmosphere.humidity,2));
              } else {
                heatIndex = result.item.condition.temp;
              }

              if(options.unit === "f") {
                altTemps.unit = "c";
                altTemps.temp = Math.round((5.0/9.0)*(result.item.condition.temp-32.0));
                altTemps.high = Math.round((5.0/9.0)*(result.item.forecast[0].high-32.0));
                altTemps.low = Math.round((5.0/9.0)*(result.item.forecast[0].low-32.0));
                altTemps.forecastOneHigh = Math.round((5.0/9.0)*(result.item.forecast[1].high-32.0));
                altTemps.forecastOneLow = Math.round((5.0/9.0)*(result.item.forecast[1].low-32.0));
                altTemps.forecastTwoHigh = Math.round((5.0/9.0)*(result.item.forecast[2].high-32.0));
                altTemps.forecastTwoLow = Math.round((5.0/9.0)*(result.item.forecast[2].low-32.0));
                altTemps.forecastThreeHigh = Math.round((5.0/9.0)*(result.item.forecast[3].high-32.0));
                altTemps.forecastThreeLow = Math.round((5.0/9.0)*(result.item.forecast[3].low-32.0));
                altTemps.forecastFourHigh = Math.round((5.0/9.0)*(result.item.forecast[4].high-32.0));
                altTemps.forecastFourLow = Math.round((5.0/9.0)*(result.item.forecast[4].low-32.0));
              } else {
                altTemps.unit = "f";
                altTemps.temp = Math.round((9.0/5.0)*result.item.condition.temp+32.0);
                altTemps.high = Math.round((9.0/5.0)*result.item.forecast[0].high+32.0);
                altTemps.low = Math.round((9.0/5.0)*result.item.forecast[0].low+32.0);
                altTemps.forecastOneHigh = Math.round((9.0/5.0)*(result.item.forecast[1].high+32.0));
                altTemps.forecastOneLow = Math.round((9.0/5.0)*(result.item.forecast[1].low+32.0));
                altTemps.forecastTwoHigh = Math.round((9.0/5.0)*(result.item.forecast[2].high+32.0));
                altTemps.forecastTwoLow = Math.round((9.0/5.0)*(result.item.forecast[2].low+32.0));
                altTemps.forecastThreeHigh = Math.round((9.0/5.0)*(result.item.forecast[3].high+32.0));
                altTemps.forecastThreeLow = Math.round((9.0/5.0)*(result.item.forecast[3].low+32.0));
                altTemps.forecastFourHigh = Math.round((9.0/5.0)*(result.item.forecast[4].high+32.0));
                altTemps.forecastFourLow = Math.round((9.0/5.0)*(result.item.forecast[4].low+32.0));
              }

              if(result.item.condition.code == "3200") {
                images.thumbnail = "//s.yimg.com/os/mit/media/m/weather/images/icons/l/44d-100567.png";
                images.image = "//s.yimg.com/os/mit/media/m/weather/images/icons/l/44d-100567.png";
              } else {
                images.thumbnail = "//l.yimg.com/a/i/us/nws/weather/gr/"+result.item.condition.code+"ds.png";
                images.image = "//l.yimg.com/a/i/us/nws/weather/gr/"+result.item.condition.code+"d.png";
              }

              if(result.item.forecast[1].code == "3200")
                images.forecastOne = "//s.yimg.com/os/mit/media/m/weather/images/icons/l/44d-100567.png";
              else
                images.forecastOne = "//l.yimg.com/a/i/us/nws/weather/gr/"+result.item.forecast[1].code+"d.png";

              if(result.item.forecast[2].code == "3200")
                images.forecastTwo = "//s.yimg.com/os/mit/media/m/weather/images/icons/l/44d-100567.png";
              else
                images.forecastTwo = "//l.yimg.com/a/i/us/nws/weather/gr/"+result.item.forecast[2].code+"d.png";

              if(result.item.forecast[3].code == "3200")
                images.forecastThree = "//s.yimg.com/os/mit/media/m/weather/images/icons/l/44d-100567.png";
              else
                images.forecastThree = "//l.yimg.com/a/i/us/nws/weather/gr/"+result.item.forecast[3].code+"d.png";

              if(result.item.forecast[4].code == "3200")
                images.forecastFour = "//s.yimg.com/os/mit/media/m/weather/images/icons/l/44d-100567.png";
              else
                images.forecastFour = "//l.yimg.com/a/i/us/nws/weather/gr/"+result.item.forecast[4].code+"d.png";

              var weather = {
                title: result.item.title,
                temp: result.item.condition.temp,
                tempAlt: altTemps.temp,
                code: result.item.condition.code,
                todayCode: result.item.forecast[0].code,
                units:{
                  temp: result.units.temperature,
                  distance: result.units.distance,
                  pressure: result.units.pressure,
                  speed: result.units.speed,
                  tempAlt: altTemps.unit
                },
                currently: result.item.condition.text,
                high: result.item.forecast[0].high,
                highAlt: altTemps.high,
                low: result.item.forecast[0].low,
                lowAlt: altTemps.low,
                forecast: result.item.forecast[0].text,
                wind:{
                  chill: result.wind.chill,
                  direction: windDirection,
                  speed: result.wind.speed
                },
                humidity: result.atmosphere.humidity,
                heatindex: heatIndex,
                pressure: result.atmosphere.pressure,
                rising: result.atmosphere.rising,
                visibility: result.atmosphere.visibility,
                sunrise: result.astronomy.sunrise,
                sunset: result.astronomy.sunset,
                description: result.item.description,
                thumbnail: images.thumbnail,
                image: images.image,
                tomorrow:{
                  high: result.item.forecast[1].high,
                  highAlt: altTemps.forecastOneHigh,
                  low: result.item.forecast[1].low,
                  lowAlt: altTemps.forecastOneLow,
                  forecast: result.item.forecast[1].text,
                  code: result.item.forecast[1].code,
                  date: result.item.forecast[1].date,
                  day: result.item.forecast[1].day,
                  image: images.forecastOne
                },
                forecasts:{
                  one:{
                    high: result.item.forecast[1].high,
                    highAlt: altTemps.forecastOneHigh,
                    low: result.item.forecast[1].low,
                    lowAlt: altTemps.forecastOneLow,
                    forecast: result.item.forecast[1].text,
                    code: result.item.forecast[1].code,
                    date: result.item.forecast[1].date,
                    day: result.item.forecast[1].day,
                    image: images.forecastOne
                  },
                  two:{
                    high: result.item.forecast[2].high,
                    highAlt: altTemps.forecastTwoHigh,
                    low: result.item.forecast[2].low,
                    lowAlt: altTemps.forecastTwoLow,
                    forecast: result.item.forecast[2].text,
                    code: result.item.forecast[2].code,
                    date: result.item.forecast[2].date,
                    day: result.item.forecast[2].day,
                    image: images.forecastTwo
                  },
                  three:{
                    high: result.item.forecast[3].high,
                    highAlt: altTemps.forecastThreeHigh,
                    low: result.item.forecast[3].low,
                    lowAlt: altTemps.forecastThreeLow,
                    forecast: result.item.forecast[3].text,
                    code: result.item.forecast[3].code,
                    date: result.item.forecast[3].date,
                    day: result.item.forecast[3].day,
                    image: images.forecastThree
                  },
                  four:{
                    high: result.item.forecast[4].high,
                    highAlt: altTemps.forecastFourHigh,
                    low: result.item.forecast[4].low,
                    lowAlt: altTemps.forecastFourLow,
                    forecast: result.item.forecast[4].text,
                    code: result.item.forecast[4].code,
                    date: result.item.forecast[4].date,
                    day: result.item.forecast[4].day,
                    image: images.forecastFour
                  },
                },
                city: result.location.city,
                country: result.location.country,
                region: result.location.region,
                updated: result.item.pubDate,
                link: result.item.link
              };

              options.success(weather);
            });
          } else {
            if (data.query.results === null) {
              options.error("An invalid WOEID or location was provided.");
            } else {
              options.error("There was an error retrieving the latest weather information. Please try again.");
            }
          }
        }
      );
      return this;
    }
  });
})(jQuery);
