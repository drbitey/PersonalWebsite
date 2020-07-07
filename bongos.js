var open = new Audio('sfx/bongo1.wav');
var low1 = new Audio('sfx/bongo2.wav');
var low2 = new Audio('sfx/bongo4.wav');
var rand = Math.floor(Math.random() * 3)
function low() {
	if (rand < 1) {
		low1.play();
	}
	else if (rand < 2) {
		low2.play();
	}
	else {
		open.play();
	}
}
function high() {
    var high = new Audio('sfx/bongo3.wav');
    rand = Math.floor(Math.random() * 2)
    if (rand < 1) {
        high.play();
    }
    else {
        open.play();
    }
}
