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
	blooddiv.css("top", Y+110);

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
	blooddiv.css("top", Y+110);

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
	Anim.showValue(divid, "HP - "+hurtnumber, fn)
}

Anim.showValue = function(divid,text,fn){
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
		}, 350);
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
	Anim.showValue(divid, "AC - "+value, fn)
}
/* 
 治疗自己,生命值增加
 */
Anim.beHealed = function(divid, value, fn) {
	Anim.heal(divid);
	Anim.showValue(divid, "HP + "+value, fn)
}
/* 
 武装自己,护甲增加
 */
Anim.beArmed = function(divid, value, fn) {
	Anim.arm(divid);
	Anim.showValue(divid, "AC + "+value, fn)
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
