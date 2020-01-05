var MonData = {};
var CommonUtil = {};
var CardUtil = {};
var MonList = {};
var CardList = {};

Array.prototype.shuffle = function() {
	var array = this;
	var m = array.length,
		t, i;
	while (m) {
		i = Math.floor(Math.random() * m--);
		t = array[m];
		array[m] = array[i];
		array[i] = t;
	}
	return array;
};

FIRE_MON = {
	"name": "火球怪",
	"maxHp": 50, //最大生命
	"maxAc": 50, //最大护甲
	"img": "fire_mon.jpg",
	"actions": [{
		"type": "att",
		"value": "10"
	}, {
		"type": "heal",
		"value": "20"
	}, {
		"type": "arm",
		"value": "15"
	}, {
		"type": "mag",
		"value": "5"
	}]
}

MonData.getComInstance = function(obj) {
	let mon = JSON.parse(JSON.stringify(obj));
	mon.hp = mon.maxHp;
	mon.ac = mon.maxAc;
	mon.status = [];
	return mon;
}
MonData.getPlayerInstance = function() {
	let mon = {};
	mon.name = "PLAYER"
	mon.maxHp = 100;
	mon.maxAc = 100;
	mon.hp = mon.maxHp;
	mon.ac = mon.maxAc;
	mon.img = "player/英雄小子.jpg";
	return mon;
}
/* 
 怪兽或者玩家进行物理攻击
 */
MonData.att = function(attVal, defmon, type) {
	let ret = {
		type: "-hp",
		hurtValue: 0
	};
	if (type == "mag") {
		if (attVal > defmon.hp) {
			ret.hurtValue = defmon.hp;
		} else {
			ret.hurtValue = parseInt(attVal);
		}
		defmon.hp -= ret.hurtValue;
		console.log(defmon.name + "受到" + attVal + "的魔法攻击,HP-" + ret.hurtValue + ",HP=" + defmon.hp);
	} else if (type == "att") {
		defmon.ac -= attVal;
		if (defmon.ac < 0) {
			ret.hurtValue = 0 - defmon.ac;
			ret.type = "-hp";
			defmon.hp -= ret.hurtValue;
			defmon.ac = 0;
			if (defmon.hp < 0) {
				defmon.hp = 0;
			}
			console.log(defmon.name + "受到" + attVal + "的物理攻击,HP-" + ret.hurtValue + ",HP=" + defmon.hp);
		} else {
			ret.hurtValue = attVal;
			ret.type = "-ac";
			console.log(defmon.name + "受到" + attVal + "的物理攻击,AC-" + ret.hurtValue + ",HP=" + defmon.hp);
		}
	} else {
		console.log("other att type todo! ")
	}
	return ret;
}
MonData.heal = function(value, mon) {
	let ret = {
		type: "+hp",
		hurtValue: 0
	}
	ret.hurtValue = parseInt(value);
	let tmpval = mon.maxHp - mon.hp;
	if (ret.hurtValue > tmpval) {
		ret.hurtValue = tmpval;
	}
	mon.hp += ret.hurtValue;
	console.log(mon.name + "得到" + value + "的治疗,HP+" + ret.hurtValue + ",HP=" + mon.hp);
	return ret;
}
MonData.arm = function(value, mon) {
	let ret = {
		type: "+ac",
		hurtValue: 0
	}
	ret.hurtValue = parseInt(value);
	let tmpval = mon.maxAc - mon.ac;
	if (ret.hurtValue > tmpval) {
		ret.hurtValue = tmpval;
	}
	mon.ac += ret.hurtValue;
	console.log(mon.name + "得到" + value + "的武装,AC+" + ret.hurtValue + ",HP=" + mon.hp);
	return ret;
}
MonData.comAct = function(attmon, defmon) {
	let n = attmon.actions.length;
	let i = CommonUtil.randomNum(0, n - 1);
	let o = attmon.actions[i];
	if (o.type == "att" || o.type == "mag") {
		return MonData.att(o.value, defmon, o.type);
	} else if (o.type == "heal") {
		return MonData.heal(o.value, attmon);
	} else if (o.type == "arm") {
		return MonData.arm(o.value, attmon);
	} else {
		console.log("other actions to do ");
	}
}


