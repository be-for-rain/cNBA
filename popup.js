
google.load('visualization', '1.0', {'packages':['corechart']});

var name_a;
var name_b;
var scores_a = new Array();
var scores_b = new Array();
var events = new Array();

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
	var msg = response.answer;
	var data = getData(msg);
	var title_str = getTitle();
	drawChart(title_str, data);
	});
});




function getTitle() {
	return name_a + "vs" + name_b + "  " + scores_a[0] + "-" + scores_b[0];
}

function parseMsg(str) {
	var elements = str.split(" ");
	name_a = elements[0];
	name_b = elements[1];
	var len = parseInt(elements[2]);
	for (var i = 0; i < len; i++) {
		var msg = elements[i+3].split('-');
		scores_a.push(parseInt(msg[0]));
		scores_b.push(parseInt(msg[1]));
	}
	for (var i = 0; i < len; i++) {
		events.push(elements[len+3+i]);
	}
}

function refineMsg() {
	for (var i = 0; i < events.length; i++) 
		for (var j = i+1; j < events.length; j++) {
			if (scores_a[i] < scores_a[j] || (scores_a[i] == scores_a[j] && scores_b[i] < scores_b[j])) {
				var tmp = scores_a[i];
				scores_a[i] = scores_a[j];
				scores_a[j] = tmp;
				tmp = scores_b[i];
				scores_b[i] = scores_b[j];
				scores_b[j] = tmp;
				tmp = events[i];
				events[i] = events[j];
				events[j] = tmp;				
			}
		}
}

function getData(str) {
	var data = new google.visualization.DataTable();
	parseMsg(str);
	refineMsg();
	data.addColumn('string', 'event');
	data.addColumn('number', name_a);
	data.addColumn('number', name_b);
	var pre_score_a = 0, pre_score_b = 0;
	for (var i = events.length-1; i >= 0; i--) {
		if (scores_a[i] >= pre_score_a && scores_b[i] >= pre_score_b){ 
			data.addRow([events[i], scores_a[i], scores_b[i]]);
			pre_score_a = scores_a[i];
			pre_score_b = scores_b[i];
		}
	}
	return data;
}

function drawChart(title_str, data) {
	var options = {
		title: title_str,
		titleTextStyle : {fontSize: 16},
		hAxis : {textStyle: {color: 'white'}},//to hide the fancy event descriptions
		width: 800,
		height: 500
	}
	var chart = new google.visualization.LineChart(document.getElementById('visualization'));
	chart.draw(data, options);
}
