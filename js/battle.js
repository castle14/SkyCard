var mon1 = null;
var mon2 = null;
var mon3 = null;
var player = null;
var checkedCardInfo = null;
var tmptasks = CommonUtil.getTaskState();
var tmpRequest = CommonUtil.getRequest();
var tmptaskname = tmpRequest["taskname"] ? tmpRequest["taskname"] : "task1";

function comMonBeHurt(divid) {
	if ($("#" + divid).css('display') == "none") {
		return;
	}
	Turn.addAnim(function() {
		let ret = null;
		if (checkedCardInfo.type == "attone" || checkedCardInfo.type == "attall") {
			ret = MonData.att(parseInt(checkedCardInfo.value), getMonObjFromDivID(divid), "att");
		} else if (checkedCardInfo.type == "magone" || checkedCardInfo.type == "magall") {
			ret = MonData.att(parseInt(checkedCardInfo.value), getMonObjFromDivID(divid), "mag");
		} else if (checkedCardInfo.type == "arm") {
			ret = MonData.arm(parseInt(checkedCardInfo.value), player);
		} else if (checkedCardInfo.type == "heal") {
			ret = MonData.heal(parseInt(checkedCardInfo.value), player);
		} else {
			console.log("comMonBeHurt: other act type to do!");
		}
		if (ret.type == "-hp") {
			Anim.beHurt(divid, ret.hurtValue, function() {
				refreshMonDiv(divid, getMonObjFromDivID(divid));
				Turn.nextAnim();
			});
		} else if (ret.type == "-ac") {
			Anim.beShielded(divid, ret.hurtValue, function() {
				refreshMonDiv(divid, getMonObjFromDivID(divid));
				Turn.nextAnim();
			});
		} else if (ret.type == "+hp") {
			Anim.beHealed("player_div", ret.hurtValue, function() {
				refreshMonDiv("player_div", player);
				Turn.nextAnim();
			});
		} else if (ret.type == "+ac") {
			Anim.beArmed("player_div", ret.hurtValue, function() {
				refreshMonDiv("player_div", player);
				Turn.nextAnim();
			});
		} else {
			console.log("comMonBeHurt: other act type to do!");
		}
	});
}

function playerAttAll() {
	if (checkedCardInfo == null) {
		return;
	}

	Turn.addAnim(function() {
		Anim.playerGoAct("player_div", function() {
			Turn.nextAnim();
		});
	});

	comMonBeHurt("div1");
	comMonBeHurt("div2");
	comMonBeHurt("div3");
	Turn.nextAnim();
}

function getMonObjFromDivID(divid) {
	if (divid == "div1") {
		return mon1;
	} else if (divid == "div2") {
		return mon2;
	} else if (divid == "div3") {
		return mon3;
	} else if (divid == "player_div") {
		return player;
	} else {
		console.log("no monster obj for the divid.")
	}
}

function playerAttOne() {
	let tmpdivs = $(".mon_checked");
	if (tmpdivs.length == 0) {
		alert("你需要选择一个目标!");
		return 0;
	} else if (tmpdivs.length == 1) {
		let divid = $(tmpdivs[0]).attr("id");
		Turn.addAnim(function() {
			Anim.playerGoAct("player_div", function() {
				Turn.nextAnim();
			});
		});
		comMonBeHurt(divid);
		Turn.nextAnim();
		return 1;
	} else {
		console.log("the number of mon_checked is bigger than 1!");
		return 0;
	}
}