/* 
 获取uuid
 */
CommonUtil.getUUID = function(length) {
	return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36);
}
/*
获取[minNum, maxNum]之间的随机整数
*/
CommonUtil.randomNum = function(minNum, maxNum) {
	switch (arguments.length) {
		case 1:
			return parseInt(Math.random() * minNum + 1, 10);
			break;
		case 2:
			return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
			break;
		default:
			return 0;
			break;
	}
}

CommonUtil.getDeckStorage = function() {
	return JSON.parse(localStorage.getItem("skycard_deck"));
}

CommonUtil.initDeckStorage = function() {
	let deck = [];
	deck.push(CardUtil.getCardInstance(CARD1));
	deck.push(CardUtil.getCardInstance(CARD1));
	deck.push(CardUtil.getCardInstance(CARD1));
	deck.push(CardUtil.getCardInstance(CARD2));
	deck.push(CardUtil.getCardInstance(CARD2));
	deck.push(CardUtil.getCardInstance(CARD2));
	deck.push(CardUtil.getCardInstance(CARD3));
	deck.push(CardUtil.getCardInstance(CARD3));
	deck.push(CardUtil.getCardInstance(CARD3));
	deck.push(CardUtil.getCardInstance(CARD4));
	deck.push(CardUtil.getCardInstance(CARD4));
	deck.push(CardUtil.getCardInstance(CARD4));
	deck.push(CardUtil.getCardInstance(CARD5));
	deck.push(CardUtil.getCardInstance(CARD5));
	deck.push(CardUtil.getCardInstance(CARD5));
	deck.push(CardUtil.getCardInstance(CARD6));
	deck.push(CardUtil.getCardInstance(CARD6));
	deck.push(CardUtil.getCardInstance(CARD6));
	deck.push(CardUtil.getCardInstance(CARD7));
	deck.push(CardUtil.getCardInstance(CARD7));
	deck.push(CardUtil.getCardInstance(CARD7));
	deck.push(CardUtil.getCardInstance(CARD8));
	deck.push(CardUtil.getCardInstance(CARD8));
	deck.push(CardUtil.getCardInstance(CARD8));
	deck.shuffle();
	localStorage.setItem("skycard_deck", JSON.stringify(deck));
	return deck;
}

CardUtil.getCardInstance = function(obj) {
	let card = JSON.parse(JSON.stringify(obj));
	card.id = CommonUtil.getUUID(8);
	return card;
}


/* 卡牌的初始化数据 */

CARD1 = {
	"name": "传说之剑",
	"type": "attone",
	"value": 15,
	"img": "card/传说之剑.jpg"
}
CARD2 = {
	"name": "电击鞭",
	"type": "attall",
	"value": 8,
	"img": "card/电击鞭.jpg"
}
CARD3 = {
	"name": "恶魔之斧",
	"type": "attone",
	"value": 20,
	"img": "card/恶魔之斧.jpg"
}
CARD4 = {
	"name": "凤凰刃",
	"type": "attone",
	"value": 12,
	"img": "card/凤凰刃.jpg"
}
CARD5 = {
	"name": "钢甲壳",
	"type": "arm",
	"value": 20,
	"img": "card/钢甲壳.jpg"
}
CARD6 = {
	"name": "红色药剂",
	"type": "heal",
	"value": 30,
	"img": "card/红色药剂.jpg"
}
CARD7 = {
	"name": "火球",
	"type": "magall",
	"value": 5,
	"img": "card/火球.jpg"
}
CARD8 = {
	"name": "火炎弹",
	"type": "magone",
	"value": 10,
	"img": "card/火炎弹.jpg"
}







MonList["FIRE_MON"] = FIRE_MON;
CardList["CARD1"] = CARD1;
CardList["CARD2"] = CARD2;
CardList["CARD3"] = CARD3;
CardList["CARD4"] = CARD4;
CardList["CARD5"] = CARD5;
CardList["CARD6"] = CARD6;
CardList["CARD7"] = CARD7;
CardList["CARD8"] = CARD8;
