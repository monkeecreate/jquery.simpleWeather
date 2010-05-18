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
 * Version 1.2 - Last updated: May 18 2010
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

			var weatherUrl = 'http://query.yahooapis.com/v1/public/yql?format=json&diagnostics=true&callback=&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&q=';
			if(options.location != '')
				weatherUrl += 'select * from weather.forecast where location in (select id from weather.search where query="'+options.location+'") and u="'+options.unit+'"';
			else if(options.zipcode != '')
				weatherUrl += 'select * from weather.forecast where location in ("'+options.zipcode+'") and u="'+options.unit+'"';
			else {
				options.error("No location given.");
				return false;
			}
						
			$.ajax({
				url: weatherUrl,
				dataType: 'json',
				success: function(data) {
					if(data != null) {
						$.each(data.query.results, function(i, result) {							
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
							else if (wind>0 && wind<23)
								windDirection = "N";
							else if (wind>24 && wind<68)
								windDirection = "NE";
							else if (wind>69 && wind<113)
								windDirection = "E";
							else if (wind>114 && wind<185)
								windDirection = "SE";
							else if (wind>186 && wind<203)
								windDirection = "S";
							else if (wind>204 && wind<248)
								windDirection = "SW";
							else if (wind>249 && wind<293)
								windDirection = "W";
							else if (wind>294 && wind<337)
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
									image: "http://l.yimg.com/a/i/us/nws/weather/gr/"+result.item.forecast[1].code+"d.png",
								},
								city: result.location.city,
								country: result.location.country,
								region: result.location.region,
								updated: result.item.pubDate,
								link: result.item.link,
							};
							
							options.success(weather);
						});
					} else {
						options.error("Weather could not be displayed. Try again.");
					}
				}
			});
			
			return this;
		}		
	});
})(jQuery);