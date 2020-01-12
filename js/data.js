var MonData = {};
var CommonUtil = {};
var CardUtil = {};
var MonList = {};
var CardList = {};
var TaskList = {};
var GameInfo = {};
var GameSTD = {
	StarCostMaxHp: 5,
	StarCostHp: 3,
	StarCostMaxAc: 3,
	StarCostAc: 2
};
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


MonData.getComInstance = function(obj) {
	let mon = JSON.parse(JSON.stringify(obj));
	mon.hp = mon.maxHp;
	mon.ac = mon.maxAc;
	mon.status = [];
	return mon;
}
/* MonData.getPlayerInstance = function() {
	let mon = {};
	mon.name = "PLAYER"
	mon.maxHp = 100;
	mon.maxAc = 100;
	mon.hp = mon.maxHp;
	mon.ac = mon.maxAc;
	mon.img = "player/英雄小子.jpg";
	return mon;
} */
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
CommonUtil.clearStorage = function() {
	localStorage.clear();
}
CommonUtil.getDeckStorage = function() {
	return JSON.parse(localStorage.getItem("skycard_deck"));
}
CommonUtil.getPlayerStorage = function() {
	return JSON.parse(localStorage.getItem("skycard_player"));
}
CommonUtil.saveDeckStorage = function(dck) {
	localStorage.removeItem('skycard_deck');
	localStorage.setItem("skycard_deck", JSON.stringify(dck));
}
CommonUtil.savePlayerStorage = function(ply) {
	localStorage.removeItem('skycard_player');
	localStorage.setItem("skycard_player", JSON.stringify(ply));
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
CommonUtil.initPlayerStorage = function() {
	let mon = {};
	mon.name = "PLAYER";
	mon.maxHp = 100;
	mon.maxAc = 100;
	mon.hp = mon.maxHp;
	mon.ac = mon.maxAc;
	mon.img = "player/英雄小子.jpg";
	localStorage.setItem("skycard_player", JSON.stringify(mon));
	return mon;
}
CommonUtil.saveTaskState = function(tsklst) {
	localStorage.removeItem('skycard_tasklist');
	localStorage.setItem("skycard_tasklist", JSON.stringify(tsklst));
}
CommonUtil.getTaskState = function() {
	return JSON.parse(localStorage.getItem("skycard_tasklist"));
}
CommonUtil.initTaskState = function() {
	return localStorage.setItem("skycard_tasklist", JSON.stringify(TaskList));
}

CommonUtil.saveGameInfo = function(gmif) {
	localStorage.removeItem('skycard_game_info');
	localStorage.setItem("skycard_game_info", JSON.stringify(gmif));
}
CommonUtil.getGameInfo = function() {
	let gmif = JSON.parse(localStorage.getItem("skycard_game_info"));
	if (gmif) {
		return gmif;
	} else {
		return GameInfo;
	}

}


CommonUtil.getRequest = function() {
	var url = location.search; //获取url中"?"符后的字串
	var theRequest = new Object();
	if (url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for (var i = 0; i < strs.length; i++) {
			theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
		}
	}
	return theRequest;
}

CardUtil.getCardInstance = function(obj) {
	let card = JSON.parse(JSON.stringify(obj));
	card.id = CommonUtil.getUUID(8);
	return card;
}
CardUtil.getRandomCard = function() {
	let tmpcards = [];
	for (i in CardList) {
		tmpcards.push(CardList[i]);
	}
	tmpcards.shuffle();
	tmpcards.shuffle();
	tmpcards.shuffle();
	return CardUtil.getCardInstance(tmpcards.pop());
}

/* 怪兽的初始化数据 */
FIRE_MON = {
	"name": "火球怪",
	"maxHp": 50, //最大生命
	"maxAc": 50, //最大护甲
	"star": 2,
	"img": "fire_mon.jpg",
	"actions": [{
		"type": "att",
		"value": 10
	}, {
		"type": "heal",
		"value": 20
	}, {
		"type": "arm",
		"value": 15
	}, {
		"type": "mag",
		"value": 5
	}]
}
HAT_MON = {
	"name": "帽子怪",
	"maxHp": 25, //最大生命
	"maxAc": 75, //最大护甲
	"star": 2,
	"img": "hat_mon.jpg",
	"actions": [{
		"type": "att",
		"value": 5
	}, {
		"type": "heal",
		"value": 10
	}, {
		"type": "arm",
		"value": 25
	}, {
		"type": "mag",
		"value": 2
	}]
}
MON_DIAMOND_1 = {
	"name": "红钻鼠",
	"maxHp": 25, //最大生命
	"maxAc": 25, //最大护甲
	"star": 1,
	"img": "diamond/2183.jpg",
	"actions": [{
		"type": "att",
		"value": 5
	}, {
		"type": "att",
		"value": 6
	}, {
		"type": "att",
		"value": 7
	}, {
		"type": "att",
		"value": 8
	}]
}
MON_DIAMOND_2 = {
	"name": "紫钻猫",
	"maxHp": 50, //最大生命
	"maxAc": 25, //最大护甲
	"star": 1,
	"img": "diamond/2182.jpg",
	"actions": [{
		"type": "att",
		"value": 5
	}, {
		"type": "att",
		"value": 8
	}, {
		"type": "att",
		"value": 10
	}, {
		"type": "att",
		"value": 12
	}]
}
MON_DIAMOND_3 = {
	"name": "蓝钻鹰",
	"maxHp": 50, //最大生命
	"maxAc": 50, //最大护甲
	"star": 2,
	"img": "diamond/2192.jpg",
	"actions": [{
		"type": "att",
		"value": 10
	}, {
		"type": "att",
		"value": 12
	}, {
		"type": "att",
		"value": 15
	}, {
		"type": "att",
		"value": 18
	}]
}

MON_DIAMOND_4 = {
	"name": "绿钻龟",
	"maxHp": 25, //最大生命
	"maxAc": 100, //最大护甲
	"star": 2,
	"img": "diamond/2181.jpg",
	"actions": [{
		"type": "att",
		"value": 10
	}, {
		"type": "arm",
		"value": 20
	}, {
		"type": "arm",
		"value": 15
	}, {
		"type": "att",
		"value": 12
	}]
}

MON_DIAMOND_5 = {
	"name": "黄钻虎",
	"maxHp": 75, //最大生命
	"maxAc": 75, //最大护甲
	"star": 3,
	"img": "diamond/2180.jpg",
	"actions": [{
		"type": "att",
		"value": 15
	}, {
		"type": "att",
		"value": 16
	}, {
		"type": "att",
		"value": 17
	}, {
		"type": "att",
		"value": 20
	}]
}
MON_DIAMOND_6 = {
	"name": "琥珀猛犸",
	"maxHp": 150, //最大生命
	"maxAc": 25, //最大护甲
	"star": 3,
	"img": "diamond/2174.jpg",
	"actions": [{
		"type": "att",
		"value": 15
	}, {
		"type": "att",
		"value": 16
	}, {
		"type": "att",
		"value": 20
	}, {
		"type": "heal",
		"value": 40
	}]
}
MON_DIAMOND_7 = {
	"name": "青玉天马",
	"maxHp": 100, //最大生命
	"maxAc": 100, //最大护甲
	"star": 4,
	"img": "diamond/2188.jpg",
	"actions": [{
		"type": "att",
		"value": 20
	}, {
		"type": "mag",
		"value": 10
	}, {
		"type": "mag",
		"value": 11
	}, {
		"type": "mag",
		"value": 15
	}]
}

MON_DIAMOND_8 = {
	"name": "彩虹龙",
	"maxHp": 200, //最大生命
	"maxAc": 200, //最大护甲
	"star": 8,
	"img": "diamond/2662.jpg",
	"actions": [{
		"type": "att",
		"value": 20
	}, {
		"type": "att",
		"value": 25
	}, {
		"type": "mag",
		"value": 10
	}, {
		"type": "mag",
		"value": 13
	}, {
		"type": "heal",
		"value": 75
	}, {
		"type": "arm",
		"value": 50
	}]
}
MON_ALIEN_1 = {
	"name": "灰色外星人",
	"maxHp": 25, //最大生命
	"maxAc": 25, //最大护甲
	"star": 1,
	"img": "alien/灰色外星人.jpg",
	"actions": [{
		"type": "att",
		"value": 10
	}, {
		"type": "mag",
		"value": 10
	}, {
		"type": "mag",
		"value": 12
	}, {
		"type": "att",
		"value": 15
	}]
}
MON_ALIEN_2 = {
	"name": "熔岩外星人",
	"maxHp": 150, //最大生命
	"maxAc": 150, //最大护甲
	"star": 6,
	"img": "alien/熔岩外星人.jpg",
	"actions": [{
		"type": "att",
		"value": 28
	}, {
		"type": "mag",
		"value": 14
	}, {
		"type": "mag",
		"value": 16
	}, {
		"type": "att",
		"value": 32
	}, {
		"type": "heal",
		"value": 50
	}, {
		"type": "arm",
		"value": 70
	}]
}


/* 卡牌的初始化数据 */

CARD1 = {
	"name": "传说之剑",
	"type": "attone",
	"value": 100,
	"img": "card/传说之剑.jpg"
}
CARD2 = {
	"name": "电击鞭",
	"type": "attall",
	"value": 18,
	"img": "card/电击鞭.jpg"
}
CARD3 = {
	"name": "恶魔之斧",
	"type": "attone",
	"value": 25,
	"img": "card/恶魔之斧.jpg"
}
CARD4 = {
	"name": "凤凰刃",
	"type": "attone",
	"value": 20,
	"img": "card/凤凰刃.jpg"
}
CARD5 = {
	"name": "钢甲壳",
	"type": "arm",
	"value": 40,
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
CARD9 = {
	"name": "灵魂之斧",
	"type": "attone",
	"value": 35,
	"img": "card/灵魂之斧.jpg"
}
CARD10 = {
	"name": "麻药",
	"type": "heal",
	"value": 20,
	"img": "card/麻药.jpg"
}
CARD11 = {
	"name": "魔剑",
	"type": "attone",
	"value": 5,
	"img": "card/魔剑.jpg"
}
CARD12 = {
	"name": "破神剑",
	"type": "attone",
	"value": 20,
	"img": "card/破神剑.jpg"
}
CARD13 = {
	"name": "闪电之剑",
	"type": "attone",
	"value": 28,
	"img": "card/闪电之剑.jpg"
}
CARD14 = {
	"name": "圣剑",
	"type": "attone",
	"value": 32,
	"img": "card/圣剑.jpg"
}
CARD15 = {
	"name": "特殊飓风",
	"type": "magone",
	"value": 15,
	"img": "card/特殊飓风.jpg"
}
CARD16 = {
	"name": "天狗羽扇",
	"type": "attone",
	"value": 3,
	"img": "card/天狗羽扇.jpg"
}
CARD17 = {
	"name": "铁斧",
	"type": "attone",
	"value": 18,
	"img": "card/铁斧.jpg"
}
CARD18 = {
	"name": "银之弓矢",
	"type": "attone",
	"value": 30,
	"img": "card/银之弓矢.jpg"
}
CARD19 = {
	"name": "竹光",
	"type": "attone",
	"value": 10,
	"img": "card/竹光.jpg"
}
CARD20 = {
	"name": "宝石爆破",
	"type": "magone",
	"value": 20,
	"img": "card/宝石爆破.jpg"
}
CARD21 = {
	"name": "灼热之枪",
	"type": "attone",
	"value": 24,
	"img": "card/灼热之枪.jpg"
}
CARD22 = {
	"name": "辐射炮",
	"type": "magone",
	"value": 25,
	"img": "card/辐射炮.jpg"
}
CARD23 = {
	"name": "钢铁巨剑",
	"type": "attone",
	"value": 15,
	"img": "card/钢铁巨剑.jpg"
}
CARD24 = {
	"name": "红宝石之光",
	"type": "heal",
	"value": 60,
	"img": "card/红宝石之光.jpg"
}
CARD25 = {
	"name": "卡通锁链",
	"type": "attall",
	"value": 10,
	"img": "card/卡通锁链.jpg"
}
CARD26 = {
	"name": "蓝宝石之光",
	"type": "heal",
	"value": 40,
	"img": "card/蓝宝石之光.jpg"
}
CARD27 = {
	"name": "魔法泡泡",
	"type": "magone",
	"value": 8,
	"img": "card/魔法泡泡.jpg"
}
CARD28 = {
	"name": "魔界之雷",
	"type": "magone",
	"value": 18,
	"img": "card/魔界之雷.jpg"
}
CARD29 = {
	"name": "魔闪光",
	"type": "magall",
	"value": 8,
	"img": "card/魔闪光.jpg"
}
CARD30 = {
	"name": "扰乱三角波",
	"type": "magone",
	"value": 24,
	"img": "card/扰乱三角波.jpg"
}
CARD31 = {
	"name": "神鹰三角波",
	"type": "magone",
	"value": 24,
	"img": "card/神鹰三角波.jpg"
}
CARD32 = {
	"name": "深海锁链",
	"type": "attall",
	"value": 20,
	"img": "card/深海锁链.jpg"
}
CARD33 = {
	"name": "神鹰护甲",
	"type": "arm",
	"value": 60,
	"img": "card/神鹰护甲.jpg"
}
CARD34 = {
	"name": "暗之假面",
	"type": "arm",
	"value": 90,
	"img": "card/暗之假面.jpg"
}
CARD35 = {
	"name": "二重旋风",
	"type": "magall",
	"value": 11,
	"img": "card/二重旋风.jpg"
}
CARD36 = {
	"name": "炽焰飞腾",
	"type": "magall",
	"value": 14,
	"img": "card/炽焰飞腾.jpg"
}
CARD37 = {
	"name": "毁灭之焰",
	"type": "magall",
	"value": 17,
	"img": "card/毁灭之焰.jpg"
}
CARD38 = {
	"name": "雷击",
	"type": "magone",
	"value": 28,
	"img": "card/雷击.jpg"
}
CARD39 = {
	"name": "女神的圣弓",
	"type": "attone",
	"value": 40,
	"img": "card/女神的圣弓.jpg"
}
CARD40 = {
	"name": "闪电漩涡",
	"type": "magall",
	"value": 20,
	"img": "card/闪电漩涡.jpg"
}
CARD41 = {
	"name": "草薙剑",
	"type": "attone",
	"value": 42,
	"img": "card/草薙剑.jpg"
}
CARD42 = {
	"name": "地碎",
	"type": "attone",
	"value": 45,
	"img": "card/地碎.jpg"
}
CARD43 = {
	"name": "电子黑恶爪",
	"type": "attone",
	"value": 38,
	"img": "card/电子黑恶爪.jpg"
}
CARD44 = {
	"name": "旋风回力镖",
	"type": "attall",
	"value": 25,
	"img": "card/旋风回力镖.jpg"
}
CARD45 = {
	"name": "旋风剑",
	"type": "attall",
	"value": 30,
	"img": "card/旋风剑.jpg"
}
CARD46 = {
	"name": "打火石",
	"type": "attall",
	"value": 35,
	"img": "card/打火石.jpg"
}
//对怪兽进行注册
MonList["FIRE_MON"] = FIRE_MON;
MonList["HAT_MON"] = HAT_MON;
MonList["MON_DIAMOND_1"] = MON_DIAMOND_1;
MonList["MON_DIAMOND_2"] = MON_DIAMOND_2;
MonList["MON_DIAMOND_3"] = MON_DIAMOND_3;
MonList["MON_DIAMOND_4"] = MON_DIAMOND_4;
MonList["MON_DIAMOND_5"] = MON_DIAMOND_5;
MonList["MON_DIAMOND_6"] = MON_DIAMOND_6;
MonList["MON_DIAMOND_7"] = MON_DIAMOND_7;
MonList["MON_DIAMOND_8"] = MON_DIAMOND_8;
MonList["MON_ALIEN_1"] = MON_ALIEN_1;
MonList["MON_ALIEN_2"] = MON_ALIEN_2;

//对卡牌进行注册
CardList["CARD1"] = CARD1;
CardList["CARD2"] = CARD2;
CardList["CARD3"] = CARD3;
CardList["CARD4"] = CARD4;
CardList["CARD5"] = CARD5;
CardList["CARD6"] = CARD6;
CardList["CARD7"] = CARD7;
CardList["CARD8"] = CARD8;
CardList["CARD9"] = CARD9;
CardList["CARD10"] = CARD10;
CardList["CARD11"] = CARD11;
CardList["CARD12"] = CARD12;
CardList["CARD13"] = CARD13;
CardList["CARD14"] = CARD14;
CardList["CARD15"] = CARD15;
CardList["CARD16"] = CARD16;
CardList["CARD17"] = CARD17;
CardList["CARD18"] = CARD18;
CardList["CARD19"] = CARD19;
CardList["CARD20"] = CARD20;
CardList["CARD21"] = CARD21;
CardList["CARD22"] = CARD22;
CardList["CARD23"] = CARD23;
CardList["CARD24"] = CARD24;
CardList["CARD25"] = CARD25;
CardList["CARD26"] = CARD26;
CardList["CARD27"] = CARD27;
CardList["CARD28"] = CARD28;
CardList["CARD29"] = CARD29;
CardList["CARD30"] = CARD30;
CardList["CARD31"] = CARD31;
CardList["CARD32"] = CARD32;
CardList["CARD33"] = CARD33;
CardList["CARD34"] = CARD34;
CardList["CARD35"] = CARD35;
CardList["CARD36"] = CARD36;
CardList["CARD37"] = CARD37;
CardList["CARD38"] = CARD38;
CardList["CARD39"] = CARD39;
CardList["CARD40"] = CARD40;
CardList["CARD41"] = CARD41;
CardList["CARD42"] = CARD42;
CardList["CARD43"] = CARD43;
CardList["CARD44"] = CARD44;
CardList["CARD45"] = CARD45;
CardList["CARD46"] = CARD46;

GameInfo = {
	win_counter: 0,
	lose_counter: 0,
	opportunity_counter: 0,
	star_counter: 0,
	extra_cards: [CardUtil.getCardInstance(CARD1), CardUtil.getCardInstance(CARD2)]
}

TaskList["task1"] = {
	"taskname": "task1",
	"taskcontent": ["HAT_MON", "HAT_MON", "HAT_MON"],
	"isComplete": "no"
};
TaskList["task2"] = {
	"taskname": "task2",
	"taskcontent": ["HAT_MON", "FIRE_MON", "HAT_MON"],
	"isComplete": "no"
};
TaskList["task3"] = {
	"taskname": "task3",
	"taskcontent": ["FIRE_MON", "FIRE_MON", "FIRE_MON"],
	"isComplete": "no"
};

TaskList["task_diamond_1"] = {
	"taskname": "task_diamond_1",
	"taskcontent": ["MON_DIAMOND_1", "MON_DIAMOND_1", "MON_DIAMOND_1"],
	"isComplete": "no"
};
TaskList["task_diamond_2"] = {
	"taskname": "task_diamond_2",
	"taskcontent": ["MON_DIAMOND_1", "MON_DIAMOND_2", "MON_DIAMOND_1"],
	"isComplete": "no"
};
TaskList["task_diamond_3"] = {
	"taskname": "task_diamond_3",
	"taskcontent": ["MON_DIAMOND_1", "MON_DIAMOND_3", "MON_DIAMOND_2"],
	"isComplete": "no"
};
TaskList["task_diamond_4"] = {
	"taskname": "task_diamond_4",
	"taskcontent": ["MON_DIAMOND_3", "MON_DIAMOND_4", "MON_DIAMOND_2"],
	"isComplete": "no"
};
TaskList["task_diamond_5"] = {
	"taskname": "task_diamond_5",
	"taskcontent": ["MON_DIAMOND_3", "MON_DIAMOND_5", "MON_DIAMOND_4"],
	"isComplete": "no"
};
TaskList["task_diamond_6"] = {
	"taskname": "task_diamond_6",
	"taskcontent": ["MON_DIAMOND_5", "MON_DIAMOND_6", "MON_DIAMOND_4"],
	"isComplete": "no"
};
TaskList["task_diamond_7"] = {
	"taskname": "task_diamond_7",
	"taskcontent": ["MON_DIAMOND_5", "MON_DIAMOND_7", "MON_DIAMOND_6"],
	"isComplete": "no"
};
TaskList["task_diamond_8"] = {
	"taskname": "task_diamond_8",
	"taskcontent": ["MON_DIAMOND_7", "MON_DIAMOND_8", "MON_DIAMOND_6"],
	"isComplete": "no"
};
TaskList["task_alien_1"] = {
	"taskname": "task_alien_1",
	"taskcontent": ["MON_ALIEN_1", "MON_ALIEN_1", "MON_ALIEN_1"],
	"isComplete": "no"
};
TaskList["task_alien_2"] = {
	"taskname": "task_alien_2",
	"taskcontent": ["MON_ALIEN_1", "MON_ALIEN_2", "MON_ALIEN_1"],
	"isComplete": "no"
};
TaskList["task_alien_3"] = {
	"taskname": "task_alien_3",
	"taskcontent": ["MON_ALIEN_2", "MON_ALIEN_1", "MON_ALIEN_1"],
	"isComplete": "no"
};
TaskList["task_alien_4"] = {
	"taskname": "task_alien_4",
	"taskcontent": ["MON_ALIEN_2", "MON_ALIEN_2", "MON_ALIEN_2"],
	"isComplete": "no"
};

