Turn = {
	comCounter: 3,
	index: 1,
	turnOwner: "PLAYER",
	deck:[],
	handCardList:[],
	discardList:[],
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
		this.comTurnStart();
	},
	comTurnEnd: function() {
		console.log("【TURN " + this.index + " END】");
		this.playerTurnStart();
	},
	comTurnStart: function() {
		if(this.index > 10){
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
		// console.log(this.animList);
	},
	playerTurnStart: function() {
		this.turnOwner = "PLAYER";
		this.index = this.index + 1;
		$(".turn_info_div").text("TURN " + this.index);
		$(".owner_info_div").text(this.turnOwner);
	}
}

function initComAtt(divid) {
	if($("#"+divid).css('display') == "none"){
		return;
	}
	Turn.addAnim(function() {
		Anim.comGoAct(divid, function() {
			Turn.nextAnim();
		});
	});
	Turn.addAnim(function() {
		let ret = MonData.comAct(getMonObjFromDivID(divid),player);
		if(ret.type == "-hp"){
			Anim.beHurt("player_div", ret.hurtValue, function() {
				refreshMonDiv("player_div", player);
				// console.log(player);
				Turn.nextAnim();
			});
		}else if(ret.type == "-ac"){
			Anim.beShielded("player_div", ret.hurtValue, function() {
				refreshMonDiv("player_div", player);
				Turn.nextAnim();
			});
		}else if(ret.type == "+hp"){
			Anim.beHealed(divid, ret.hurtValue, function() {
				refreshMonDiv(divid, getMonObjFromDivID(divid));
				Turn.nextAnim();
			});
		}else if(ret.type == "+ac"){
			Anim.beArmed(divid, ret.hurtValue, function() {
				refreshMonDiv(divid, getMonObjFromDivID(divid));
				Turn.nextAnim();
			});
		}else{
			console.log("other actions to do ")
		}
	});
}