function refreshMonDiv(divid, monData) {
	let hpPct = monData.hp / monData.maxHp * 100;
	let acPct = monData.ac / monData.maxAc * 100;
	let tmpdiv = $("#" + divid);
	tmpdiv.find(".hp_number").css("width", hpPct + "%");
	tmpdiv.find(".shield_number").css("width", acPct + "%");
	tmpdiv.find(".state_bar").text(monData.name);
	if (monData.hp == 0) {
		if (divid == "div1" || divid == "div2" || divid == "div3") {
			$("#" + divid).removeClass("mon_checked");
			$("#" + divid).hide();
			Turn.comCounter -= 1;
			if (Turn.comCounter == 0) {
				tmptasks[tmptaskname].isComplete = "yes";
				CommonUtil.saveTaskState(tmptasks);
				let gmif = CommonUtil.getGameInfo();
				gmif.win_counter += 1;
				// gmif.opportunity_counter +=1;
				let random_card = CardUtil.getRandomCard();
				gmif.extra_cards.push(random_card);
				let tmp_star_number = mon1.star + mon2.star + mon3.star;
				gmif.star_counter += tmp_star_number;
				CommonUtil.saveGameInfo(gmif);

				alert("^_^挑战成功!STAR+" + tmp_star_number + "!\n你获得了卡片[" + random_card.name + "]");
				location.href = "tasklist.html";
			}
		} else if (divid == "player_div") {
			let gmif = CommonUtil.getGameInfo();
			gmif.lose_counter += 1;
			CommonUtil.saveGameInfo(gmif);
			alert("o(╥﹏╥)o挑战失败!");
			location.href = "tasklist.html";
		}
	}
}

function refreshHandCardsDiv(handcards) {
	$(".card").each(function(index) {
		$(this).removeClass("card_checked");
		$(this).attr("id", handcards[index].id).attr("name", handcards[index].name).attr("type", handcards[index].type).attr(
			"value", handcards[index].value);
		$(this).find("img").attr("src", "../img/" + handcards[index].img);
		$(this).find(".card_name_div").text(handcards[index].name);
		$(this).find(".card_desc_div").text(CommonUtil.getAtkType(handcards[index].type) + "·" + handcards[index].value);
	});
	$("#deck_info").text("DECK:" + Turn.deck.length + " UESD:" + Turn.discardList.length);
	checkedCardInfo = null;
	refreshAttInfoBar();

}



function initMonDiv(divid, monData) {
	refreshMonDiv(divid, monData);
	$("#" + divid).find("img").attr("src", "../img/" + monData.img);
}

function initMonAndPlayer() {


	if (!tmptasks[tmptaskname]) {
		alert("找不到这个任务");
	}
	let monNameList = tmptasks[tmptaskname].taskcontent;

	mon1 = MonData.getComInstance(MonList[monNameList[0]]);
	mon1.name = mon1.name + "1";
	initMonDiv("div1", mon1);
	mon2 = MonData.getComInstance(MonList[monNameList[1]]);
	mon2.name = mon2.name + "2";
	initMonDiv("div2", mon2);
	mon3 = MonData.getComInstance(MonList[monNameList[2]]);
	mon3.name = mon3.name + "3";
	initMonDiv("div3", mon3);

	player = CommonUtil.getPlayerStorage();
	Turn.deck = CommonUtil.getDeckStorage().shuffle();
	for (let i = 0; i < 5; i++) {
		let tmpcard = Turn.deck.pop();
		Turn.handCardList.push(tmpcard);
	}
	refreshHandCardsDiv(Turn.handCardList);
	refreshEnergyInfo();
	initMonDiv("player_div", player);
}

