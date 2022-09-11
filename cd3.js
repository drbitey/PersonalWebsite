var countDownDate1 = new Date("March 27, 2023 04:33:12").getTime();
//const text = document.getElementById("countdown1").innerHTML;
var interval1 = 71; //time between checking time in ms
var x1 = setInterval(function() {
	var now1 = new Date().getTime();
	var distance1 = countDownDate1 - now1;
	var days1 = Math.floor(distance1 % (1000 * 60 * 60 * 24 * 365) / (1000 * 60 * 60 * 24));
	var hours1 = Math.floor((distance1 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	var minutes1 = Math.floor((distance1 % (1000 * 60 * 60)) / (1000 * 60));
	var seconds1 = ((distance1 % (1000 * 60)) / 1000).toFixed(0);
	var ms1 = (distance1 % (1000));
	document.getElementById("cd").innerHTML = days1 + "d " + hours1 + "h " + minutes1 + "m " + seconds1 + "s " + ms1 + "ms";
}, interval1);