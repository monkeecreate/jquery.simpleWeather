$(document).ready(function() {
	prettyPrint();
	
	$.simpleWeather({
		zipcode: '76309',
		unit: 'f',
		success: function(weather) {
			html = '<h2>'+weather.city+', '+weather.region+'</h2>';
			html += '<img style="float:left;" width="125px" src="'+weather.image+'">';
			html += '<p>'+weather.temp+'&deg; '+weather.units.temp+'<br /><span>'+weather.currently+'</span></p>';
			html += '<a href="'+weather.link+'">View Forecast &raquo;</a>';
			
			$("#weather").html(html);
		},
		error: function(error) {
			$("#weather").html('<p>'+error+'</p>');
		}
	});
});