Turn = {
	index: 1,
	turnOwner: "PLAYER",
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
		console.log("TURN " + this.index + " END!");
		this.comTurnStart();
	},
	comTurnEnd: function() {
		console.log("TURN " + this.index + " END!");
		this.playerTurnStart();
	},
	comTurnStart: function() {
		this.turnOwner = "COMPUTER";
		this.index = this.index + 1;
		$(".turn_info_div").text("TURN " + this.index + " " + this.turnOwner);
		initComAtt("div1");
		initComAtt("div2");
		initComAtt("div3");
		Turn.nextAnim();
		// console.log(this.animList);
	},
	playerTurnStart: function() {
		this.turnOwner = "PLAYER";
		this.index = this.index + 1;
		$(".turn_info_div").text("TURN " + this.index + " " + this.turnOwner);
	}
}

function initComAtt(divid) {
	Turn.addAnim(function() {
		comGoAtt(divid,function(){
			Turn.nextAnim();
		});
	});
	Turn.addAnim(function() {
		beHurt("player_div",123,function(){
			Turn.nextAnim();
		});
	});
	
}
