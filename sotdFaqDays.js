var startDate = new Date("February 5, 2022 00:00:00").getTime();
var now = new Date().getTime();
var distance = startDate - now;
var days = Math.abs(Math.ceil(Math.floor(distance % (1000 * 60 * 60 * 24 * 365) / (1000 * 60 * 60 * 24))));
document.getElementById("h4_gray_cd").innerHTML = "As of today, there is a total of " + days + " entries since February 5, 2022.";