/*
 * simpleWeather
 * 
 * A simple jQuery plugin to display the weather information
 * for a locations. Weather is pulled from the public Yahoo!
 * Weather feed via their api.
 *
 * Developed by James Fleeting <twofivethreetwo@gmail.com>
 * Another project from monkeeCreate <http://monkeecreate.com>
 *
 * Version 1.0 - Last updated: May 16 2010
 */

(function($) {
	$.extend({
		simpleWeather: function(options){
			var options = $.extend({
				locationId: '76309',
				tempUnit: 'f',
				success: function(weather){},
				error: function(message){}
			}, options);

			var weatherUrl = 'http://query.yahooapis.com/v1/public/yql?format=json&diagnostics=true&callback=&q=';
			if(options.locationId != '')
				weatherUrl += 'select * from weather.forecast where location in ("'+options.locationId+'") and u="'+options.tempUnit+'"';
			else {
				options.error("No location given.");
				return false;
			}
						
			$.ajax({
				url: weatherUrl,
				dataType: 'json',
				success: function(data) {
					if(data != null) {
						var weather = [];
						
						$.each(data.query.results, function(i, result) {
							currentDate = new Date();
							sunRise = new Date(currentDate.toDateString() +' '+ result.astronomy.sunrise);
							sunSet = new Date(currentDate.toDateString() +' '+ result.astronomy.sunset);
							if (currentDate>sunRise && currentDate<sunSet)
								timeOfDay = 'd'; 
							else
								timeOfDay = 'n';
							
							weather["title"] = result.item.title;
							weather["temp"] = result.item.condition.temp;
							weather["unit"] = result.units.temperature;
							weather["image"] = "http://l.yimg.com/a/i/us/nws/weather/gr/"+result.item.condition.code+timeOfDay+".png";
							weather["city"] = result.location.city;
							weather["country"] = result.location.country;
							weather["region"] = result.location.region;
							weather["updated"] = result.item.pubDate;
						});
						
						options.success(weather);
					} else {
						options.error("Bad request.");
					}
				}
			});
			
			return this;
		}		
	});
})(jQuery);