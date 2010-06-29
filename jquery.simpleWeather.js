/*
 * simpleWeather
 * 
 * A simple jQuery plugin to display the weather information
 * for a location. Weather is pulled from the public Yahoo!
 * Weather feed via their api.
 *
 * Developed by James Fleeting <twofivethreetwo@gmail.com>
 * Another project from monkeeCreate <http://monkeecreate.com>
 *
 * Version 1.5 - Last updated: June 29 2010
 */

(function($) {
	$.extend({
		simpleWeather: function(options){
			var options = $.extend({
				zipcode: '76309',
				location: '',
				unit: 'f',
				success: function(weather){},
				error: function(message){}
			}, options);

			var weatherUrl = 'http://query.yahooapis.com/v1/public/yql?format=json&diagnostics=true&callback=?&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&q=';
			if(options.location != '')
				weatherUrl += 'select * from weather.forecast where location in (select id from weather.search where query="'+options.location+'") and u="'+options.unit+'"';
			else if(options.zipcode != '')
				weatherUrl += 'select * from weather.forecast where location in ("'+options.zipcode+'") and u="'+options.unit+'"';
			else {
				options.error("No location given.");
				return false;
			}
						
			$.getJSON(
				weatherUrl,
				function(data) {
					if(data != null && data.query.results != null) {
						$.each(data.query.results, function(i, result) {
							if (result.constructor.toString().indexOf("Array") != -1)
								result = result[0];
														
							currentDate = new Date();
							sunRise = new Date(currentDate.toDateString() +' '+ result.astronomy.sunrise);
							sunSet = new Date(currentDate.toDateString() +' '+ result.astronomy.sunset);
							if (currentDate>sunRise && currentDate<sunSet)
								timeOfDay = 'd'; 
							else
								timeOfDay = 'n';
							
							wind = result.wind.direction;
							if (wind>338)
								windDirection = "N";
							else if (wind>=0 && wind<24)
								windDirection = "N";
							else if (wind>=24 && wind<69)
								windDirection = "NE";
							else if (wind>=69 && wind<114)
								windDirection = "E";
							else if (wind>=114 && wind<186)
								windDirection = "SE";
							else if (wind>=186 && wind<204)
								windDirection = "S";
							else if (wind>=204 && wind<249)
								windDirection = "SW";
							else if (wind>=249 && wind<294)
								windDirection = "W";
							else if (wind>=294 && wind<338)
								windDirection = "NW";
							
							var weather = {					
								title: result.item.title,
								temp: result.item.condition.temp,
								units:{
									temp: result.units.temperature,
									distance: result.units.distance,
									pressure: result.units.pressure,
									speed: result.units.speed
								},
								currently: result.item.condition.text,
								high: result.item.forecast[0].high,
								low: result.item.forecast[0].low,
								forecast: result.item.forecast[0].text,
								wind:{
									chill: result.wind.chill,
									direction: windDirection,
									speed: result.wind.speed
								},
								humidity: result.atmosphere.humidity,
								pressure: result.atmosphere.pressure,
								rising: result.atmosphere.rising,
								visibility: result.atmosphere.visibility,
								sunrise: result.astronomy.sunrise,
								sunset: result.astronomy.sunset,
								description: result.item.description,
								thumbnail: "http://l.yimg.com/a/i/us/nws/weather/gr/"+result.item.condition.code+timeOfDay+"s.png",
								image: "http://l.yimg.com/a/i/us/nws/weather/gr/"+result.item.condition.code+timeOfDay+".png",
								tomorrow:{
									high: result.item.forecast[1].high,
									low: result.item.forecast[1].low,
									forecast: result.item.forecast[1].text,
									date: result.item.forecast[1].date,
									day: result.item.forecast[1].day,
									image: "http://l.yimg.com/a/i/us/nws/weather/gr/"+result.item.forecast[1].code+"d.png"
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
						if (data.query.results == null)
							options.error("Invalid location given.");
						else
							options.error("Weather could not be displayed. Try again.");
					}
				}
			);
			return this;
		}		
	});
})(jQuery);