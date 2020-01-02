
function AttOne(attinfo) {
	Turn.addAnim(function() {
		playerGoAtt(attinfo.attdivid,function(){
			Turn.nextAnim();
		});
	});
	Turn.addAnim(function() {
		beHurt(attinfo.defdivid,attinfo.hurtnumber,function(){
			Turn.nextAnim();
		});
	});
	Turn.nextAnim();
}

function playerAttAll(hurtnumber) {
	Turn.addAnim(function() {
		playerGoAtt("player_div",function(){
			Turn.nextAnim();
		});
	});
	Turn.addAnim(function() {
		beHurt("div1",hurtnumber,function(){
			Turn.nextAnim();
		});
	});
	Turn.addAnim(function() {
		beHurt("div2",hurtnumber,function(){
			Turn.nextAnim();
		});
	});
	Turn.addAnim(function() {
		beHurt("div3",hurtnumber,function(){
			Turn.nextAnim();
		});
	});
	Turn.nextAnim();
}

function playerAttOne(hurtnumber) {
	let tmpdivs = $(".mon_checked");
	if (tmpdivs.length == 0) {
		alert("no Mon is checked!");
	} else if (tmpdivs.length == 1) {
		let attinfo = {
			attdivid: "player_div",
			defdivid: $(tmpdivs[0]).attr("id"),
			hurtnumber: hurtnumber
		}
		AttOne(attinfo);
	} else {
		console.log("the number of mon_checked is bigger than 1!");
	}
}

$(function() {
	$("#btn1").on("click", function() {
		playerAttOne("20");
	});
	$("#btn2").on("click", function() {
		playerAttAll("20");
	});

	$(".mon").on("click", function() {
		$(".mon").removeClass("mon_checked");
		$(this).addClass("mon_checked");
	});
	$(".card").on("click", function() {
		$(this).toggleClass("card_checked");
	});
});
