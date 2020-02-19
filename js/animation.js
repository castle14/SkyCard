var Anim = {}

Anim.hurt = function(divid, fn) {
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
Anim.arm = function(divid, fn) {
	let tmpdiv = $("#" + divid);
	var Y = tmpdiv.offset().top;
	var X = tmpdiv.offset().left;

	let blooddiv = $("<div></div>");
	blooddiv.addClass("arm");
	blooddiv.css("left", X);
	blooddiv.css("top", Y + 110);

	blooddiv.appendTo("body");
	blooddiv.animate({
		top: "-=110"
	}, 300, function() {
		blooddiv.remove();
		if (fn != null && fn != undefined) {
			fn();
		}
	});
}
Anim.heal = function(divid, fn) {
	let tmpdiv = $("#" + divid);
	var Y = tmpdiv.offset().top;
	var X = tmpdiv.offset().left;

	let blooddiv = $("<div></div>");
	blooddiv.addClass("heal");
	blooddiv.css("left", X);
	blooddiv.css("top", Y + 110);

	blooddiv.appendTo("body");
	blooddiv.animate({
		top: "-=110"
	}, 300, function() {
		blooddiv.remove();
		if (fn != null && fn != undefined) {
			fn();
		}
	});
}
Anim.shake = function(divid, fn) {
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

Anim.showHPChange = function(divid, hurtnumber, fn) {
	Anim.showValue(divid, "HP - " + hurtnumber, fn)
}

Anim.showValue = function(divid, text, fn) {
	var tmpdiv = $("#" + divid);
	var Y = tmpdiv.offset().top;
	var X = tmpdiv.offset().left;

	let hpdiv = $("<div></div>");
	hpdiv.addClass("hp_change");
	hpdiv.css("left", X);
	hpdiv.css("top", Y - 18);
	hpdiv.text(text);
	setTimeout(function() {
		hpdiv.appendTo("body");
		setTimeout(function() {
			hpdiv.remove();
			// Turn.nextAnim();
			if (fn != null && fn != undefined) {
				fn();
			}
		}, 400);
	}, 150);
}
/* 
受到伤害,hp减少的动画效果 
 */
Anim.beHurt = function(divid, value, fn) {
	Anim.hurt(divid);
	Anim.shake(divid);
	Anim.showHPChange(divid, value, fn);
}
/* 
受到伤害,护甲减少的动画效果 
 */
Anim.beShielded = function(divid, value, fn) {
	Anim.hurt(divid);
	Anim.shake(divid);
	Anim.showValue(divid, "AC - " + value, fn)
}
/* 
 治疗自己,生命值增加
 */
Anim.beHealed = function(divid, value, fn) {
	Anim.heal(divid);
	Anim.showValue(divid, "HP + " + value, fn)
}
/* 
 武装自己,护甲增加
 */
Anim.beArmed = function(divid, value, fn) {
	Anim.arm(divid);
	Anim.showValue(divid, "AC + " + value, fn)
}


Anim.playerGoAct = function(divid, fn) {
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

Anim.comGoAct = function(divid, fn) {
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

Anim.beShockedByEle = function(divid, fn) {
	let tmpdiv = $("#" + divid);
	let Y = tmpdiv.offset().top;
	let X = tmpdiv.offset().left;

	let i = 0;
	let tmpY1 = Y + 40;
	let tmpY2 = Y + 40;
	let eleArr = [
		1, 1, 1, 1, 1, -1, -1, -1, -1, -1,
		-1, -1, -1, -1, 1, 1, 1, 1, 1, -1,
		1, 1, -1, -1, -1, -1, -1, 1, 1, 1,
		1, 1, 1, 1, -1, -1, -1, -1, -1, 1,
		1, 1, 1, 1, 1, -1, -1, -1, -1, -1,
		-1, -1, -1, -1, 1, 1, 1, 1, 1, -1,
		1, 1, -1, -1, -1, -1, -1, 1, 1, 1,
		1, 1, 1, 1, -1, -1, -1, -1, -1, 1
	];
	let intervalId = setInterval(function() {
		let rdm = Math.ceil(Math.random() * 10);
		tmpY1 += eleArr[i] * 3;
		tmpY2 -= eleArr[i] * 3;
		let blooddiv1 = $("<div></div>");
		blooddiv1.addClass("ele");
		blooddiv1.css("left", X + i);
		blooddiv1.css("top", Y + 40 - Math.abs(tmpY1 - tmpY2) / 2);
		blooddiv1.css("height", Math.abs(tmpY1 - tmpY2));
		blooddiv1.appendTo("body");
		blooddiv1.fadeOut(300, function() {
			blooddiv1.remove();
		});

		/* setTimeout(function() {
			blooddiv1.remove();
		}, 300); */
		i++;
		if (i >= 79) {
			clearInterval(intervalId);
			// $(".ele").remove();
			if (fn != null && fn != undefined) {
				fn();
			}
		}
	}, 5);
}

Anim.prepareToEffect = function(divid, fn) {
	let tmpdiv = $("#" + divid);
	let Y = tmpdiv.offset().top;
	let X = tmpdiv.offset().left;

	let blooddiv1 = $("<div></div>");
	blooddiv1.addClass("eff_light");
	blooddiv1.css("left", X);
	blooddiv1.css("top", Y);
	blooddiv1.appendTo("body");
	blooddiv1.animate({
			left: "+=38",
			top: "+=60"
		}, 500)
		.animate({
			top: "-=60"
		}, 500, function() {
			blooddiv1.remove();
		});
	let blooddiv2 = $("<div></div>");
	blooddiv2.addClass("eff_light");
	blooddiv2.css("left", X+20);
	blooddiv2.css("top", Y);
	blooddiv2.appendTo("body");
	blooddiv2.animate({
			left: "+=18",
			top: "+=60"
		}, 500)
		.animate({
			top: "-=60"
		}, 500, function() {
			blooddiv2.remove();
		});
	let blooddiv3 = $("<div></div>");
	blooddiv3.addClass("eff_light");
	blooddiv3.css("left", X+60);
	blooddiv3.css("top", Y);
	blooddiv3.appendTo("body");
	blooddiv3.animate({
			left: "-=18",
			top: "+=60"
		}, 500)
		.animate({
			top: "-=60"
		}, 500, function() {
			blooddiv3.remove();
		});
	let blooddiv4 = $("<div></div>");
	blooddiv4.addClass("eff_light");
	blooddiv4.css("left", X+80);
	blooddiv4.css("top", Y);
	blooddiv4.appendTo("body");
	blooddiv4.animate({
			left: "-=38",
			top: "+=60"
		}, 500)
		.animate({
			top: "-=60"
		}, 500, function() {
			blooddiv4.remove();
		});
}
