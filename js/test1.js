function hurt(divid) {
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
	});
}

function shake(divid) {
	var tmpdiv = $("#" + divid);
	for (var i = 1; 4 >= i; i++) {
		tmpdiv.animate({
			left: "+=5"
		}, 40);
		tmpdiv.animate({
			left: "-=5"
		}, 40);
	}
}

function showHPChange(divid, number) {
	var tmpdiv = $("#" + divid);
	var Y = tmpdiv.offset().top;
	var X = tmpdiv.offset().left;

	let hpdiv = $("<div></div>");
	hpdiv.addClass("hp_change");
	hpdiv.css("left", X);
	hpdiv.css("top", Y - 20);
	hpdiv.text("-" + number);
	setTimeout(function() {
		hpdiv.appendTo("body");
		setTimeout(function() {
			hpdiv.remove();
		}, 200);
	}, 200);
}

function beHurt(divid, number) {
	hurt(divid);
	shake(divid);
	showHPChange(divid, number);
}

function att() {
	let tmpdivs = $(".mon_checked");
	if(tmpdivs.length ==0){
		alert("no Mon is checked!");
	}else if(tmpdivs.length ==1){
		let tmpdiv = tmpdivs[0];
		beHurt($(tmpdiv).attr("id"),20);
	}else{
		console.log("the number of mon_checked is bigger than 1!");
	}
}

$(function() {
	$("#btn1").on("click", function() {
		att();
	});
	$("#btn2").on("click", function() {
	});
	$("#btn3").on("click", function() {
	});

	$(".mon").on("click", function() {
		$(".mon").removeClass("mon_checked");
		$(this).addClass("mon_checked");
	});
});
