Turn = {
	comCounter: 3,
	chainCounter: 3,
	index: 1, //回合数
	turnOwner: "PLAYER",
	deck: [],
	handCardList: [],
	discardList: [],
	animList: [],
	addAnim: function(fn) {
		this.animList.push(fn);
	},
	nextAnim: function() {
		let fn = this.animList.shift();
		if (fn == null || fn == undefined) {
			if (this.turnOwner == "PLAYER") {
				console.log("player's turn can be finished.");
				this.playTurnEnd();
			} else if (this.turnOwner == "COMPUTER") {
				this.envEffectStep();
			} else {
				console.log("computer's turn can be finished.");
				this.comTurnEnd();
			}
		} else {
			fn();
		}
	},
	playTurnEnd: function() {
		console.log("【TURN " + this.index + " END】");
		refreshHandCardsDiv(this.handCardList);
		refreshEnergyInfo();

		setTimeout(function() {
			Turn.comTurnStart();
		}, 550);

	},
	comTurnEnd: function() {
		console.log("【TURN " + this.index + " END】");
		this.playerTurnStart();
		//场地的效果发动

	},
	comTurnStart: function() {
		if (this.index > 10) {
			mon1.actions[0].value += 1;
			mon2.actions[0].value += 1;
			mon3.actions[0].value += 1;
		}
		this.turnOwner = "COMPUTER";
		this.index = this.index + 1;
		$(".turn_info_div").text("TURN " + this.index);
		$(".owner_info_div").text(this.turnOwner);
		initComAtt("div1");
		initComAtt("div2");
		initComAtt("div3");

		Turn.nextAnim();
	},
	envEffectStep: function() {
		this.turnOwner = "ENV";
		envEffect();
		Turn.nextAnim();
	},
	playerTurnStart: function() {
		this.turnOwner = "PLAYER";
		this.index = this.index + 1;
		$(".turn_info_div").text("TURN " + this.index);
		$(".owner_info_div").text(this.turnOwner);
		$("#btn1").fadeIn();
		$("#btn3").fadeIn();
		$("#energy_info").fadeIn();
		refreshEnergyInfo();
	}
}
/* 
 场地的效果发动
 */
function envEffect() {
	env.target = env.effect(player, mon1, mon2, mon3, Turn);
	if (env.target == "all") {
		Turn.addAnim(function() {
			Anim.showGlobalInfo("场地的效果发动", function() {
				Turn.nextAnim();
				MySound.fieldEffect();
			});
		});
		Turn.addAnim(function() {
			if ($("#div1").css('display') != "none") {
				Anim.showPointLine(null, "div1");
			}
			if ($("#div2").css('display') != "none") {
				Anim.showPointLine(null, "div2");
			}
			if ($("#div3").css('display') != "none") {
				Anim.showPointLine(null, "div3");
			}
			Anim.showPointLine(null, "player_div", () => {
				Turn.nextAnim();
			});
		});
		Turn.addAnim(function() {
			if ($("#div1").css('display') != "none") {
				Anim.shake("div1", () => {
					refreshMonDiv("div1", mon1);
				});
			}
			if ($("#div2").css('display') != "none") {
				Anim.shake("div2", () => {
					refreshMonDiv("div2", mon2);
				});
			}
			if ($("#div3").css('display') != "none") {
				Anim.shake("div3", () => {
					refreshMonDiv("div3", mon3);
				});
			}
			Anim.shake("player_div", () => {
				refreshMonDiv("player_div", player);
				Turn.nextAnim();
			});
		});
	} else if (env.target == null) {

	} else {
		Turn.addAnim(function() {
			Anim.showGlobalInfo("场地的效果发动", function() {
				Turn.nextAnim();
				MySound.fieldEffect();
			});
		});
		Turn.addAnim(function() {
			Anim.showPointLine(null, env.target.div, () => {
				Turn.nextAnim();
			});
		});
		Turn.addAnim(function() {
			Anim.shake(env.target.div, () => {
				refreshMonDiv(env.target.div, env.target);
				Turn.nextAnim();
			});
		});
	}
}

function initComAtt(divid) {
	if ($("#" + divid).css('display') == "none") {
		return;
	}
	Turn.addAnim(function() {
		Anim.comGoAct(divid, function() {
			Turn.nextAnim();
		});
	});
	Turn.addAnim(function() {
		let ret = MonData.comAct(getMonObjFromDivID(divid), player);
		MySound.monAtk();
		if (ret.type == "-hp") {
			Anim.beHurt("player_div", ret.hurtValue, function() {
				refreshMonDiv("player_div", player);
				// console.log(player);
				Turn.nextAnim();
				MySound.playerBeHurt();
			});
		} else if (ret.type == "-ac") {
			Anim.beShielded("player_div", ret.hurtValue, function() {
				refreshMonDiv("player_div", player);
				Turn.nextAnim();
				MySound.MonDef();
			});
		} else if (ret.type == "+hp") {
			Anim.beHealed(divid, ret.hurtValue, function() {
				refreshMonDiv(divid, getMonObjFromDivID(divid));
				Turn.nextAnim();
				MySound.heal();
			});
		} else if (ret.type == "+ac") {
			Anim.beArmed(divid, ret.hurtValue, function() {
				refreshMonDiv(divid, getMonObjFromDivID(divid));
				Turn.nextAnim();
				MySound.armed();
			});
		} else {
			console.log("other actions to do ")
		}
	});
}
