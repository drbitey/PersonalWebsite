google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

var button1 = new Boolean(true);

function drawChart(depth) {
	var data = google.visualization.arrayToDataTable([
		['Type', 'Data'],
		['Option 1', 1],
		['Option 2', 1],
		['Option 3', 1],
		['Option 4', 1],
		['Option 5', 1]
	]);

	var options = {
			'title':'Test', 
			'width':550, 
			'height':400,
			'is3D':depth
		};
	var chart = new google.visualization.PieChart(document.getElementById('piechart'));
	chart.draw(data, options);
}
function swap3d() {
	if (Boolean(button1)){
		button1 = false;
	}
	else {
		button1 = true;
	}
	drawChart(swap3d);
}