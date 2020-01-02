function hurt(divid, fn) {
	let tmpdiv = $("#" + divid);
	var Y = tmpdiv.offset().top;
	var X = tmpdiv.offset().left;

	let blooddiv = $("<div></div>");
	blooddiv.addClass("blood");
	blooddiv.css("left", X);
	blooddiv.css("top", Y);

	blooddiv.appendTo("body");
	blooddiv.animate({
		left: "+=70",
		top: "+=110"
	}, 200, function() {
		blooddiv.remove();
		if (fn != null && fn != undefined) {
			fn();
		}
	});
}

function shake(divid, fn) {
	var tmpdiv = $("#" + divid);
	for (var i = 1; 4 >= i; i++) {
		tmpdiv.animate({
			left: "+=5"
		}, 40);
		tmpdiv.animate({
			left: "-=5"
		}, 40);
	}
	tmpdiv.animate({
		left: "-=0"
	}, 40, function() {
		if (fn != null && fn != undefined) {
			fn();
		}
	});
}

function showHPChange(divid, hurtnumber, fn) {
	var tmpdiv = $("#" + divid);
	var Y = tmpdiv.offset().top;
	var X = tmpdiv.offset().left;

	let hpdiv = $("<div></div>");
	hpdiv.addClass("hp_change");
	hpdiv.css("left", X);
	hpdiv.css("top", Y - 18);
	hpdiv.text("-" + hurtnumber);
	setTimeout(function() {
		hpdiv.appendTo("body");
		setTimeout(function() {
			hpdiv.remove();
			// Turn.nextAnim();
			if (fn != null && fn != undefined) {
				fn();
			}
		}, 350);
	}, 150);
}

function beHurt(divid, hurtnumber, fn) {
	hurt(divid);
	shake(divid);
	showHPChange(divid,hurtnumber,fn);
}

function playerGoAtt(divid,fn) {
	let tmpdiv = $("#" + divid);
	tmpdiv.animate({
		bottom: "+=10"
	}, 100);
	tmpdiv.animate({
		bottom: "-=10"
	}, 100, function() {
		// Turn.nextAnim();
		if (fn != null && fn != undefined) {
			fn();
		}
	});
}

function comGoAtt(divid,fn) {
	let tmpdiv = $("#" + divid);
	tmpdiv.animate({
		top: "+=10"
	}, 100);
	tmpdiv.animate({
		top: "-=10"
	}, 100, function() {
		// Turn.nextAnim();
		if (fn != null && fn != undefined) {
			fn();
		}
	});
}