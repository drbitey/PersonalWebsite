var countDownDate = new Date("May 12, 2024 12:34:32").getTime();
//const text = document.getElementById("countdown").innerHTML;
var interval = 11; //time between checking time in ms
if ((countDownDate - new Date().getTime()) < 0) {} //do nothing if date has passed
else{
	var x = setInterval(function() {
		var now = new Date().getTime();
		var distance = countDownDate - now;
		if ((distance / (1000 * 60 * 60 * 24 * 365)) < 0) {var years = Math.ceil(distance / (1000 * 60 * 60 * 24 * 365))}
		else {var years = Math.floor(distance / (1000 * 60 * 60 * 24 * 365))}
		var days = Math.floor(distance % (1000 * 60 * 60 * 24 * 365) / (1000 * 60 * 60 * 24));
		var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		var seconds = ((distance % (1000 * 60)) / 1000).toFixed(3);
		document.getElementById("countdown").innerHTML = years + "y " + days + "d " + hours + "h " + minutes + "m " + seconds + "s";
	}, interval);
}