function refreshAttInfoBar() {
	if (checkedCardInfo == null) {
		$("#att_info").text("----");
	} else {
		$("#att_info").html("「" + checkedCardInfo.name + "」×" + checkedCardInfo.counter +
			"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + CommonUtil.getAtkType(checkedCardInfo.type) + "·" + checkedCardInfo.value);
	}
}

function refreshEnergyInfo() {
	$("#energy_info span").text(Turn.chainCounter);
}

function initClick() {
	$("#btn1").on("click", function() {
		if (checkedCardInfo == null) {
			return;
		}
		if (checkedCardInfo.type == "attall" || checkedCardInfo.type == "magall") {
			playerAttAll();
		} else if (checkedCardInfo.type == "arm" || checkedCardInfo.type == "heal") {
			Turn.addAnim(function() {
				Anim.playerGoAct("player_div", function() {
					Turn.nextAnim();
				});
			});
			comMonBeHurt("player_div");
			Turn.nextAnim();
		} else {
			if (playerAttOne() == 0) { //没有目标怪兽
				return;
			}
		}
		let tmplist = Turn.handCardList;
		let _chainCounter = $(".card_checked").length - 1;
		Turn.chainCounter += _chainCounter;
		$(".card_checked").each(function(index) {
			let tmpid = $(this).attr("id");
			tmplist.forEach(function(item, index, arr) {
				if (item.id == tmpid) {
					Turn.discardList.push(item);
					arr.splice(index, 1);
					let tmpcard = null;
					if (Turn.deck.length == 0) {
						console.log("!!!!DECK is EMPTY!!!!");
						Turn.deck = Turn.discardList;
						Turn.deck.shuffle();
						Turn.discardList = [];
					}
					tmpcard = Turn.deck.pop();
					tmplist.push(tmpcard);
				}
			});
		});
		$(this).hide();
		$("#btn3").hide();
		$("#energy_info").hide();
		// refreshHandCardsDiv(Turn.handCardList);

	});

	$("#btn2").on("click", function() {
		let r = confirm("你确定要离开这场战斗？");
		if (r == true) {
			history.back();
		} else {

		}
	});

	$("#btn3").on("click", function() {
		let effect_name = player.effect;
		if (!RoleEffect[effect_name]) {
			alert("这个角色没有技能!");
			return;
		}
		if (RoleEffect[effect_name].type == "attone" || RoleEffect[effect_name].type == "magone") {
			let tmpdivs = $(".mon_checked");
			if (tmpdivs.length == 0 || tmpdivs.length > 1) {
				alert("你需要选择一个目标!");
				return;
			}
		}

		if (Turn.chainCounter < 6) {
			alert("你的连击能量不足!");
			return;
		}
		Turn.chainCounter = 0;
		checkedCardInfo = RoleEffect[effect_name].effect(player);
		if (checkedCardInfo.type == "attall" || checkedCardInfo.type == "magall") {
			playerAttAll();
		} else if (checkedCardInfo.type == "arm" || checkedCardInfo.type == "heal") {
			Turn.addAnim(function() {
				Anim.playerGoAct("player_div", function() {
					Turn.nextAnim();
				});
			});
			comMonBeHurt("player_div");
			Turn.nextAnim();
		} else {
			playerAttOne()
		}
		refreshMonDiv("player_div", player);
		refreshEnergyInfo();
		$("#btn1").hide();
		$("#energy_info").hide();
		$(this).hide();
	});

	$(".mon").on("click", function() {
		$(".mon").removeClass("mon_checked");
		$(this).addClass("mon_checked");
	});
	$(".card").on("click", function() {
		if ($(this).hasClass("card_checked")) {
			$(this).removeClass("card_checked");
			if ($(".card_checked").length == 0) {
				checkedCardInfo = null;
			} else {
				checkedCardInfo.value -= $(this).attr("value");
				checkedCardInfo.counter -= 1;
			}
		} else {
			if (checkedCardInfo == null || $(this).attr("name") != checkedCardInfo.name) {
				checkedCardInfo = {};
				checkedCardInfo.name = $(this).attr("name");
				checkedCardInfo.type = $(this).attr("type");
				checkedCardInfo.value = parseInt($(this).attr("value"));
				checkedCardInfo.counter = 1;
				$(".card").removeClass("card_checked");
				$(this).addClass("card_checked");
			} else {
				checkedCardInfo.value += parseInt($(this).attr("value"));
				checkedCardInfo.counter += 1;
				$(this).addClass("card_checked");
			}
		}
		refreshAttInfoBar();
	});
}

$(function() {
	initMonAndPlayer();
	initClick();
});
