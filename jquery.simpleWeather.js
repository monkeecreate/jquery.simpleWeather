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
				location: '76309',
				tempUnit: 'f',
				success: function(weather){},
				error: function(message){}
			}, options);

			var weatherUrl = 'http://query.yahooapis.com/v1/public/yql?format=json&diagnostics=true&callback=&q=';
			if(options.location != '')
				weatherUrl += 'select * from weather.forecast where location in ("'+options.location+'") and u="'+options.tempUnit+'"';
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
							weather["units"] = [];
							weather["units"]["temp"] = result.units.temperature;
							weather["units"]["distance"] = result.units.distance;
							weather["units"]["pressure"] = result.units.pressure;
							weather["units"]["speed"] = result.units.speed;
							weather["currently"] = result.item.condition.text;
							weather["high"] = result.item.forecast[0].high;
							weather["low"] = result.item.forecast[0].low;
							weather["forecast"] = result.item.forecast[0].text;
							weather["wind"] = [];
							weather["wind"]["chill"] = result.wind.chill;
							weather["wind"]["direction"] = result.wind.direction;
							weather["wind"]["speed"] = result.wind.speed;
							weather["humidity"] = result.atmosphere.humidity;
							weather["pressure"] = result.atmosphere.pressure;
							weather["rising"] = result.atmosphere.rising;
							weather["visibility"] = result.atmosphere.visibility;
							weather["sunrise"] = result.astronomy.sunrise;
							weather["sunset"] = result.astronomy.sunset;
							weather["description"] = result.item.description;
							weather["image"] = "http://l.yimg.com/a/i/us/nws/weather/gr/"+result.item.condition.code+timeOfDay+".png";
							
							weather["tomorrow"] = [];
							weather["tomorrow"]["high"] = result.item.forecast[1].high;
							weather["tomorrow"]["low"] = result.item.forecast[1].low;
							weather["tomorrow"]["forecast"] = result.item.forecast[1].text;
							weather["tomorrow"]["date"] = result.item.forecast[1].date;
							weather["tomorrow"]["day"] = result.item.forecast[1].day;
							weather["tomorrow"]["image"] = "http://l.yimg.com/a/i/us/nws/weather/gr/"+result.item.forecast[1].code+"d.png";
							
							weather["city"] = result.location.city;
							weather["country"] = result.location.country;
							weather["region"] = result.location.region;
							weather["updated"] = result.item.pubDate;
							weather["link"] = result.item.link;
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