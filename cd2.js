var countDownDate = new Date("March 28, 2021 00:00:00").getTime();
//const text = document.getElementById("countdown").innerHTML;
var interval = 100; //time between checking time in ms
var x = setInterval(function() {
	var now = new Date().getTime();
	var distance = countDownDate - now;
	var days = Math.floor(distance % (1000 * 60 * 60 * 24 * 365) / (1000 * 60 * 60 * 24));
	var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
	var seconds = ((distance % (1000 * 60)) / 1000).toFixed(0);
	document.getElementById("countdown").innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s";
}, interval);