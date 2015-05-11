
chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
			var str = "";
			str += getTeamNames();
			str += getScores();
			str += getEventDescriptions();

			if (request.greeting == "hello") {
				sendResponse({answer: str});
			}
		}
		);



function getTeamNames() {
	var str = "";
	var teams = document.getElementsByClassName('leftcol');
	for (var i = 1; i < 3; i++) {
		str += teams[i].innerHTML + " ";
	}
	return str;
}

function getScores() {
	var str = "";
	var scores = document.getElementsByClassName('pscore');
	str += scores.length + " ";
	for (var i = 0; i < scores.length; i++){
		str += scores[i].innerHTML + " ";
	}
	return str;
}

function getEventDescriptions() {
	var str = "";
	var events = document.getElementsByClassName('desc');
	str += events.length + " ";
	for (var i = 0; i < events.length; i++) {
		//ignore some descriptions
		var tmp = events[i].innerText;
		var tmpary = tmp.split(" ");
		str += tmpary[0] + " ";
	}
	return str;
}

