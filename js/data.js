var MonData = {};
var CommonUtil = {};
var CardUtil = {};
var MonList = {};
var CardList = {};
var TaskList = {};
var GameInfo = {};
var FieldBG = [];

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


MonData.getComInstance = function(obj, tasklevel) {
	if (!tasklevel) {
		tasklevel = 1;
	}
	let mon = JSON.parse(JSON.stringify(obj));
	mon.maxHp = mon.maxHp * tasklevel;
	mon.maxAc = mon.maxAc * tasklevel;
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
	if (o.state) {
		MonData.addState(defmon, o.state, 1);
	}
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
MonData.getStateObj = function(state_str) {
	let state_obj = {
		state: "state_" + state_str,
		value: 0
	}
	return state_obj;
}
MonData.addState = function(role, state_str, value) {
	if (!role) return;
	if (!role.states) {
		let stat = MonData.getStateObj(state_str);
		stat.value = value;
		role.states = [stat];
	} else {
		let has_this_state = false;
		for (i = 0; i < role.states.length; i++) {
			if (role.states[i].state == "state_" + state_str) {
				role.states[i].value += value;
				has_this_state = true;
			}
		}
		if (!has_this_state) {
			let stat = MonData.getStateObj(state_str);
			stat.value = value;
			role.states.push(stat);
		}
	}
}
MonData.hasState = function(role, state_str) {
	if (!role) return false;
	if (!role.states) {
		return false;
	} else {
		let has_this_state = false;
		for (i = 0; i < role.states.length; i++) {
			if (role.states[i].state == "state_" + state_str && role.states[i].value > 0) {
				has_this_state = true;
			}
		}
		return has_this_state;
	}
}
MonData.clearState = function(role, state_str) {
	if (!role) return;
	if (!role.states) {
		return;
	} else {
		for (i = 0; i < role.states.length; i++) {
			if (role.states[i].state == "state_" + state_str) {
				role.states[i].value = 0;
			}
		}
	}
}
MonData.getStateValue = function(role, state_str) {
	if (!role) return 0;
	if (!role.states) {
		return 0;
	} else {
		let state_value = 0;
		for (i = 0; i < role.states.length; i++) {
			if (role.states[i].state == "state_" + state_str && role.states[i].value > 0) {
				state_value = role.states[i].value;
			}
		}
		return state_value;
	}
}
MonData.getStateName = function(state_str) {
	let t = {
		"fire": "燃烧",
		"ele": "电击"
	}
	return t[state_str] ? t[state_str] : "";
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
	let deck = JSON.parse(localStorage.getItem("skycard_deck"));
	if (!deck) {
		return null;
	}
	for (i = 0; i < deck.length; i++) {
		let t_card = deck[i];
		for (j in CardList) {
			if (CardList[j].name == t_card.name) {
				t_card.type = CardList[j].type;
				t_card.value = CardList[j].value;
				t_card.img = CardList[j].img;
				t_card.state = CardList[j].state;
			}
		}
	}
	return deck;

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
	mon.effect = "英雄小子";
	localStorage.setItem("skycard_player", JSON.stringify(mon));
	return mon;
}
CommonUtil.saveTaskState = function(tsklst) {
	localStorage.removeItem('skycard_tasklist');
	localStorage.setItem("skycard_tasklist", JSON.stringify(tsklst));
}
CommonUtil.getTaskState = function() {
	let tmp_tasklist = JSON.parse(localStorage.getItem("skycard_tasklist"));
	for (let i in tmp_tasklist) {
		TaskList[i].isComplete = tmp_tasklist[i].isComplete;
		TaskList[i].isCompleteHard = tmp_tasklist[i].isCompleteHard;
		TaskList[i].isCompleteHell = tmp_tasklist[i].isCompleteHell;
	}
	return TaskList;
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

CommonUtil.getAtkType = function(tp) {
	let rtn = "";
	switch (tp) {
		case "magone":
			rtn = "魔·单";
			break;
		case "magall":
			rtn = "魔·全";
			break;
		case "attone":
			rtn = "物·单";
			break;
		case "attall":
			rtn = "物·全";
			break;
		case "heal":
			rtn = "治疗";
			break;
		case "arm":
			rtn = "护盾";
			break;
		case "effect":
			rtn = "效果";
			break;
		default:
			rtn = tp;
	}
	return rtn;
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
		"value": 15,
		"state": "fire"
	}, {
		"type": "heal",
		"state": "fire",
		"value": 30
	}, {
		"type": "arm",
		"value": 20
	}, {
		"type": "mag",
		"state": "fire",
		"value": 8
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
MON_DIAMOND_1 = {
	"name": "红钻鼠",
	"maxHp": 25, //最大生命
	"maxAc": 25, //最大护甲
	"star": 1,
	"img": "diamond/2183.jpg",
	"actions": [{
		"type": "att",
		"value": 10
	}, {
		"type": "att",
		"value": 9
	}, {
		"type": "att",
		"value": 11
	}, {
		"type": "att",
		"value": 20
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
		"value": 15
	}, {
		"type": "att",
		"value": 14
	}, {
		"type": "att",
		"value": 13
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
		"value": 15
	}, {
		"type": "att",
		"value": 16
	}, {
		"type": "att",
		"value": 17
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
		"value": 20
	}, {
		"type": "arm",
		"value": 30
	}, {
		"type": "arm",
		"value": 25
	}, {
		"type": "att",
		"value": 18
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
		"value": 20
	}, {
		"type": "att",
		"value": 21
	}, {
		"type": "att",
		"value": 22
	}, {
		"type": "att",
		"value": 23
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
		"value": 20
	}, {
		"type": "att",
		"value": 21
	}, {
		"type": "att",
		"value": 22
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
		"value": 25
	}, {
		"type": "mag",
		"value": 12
	}, {
		"type": "mag",
		"value": 13
	}, {
		"type": "mag",
		"value": 14
	}]
}

MON_DIAMOND_8 = {
	"name": "彩虹龙",
	"maxHp": 300, //最大生命
	"maxAc": 300, //最大护甲
	"star": 12,
	"img": "diamond/2662.jpg",
	"actions": [{
		"type": "att",
		"value": 75
	}, {
		"type": "att",
		"value": 74
	}, {
		"type": "mag",
		"value": 30
	}, {
		"type": "mag",
		"value": 25
	}, {
		"type": "heal",
		"value": 150
	}, {
		"type": "arm",
		"value": 120
	}]
}
MON_DIAMOND_9 = {
	"name": "宝石龙",
	"maxHp": 150, //最大生命
	"maxAc": 150, //最大护甲
	"star": 6,
	"img": "diamond/10172.jpg",
	"actions": [{
		"type": "att",
		"value": 45
	}, {
		"type": "att",
		"value": 40
	}, {
		"type": "mag",
		"value": 20
	}, {
		"type": "mag",
		"value": 22
	}, {
		"type": "heal",
		"value": 90
	}, {
		"type": "arm",
		"value": 75
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
	"maxHp": 200, //最大生命
	"maxAc": 110, //最大护甲
	"star": 6,
	"img": "alien/熔岩外星人.jpg",
	"actions": [{
		"type": "att",
		"state": "fire",
		"value": 40
	}, {
		"type": "mag",
		"state": "fire",
		"value": 20
	}, {
		"type": "mag",
		"state": "fire",
		"value": 18
	}, {
		"type": "att",
		"state": "fire",
		"value": 38
	}, {
		"type": "heal",
		"value": 80
	}, {
		"type": "arm",
		"value": 70
	}]
}
MON_ALIEN_3 = {
	"name": "骷髅外星人",
	"maxHp": 100, //最大生命
	"maxAc": 1, //最大护甲
	"star": 2,
	"img": "alien/骷髅外星人.jpg",
	"actions": [{
		"type": "att",
		"value": 15
	}, {
		"type": "att",
		"value": 14
	}, {
		"type": "att",
		"value": 16
	}, {
		"type": "att",
		"value": 17
	}, {
		"type": "heal",
		"value": 30
	}]
}
MON_ALIEN_4 = {
	"name": "念力外星人",
	"maxHp": 100, //最大生命
	"maxAc": 1, //最大护甲
	"star": 2,
	"img": "alien/念力外星人.jpg",
	"actions": [{
		"type": "mag",
		"value": 10
	}, {
		"type": "mag",
		"value": 9
	}, {
		"type": "mag",
		"value": 8
	}, {
		"type": "mag",
		"value": 7
	}, {
		"type": "heal",
		"value": 30
	}]
}
MON_ALIEN_5 = {
	"name": "外星催眠师",
	"maxHp": 25, //最大生命
	"maxAc": 75, //最大护甲
	"star": 2,
	"img": "alien/外星催眠师.jpg",
	"actions": [{
		"type": "mag",
		"value": 10
	}, {
		"type": "mag",
		"value": 9
	}, {
		"type": "mag",
		"value": 8
	}, {
		"type": "mag",
		"value": 7
	}, {
		"type": "arm",
		"value": 20
	}]
}
MON_ALIEN_6 = {
	"name": "外星复仇者",
	"maxHp": 150, //最大生命
	"maxAc": 75, //最大护甲
	"star": 5,
	"img": "alien/外星复仇者.jpg",
	"actions": [{
		"type": "att",
		"value": 35
	}, {
		"type": "att",
		"value": 30
	}, {
		"type": "att",
		"value": 32
	}, {
		"type": "heal",
		"value": 70
	}, {
		"type": "arm",
		"value": 50
	}]
}
MON_ALIEN_7 = {
	"name": "外星菊石",
	"maxHp": 80, //最大生命
	"maxAc": 1, //最大护甲
	"star": 1,
	"img": "alien/外星菊石.jpg",
	"actions": [{
		"type": "att",
		"value": 15
	}, {
		"type": "att",
		"value": 12
	}, {
		"type": "att",
		"value": 10
	}, {
		"type": "att",
		"value": 10
	}, {
		"type": "heal",
		"value": 50
	}]
}
MON_ALIEN_8 = {
	"name": "外星狂战士",
	"maxHp": 125, //最大生命
	"maxAc": 1, //最大护甲
	"star": 5,
	"img": "alien/外星狂战士.jpg",
	"actions": [{
		"type": "att",
		"value": 70
	}, {
		"type": "att",
		"value": 60
	}, {
		"type": "att",
		"value": 50
	}, {
		"type": "att",
		"value": 40
	}, {
		"type": "heal",
		"value": 30
	}]
}
MON_ALIEN_9 = {
	"name": "外星母舰",
	"maxHp": 600, //最大生命
	"maxAc": 1, //最大护甲
	"star": 12,
	"img": "alien/外星利维坦.jpg",
	"actions": [{
		"type": "att",
		"value": 72
	}, {
		"type": "mag",
		"value": 36
	}, {
		"type": "mag",
		"value": 35
	}, {
		"type": "mag",
		"value": 20
	}, {
		"type": "heal",
		"value": 150
	}]
}
MON_ALIEN_10 = {
	"name": "外星侵略者",
	"maxHp": 120, //最大生命
	"maxAc": 80, //最大护甲
	"star": 4,
	"img": "alien/外星侵略者.jpg",
	"actions": [{
		"type": "att",
		"value": 28
	}, {
		"type": "mag",
		"value": 14
	}, {
		"type": "att",
		"value": 30
	}, {
		"type": "mag",
		"value": 12
	}, {
		"type": "heal",
		"value": 55
	}, {
		"type": "arm",
		"value": 31
	}]
}
MON_ALIEN_11 = {
	"name": "外星犬",
	"maxHp": 50, //最大生命
	"maxAc": 100, //最大护甲
	"star": 3,
	"img": "alien/外星犬.jpg",
	"actions": [{
		"type": "att",
		"value": 24
	}, {
		"type": "arm",
		"value": 33
	}]
}
MON_ALIEN_12 = {
	"name": "外星人飞船",
	"maxHp": 200, //最大生命
	"maxAc": 250, //最大护甲
	"star": 9,
	"img": "alien/外星人飞船.jpg",
	"actions": [{
		"type": "att",
		"value": 60
	}, {
		"type": "arm",
		"value": 100
	}, {
		"type": "mag",
		"value": 30
	}, {
		"type": "att",
		"value": 55
	}, {
		"type": "arm",
		"value": 50
	}, {
		"type": "mag",
		"value": 28
	}]
}
MON_ALIEN_13 = {
	"name": "外星人猎手",
	"maxHp": 200, //最大生命
	"maxAc": 100, //最大护甲
	"star": 7,
	"img": "alien/外星人猎手.jpg",
	"actions": [{
		"type": "att",
		"state": "ele",
		"value": 75
	}, {
		"type": "att",
		"state": "ele",
		"value": 70
	}, {
		"type": "att",
		"state": "ele",
		"value": 65
	}, {
		"type": "att",
		"state": "ele",
		"value": 60
	}, {
		"type": "mag",
		"state": "ele",
		"value": 25
	}, {
		"type": "heal",
		"value": 150
	}]
}
MON_ALIEN_14 = {
	"name": "外星人母后",
	"maxHp": 500, //最大生命
	"maxAc": 1, //最大护甲
	"star": 10,
	"img": "alien/外星人母后.jpg",
	"actions": [{
		"type": "att",
		"value": 60
	}, {
		"type": "att",
		"value": 65
	}, {
		"type": "att",
		"value": 63
	}, {
		"type": "att",
		"value": 58
	}, {
		"type": "heal",
		"value": 120
	}, {
		"type": "heal",
		"value": 100
	}]
}
MON_ALIEN_15 = {
	"name": "外星人士兵",
	"maxHp": 100, //最大生命
	"maxAc": 100, //最大护甲
	"star": 4,
	"img": "alien/外星人士兵.jpg",
	"actions": [{
		"type": "att",
		"value": 30
	}, {
		"type": "att",
		"value": 28
	}, {
		"type": "att",
		"value": 26
	}, {
		"type": "att",
		"value": 24
	}, {
		"type": "arm",
		"value": 40
	}, {
		"type": "heal",
		"value": 60
	}]
}
MON_ALIEN_16 = {
	"name": "外星人小孩",
	"maxHp": 25, //最大生命
	"maxAc": 25, //最大护甲
	"star": 1,
	"img": "alien/外星人小孩.jpg",
	"actions": [{
		"type": "att",
		"value": 15
	}, {
		"type": "att",
		"value": 14
	}, {
		"type": "att",
		"value": 13
	}, {
		"type": "att",
		"value": 12
	}, {
		"type": "arm",
		"value": 25
	}, {
		"type": "heal",
		"value": 25
	}]
}
MON_ALIEN_17 = {
	"name": "外星人长老",
	"maxHp": 100, //最大生命
	"maxAc": 300, //最大护甲
	"star": 8,
	"img": "alien/外星人长老.jpg",
	"actions": [{
		"type": "mag",
		"value": 25
	}, {
		"type": "mag",
		"value": 26
	}, {
		"type": "mag",
		"value": 27
	}, {
		"type": "att",
		"value": 50
	}, {
		"type": "arm",
		"value": 75
	}, {
		"type": "heal",
		"value": 100
	}]
}
MON_ALIEN_18 = {
	"name": "外星人之王",
	"maxHp": 250, //最大生命
	"maxAc": 200, //最大护甲
	"star": 11,
	"img": "alien/外星人之王.jpg",
	"actions": [{
		"type": "att",
		"value": 70
	}, {
		"type": "att",
		"value": 65
	}, {
		"type": "mag",
		"value": 35
	}, {
		"type": "mag",
		"value": 33
	}, {
		"type": "arm",
		"value": 100
	}, {
		"type": "heal",
		"value": 150
	}]
}

MON_DIMEN_1 = {
	"name": "战士-格雷法",
	"maxHp": 150, //最大生命
	"maxAc": 50, //最大护甲
	"star": 4,
	"img": "dimen/战士-格雷法.jpg",
	"actions": [{
		"type": "att",
		"value": 26
	}, {
		"type": "att",
		"value": 27
	}, {
		"type": "att",
		"value": 28
	}, {
		"type": "arm",
		"value": 50
	}]
}
MON_DIMEN_2 = {
	"name": "灵魂龙",
	"maxHp": 100, //最大生命
	"maxAc": 1, //最大护甲
	"star": 2,
	"img": "dimen/灵魂龙.jpg",
	"actions": [{
		"type": "mag",
		"value": 7
	}, {
		"type": "mag",
		"value": 8
	}, {
		"type": "heal",
		"value": 20
	}]
}
MON_DIMEN_3 = {
	"name": "荒野女战士",
	"maxHp": 50, //最大生命
	"maxAc": 150, //最大护甲
	"star": 4,
	"img": "dimen/荒野女战士.jpg",
	"actions": [{
		"type": "att",
		"value": 24
	}, {
		"type": "att",
		"value": 28
	}, {
		"type": "arm",
		"value": 50
	}]
}
MON_DIMEN_4 = {
	"name": "暗黑战士格雷法",
	"maxHp": 150, //最大生命
	"maxAc": 50, //最大护甲
	"star": 4,
	"img": "dimen/暗黑战士-格雷法.jpg",
	"actions": [{
		"type": "mag",
		"value": 12
	}, {
		"type": "att",
		"value": 28
	}, {
		"type": "att",
		"value": 50
	}]
}
MON_DIMEN_5 = {
	"name": "光芒使者格雷法",
	"maxHp": 150, //最大生命
	"maxAc": 50, //最大护甲
	"star": 4,
	"img": "dimen/光芒使者-格雷法.jpg",
	"actions": [{
		"type": "mag",
		"value": 12
	}, {
		"type": "att",
		"value": 28
	}, {
		"type": "heal",
		"value": 50
	}, {
		"type": "heal",
		"value": 50
	}]
}
MON_DIMEN_6 = {
	"name": "龙战士格雷法",
	"maxHp": 250, //最大生命
	"maxAc": 51, //最大护甲
	"star": 6,
	"img": "dimen/龙战士-格雷法.jpg",
	"actions": [{
		"type": "mag",
		"value": 15
	}, {
		"type": "mag",
		"value": 16
	}, {
		"type": "mag",
		"value": 18
	}, {
		"type": "heal",
		"value": 20
	}]
}
MON_DIMEN_7 = {
	"name": "骑士格雷法",
	"maxHp": 250, //最大生命
	"maxAc": 101, //最大护甲
	"star": 7,
	"img": "dimen/骑士-格雷法.jpg",
	"actions": [{
		"type": "mag",
		"value": 20
	}, {
		"type": "mag",
		"value": 16
	}, {
		"type": "att",
		"value": 42
	}, {
		"type": "att",
		"value": 43
	}, {
		"type": "arm",
		"value": 99
	}, {
		"type": "heal",
		"value": 99
	}]
}
MON_DIMEN_8 = {
	"name": "四级漆黑魔王",
	"maxHp": 100, //最大生命
	"maxAc": 50, //最大护甲
	"star": 4,
	"img": "dimen/漆黑之魔王-LV4.jpg",
	"actions": [{
		"type": "mag",
		"value": 12
	}, {
		"type": "mag",
		"value": 13
	}, {
		"type": "mag",
		"value": 20
	}, {
		"type": "mag",
		"value": 25
	}, {
		"type": "arm",
		"value": 50
	}, {
		"type": "heal",
		"value": 99
	}]
}
MON_DIMEN_9 = {
	"name": "六级漆黑魔王",
	"maxHp": 200, //最大生命
	"maxAc": 50, //最大护甲
	"star": 6,
	"img": "dimen/漆黑之魔王-LV6.jpg",
	"actions": [{
		"type": "mag",
		"value": 20
	}, {
		"type": "mag",
		"value": 25
	}, {
		"type": "mag",
		"value": 30
	}, {
		"type": "mag",
		"value": 35
	}, {
		"type": "arm",
		"value": 50
	}, {
		"type": "heal",
		"value": 120
	}]
}
MON_DIMEN_10 = {
	"name": "八级漆黑魔王",
	"maxHp": 300, //最大生命
	"maxAc": 50, //最大护甲
	"star": 8,
	"img": "dimen/漆黑之魔王-LV8.jpg",
	"actions": [{
		"type": "mag",
		"value": 25
	}, {
		"type": "mag",
		"value": 30
	}, {
		"type": "mag",
		"value": 35
	}, {
		"type": "mag",
		"value": 40
	}, {
		"type": "arm",
		"value": 50
	}, {
		"type": "heal",
		"value": 150
	}]
}
MON_DIMEN_11 = {
	"name": "异次元精灵",
	"maxHp": 100, //最大生命
	"maxAc": 1, //最大护甲
	"star": 2,
	"img": "dimen/异次元的精灵.jpg",
	"actions": [{
		"type": "mag",
		"state": "ele",
		"value": 9
	}, {
		"type": "mag",
		"state": "ele",
		"value": 7
	}, {
		"type": "mag",
		"state": "ele",
		"value": 10
	}, {
		"type": "heal",
		"value": 50
	}]
}
MON_DIMEN_12 = {
	"name": "异次元战士",
	"maxHp": 75, //最大生命
	"maxAc": 75, //最大护甲
	"star": 3,
	"img": "dimen/异次元的战士.jpg",
	"actions": [{
		"type": "att",
		"state": "ele",
		"value": 20
	}, {
		"type": "att",
		"state": "ele",
		"value": 24
	}, {
		"type": "att",
		"state": "ele",
		"value": 25
	}]
}
MON_DIMEN_13 = {
	"name": "异次元女战士",
	"maxHp": 50, //最大生命
	"maxAc": 150, //最大护甲
	"star": 4,
	"img": "dimen/异次元女战士.jpg",
	"actions": [{
		"type": "att",
		"state": "ele",
		"value": 25
	}, {
		"type": "att",
		"state": "ele",
		"value": 28
	}, {
		"type": "att",
		"state": "ele",
		"value": 29
	}, {
		"type": "arm",
		"value": 125
	}]
}
MON_DIMEN_14 = {
	"name": "异次元龙",
	"maxHp": 260, //最大生命
	"maxAc": 1, //最大护甲
	"star": 5,
	"img": "dimen/异次元龙.jpg",
	"actions": [{
		"type": "att",
		"state": "ele",
		"value": 30
	}, {
		"type": "att",
		"state": "ele",
		"value": 31
	}, {
		"type": "att",
		"state": "ele",
		"value": 34
	}, {
		"type": "heal",
		"value": 125
	}, {
		"type": "mag",
		"state": "ele",
		"value": 17
	}, {
		"type": "mag",
		"state": "ele",
		"value": 18
	}]
}
MON_DIMEN_15 = {
	"name": "异次元之主",
	"maxHp": 200, //最大生命
	"maxAc": 50, //最大护甲
	"star": 6,
	"img": "dimen/异次元之主.jpg",
	"actions": [{
		"type": "mag",
		"state": "ele",
		"value": 45
	}, {
		"type": "mag",
		"state": "ele",
		"value": 47
	}, {
		"type": "mag",
		"state": "ele",
		"value": 48
	}, {
		"type": "heal",
		"value": 100
	}]
}

MON_HERO_1 = {
	"name": "土灵师",
	"maxHp": 125, //最大生命
	"maxAc": 75, //最大护甲
	"star": 4,
	"img": "hero/1599.jpg",
	"actions": [{
		"type": "att",
		"value": 25
	}, {
		"type": "att",
		"value": 27
	}, {
		"type": "mag",
		"value": 13
	}, {
		"type": "heal",
		"value": 50
	}, {
		"type": "arm",
		"value": 50
	}]
}
MON_HERO_2 = {
	"name": "恶魔海狸",
	"maxHp": 100, //最大生命
	"maxAc": 25, //最大护甲
	"star": 2,
	"img": "hero/恶魔海狸.jpg",
	"actions": [{
		"type": "att",
		"value": 15
	}, {
		"type": "att",
		"value": 20
	}, {
		"type": "mag",
		"value": 10
	}]
}
MON_HERO_3 = {
	"name": "水灵师",
	"maxHp": 75, //最大生命
	"maxAc": 125, //最大护甲
	"star": 4,
	"img": "hero/1600.jpg",
	"actions": [{
		"type": "att",
		"value": 25
	}, {
		"type": "mag",
		"value": 14
	}, {
		"type": "mag",
		"value": 13
	}, {
		"type": "heal",
		"value": 50
	}, {
		"type": "arm",
		"value": 50
	}]
}
MON_HERO_4 = {
	"name": "小魔蜥",
	"maxHp": 75, //最大生命
	"maxAc": 25, //最大护甲
	"star": 2,
	"img": "hero/小魔蜥.jpg",
	"actions": [{
		"type": "att",
		"value": 15
	}, {
		"type": "att",
		"value": 20
	}, {
		"type": "att",
		"value": 25
	}]
}
MON_HERO_5 = {
	"name": "火灵师",
	"maxHp": 75, //最大生命
	"maxAc": 125, //最大护甲
	"star": 4,
	"img": "hero/1601.jpg",
	"actions": [{
		"type": "mag",
		"state": "fire",
		"value": 25
	}, {
		"type": "mag",
		"state": "fire",
		"value": 14
	}, {
		"type": "mag",
		"state": "fire",
		"value": 13
	}, {
		"type": "heal",
		"value": 50
	}, {
		"type": "arm",
		"value": 50
	}]
}
MON_HERO_6 = {
	"name": "火狐",
	"maxHp": 75, //最大生命
	"maxAc": 25, //最大护甲
	"star": 2,
	"img": "hero/火狐.jpg",
	"actions": [{
		"type": "mag",
		"state": "fire",
		"value": 7
	}, {
		"type": "mag",
		"state": "fire",
		"value": 10
	}, {
		"type": "mag",
		"state": "fire",
		"value": 20
	}]
}

MON_HERO_7 = {
	"name": "风灵师",
	"maxHp": 75, //最大生命
	"maxAc": 100, //最大护甲
	"star": 4,
	"img": "hero/1602.jpg",
	"actions": [{
		"type": "att",
		"value": 35
	}, {
		"type": "att",
		"value": 36
	}, {
		"type": "att",
		"value": 40
	}, {
		"type": "heal",
		"value": 50
	}, {
		"type": "arm",
		"value": 50
	}]
}
MON_HERO_8 = {
	"name": "小龙",
	"maxHp": 75, //最大生命
	"maxAc": 25, //最大护甲
	"star": 2,
	"img": "hero/小龙.jpg",
	"actions": [{
		"type": "mag",
		"value": 7
	}, {
		"type": "mag",
		"value": 10
	}, {
		"type": "mag",
		"value": 20
	}]
}
MON_HERO_9 = {
	"name": "暗灵使达克",
	"maxHp": 75, //最大生命
	"maxAc": 75, //最大护甲
	"star": 4,
	"img": "hero/暗灵使-达克.jpg",
	"actions": [{
		"type": "mag",
		"value": 17
	}, {
		"type": "mag",
		"value": 18
	}, {
		"type": "mag",
		"value": 20
	}, {
		"type": "heal",
		"value": 50
	}, {
		"type": "arm",
		"value": 50
	}]
}
MON_HERO_10 = {
	"name": "眼球恶魔",
	"maxHp": 75, //最大生命
	"maxAc": 25, //最大护甲
	"star": 2,
	"img": "hero/眼球恶魔.jpg",
	"actions": [{
		"type": "att",
		"value": 20
	}, {
		"type": "att",
		"value": 25
	}, {
		"type": "att",
		"value": 30
	}]
}
MON_HERO_11 = {
	"name": "光灵使莱娜",
	"maxHp": 75, //最大生命
	"maxAc": 75, //最大护甲
	"star": 4,
	"img": "hero/光灵使-莱娜.jpg",
	"actions": [{
		"type": "att",
		"value": 40
	}, {
		"type": "att",
		"value": 43
	}, {
		"type": "att",
		"value": 45
	}, {
		"type": "heal",
		"value": 50
	}, {
		"type": "arm",
		"value": 50
	}]
}
MON_HERO_12 = {
	"name": "幸福天使",
	"maxHp": 75, //最大生命
	"maxAc": 25, //最大护甲
	"star": 2,
	"img": "hero/幸福天使.jpg",
	"actions": [{
		"type": "mag",
		"value": 10
	}, {
		"type": "mag",
		"value": 15
	}, {
		"type": "mag",
		"value": 12
	}]
}
MON_HERO_13 = {
	"name": "英雄小子",
	"maxHp": 50, //最大生命
	"maxAc": 50, //最大护甲
	"star": 2,
	"img": "hero/英雄小子.jpg",
	"actions": [{
		"type": "att",
		"value": 20
	}, {
		"type": "att",
		"value": 15
	}, {
		"type": "att",
		"value": 17
	}]
}
MON_HERO_14 = {
	"name": "冰凌侠",
	"maxHp": 50, //最大生命
	"maxAc": 150, //最大护甲
	"star": 4,
	"img": "hero/3618.jpg",
	"actions": [{
		"type": "mag",
		"value": 12
	}, {
		"type": "mag",
		"value": 13
	}, {
		"type": "mag",
		"value": 30
	}, {
		"type": "heal",
		"value": 50
	}, {
		"type": "arm",
		"value": 50
	}]
}
MON_HERO_15 = {
	"name": "爆热女郎",
	"maxHp": 75, //最大生命
	"maxAc": 75, //最大护甲
	"star": 4,
	"img": "hero/爆热女郎1.jpg",
	"actions": [{
		"type": "mag",
		"state": "fire",
		"value": 12
	}, {
		"type": "mag",
		"state": "fire",
		"value": 25
	}, {
		"type": "mag",
		"state": "fire",
		"value": 30
	}, {
		"type": "heal",
		"value": 50
	}, {
		"type": "arm",
		"value": 50
	}]
}
MON_HERO_16 = {
	"name": "六级爆热女郎",
	"maxHp": 150, //最大生命
	"maxAc": 75, //最大护甲
	"star": 6,
	"img": "hero/爆热女郎2.jpg",
	"actions": [{
		"type": "mag",
		"state": "fire",
		"value": 12
	}, {
		"type": "mag",
		"state": "fire",
		"value": 30
	}, {
		"type": "mag",
		"state": "fire",
		"value": 40
	}, {
		"type": "heal",
		"value": 80
	}, {
		"type": "arm",
		"value": 50
	}]
}
MON_HERO_17 = {
	"name": "炽热侠",
	"maxHp": 75, //最大生命
	"maxAc": 50, //最大护甲
	"star": 4,
	"img": "hero/炽热侠.jpg",
	"actions": [{
		"type": "mag",
		"state": "fire",
		"value": 28
	}, {
		"type": "mag",
		"state": "fire",
		"value": 20
	}, {
		"type": "mag",
		"state": "fire",
		"value": 30
	}, {
		"type": "heal",
		"value": 50
	}, {
		"type": "arm",
		"value": 50
	}]
}
MON_HERO_18 = {
	"name": "炽炎女郎",
	"maxHp": 50, //最大生命
	"maxAc": 50, //最大护甲
	"star": 4,
	"img": "hero/炽炎女郎.jpg",
	"actions": [{
		"type": "mag",
		"state": "fire",
		"value": 28
	}, {
		"type": "mag",
		"state": "fire",
		"value": 25
	}, {
		"type": "mag",
		"state": "fire",
		"value": 30
	}, {
		"type": "heal",
		"value": 50
	}, {
		"type": "arm",
		"value": 50
	}]
}






/* 卡牌的初始化数据 */

CARD1 = {
	"name": "传说之剑",
	"type": "attone",
	"value": 100,
	"star": 10,
	"img": "card/传说之剑.jpg"
}
CARD2 = {
	"name": "电击鞭",
	"type": "attall",
	"value": 18,
	"star": 3,
	"state": "ele",
	"img": "card/电击鞭.jpg"
}
CARD3 = {
	"name": "恶魔之斧",
	"type": "attone",
	"value": 25,
	"star": 3,
	"img": "card/恶魔之斧.jpg"
}
CARD4 = {
	"name": "凤凰刃",
	"type": "attone",
	"value": 20,
	"star": 2,
	"img": "card/凤凰刃.jpg"
}
CARD5 = {
	"name": "钢甲壳",
	"type": "arm",
	"value": 40,
	"star": 2,
	"img": "card/钢甲壳.jpg"
}
CARD6 = {
	"name": "红色药剂",
	"type": "heal",
	"value": 30,
	"star": 2,
	"img": "card/红色药剂.jpg"
}
CARD7 = {
	"name": "火球",
	"type": "magall",
	"value": 5,
	"star": 3,
	"state": "fire",
	"img": "card/火球.jpg"
}
CARD8 = {
	"name": "火炎弹",
	"type": "magone",
	"value": 10,
	"star": 1,
	"state": "fire",
	"img": "card/火炎弹.jpg"
}
CARD9 = {
	"name": "灵魂之斧",
	"type": "attone",
	"value": 35,
	"star": 4,
	"img": "card/灵魂之斧.jpg"
}
CARD10 = {
	"name": "麻药",
	"type": "heal",
	"value": 20,
	"star": 1,
	"img": "card/麻药.jpg"
}
CARD11 = {
	"name": "魔剑",
	"type": "attone",
	"value": 5,
	"star": 1,
	"img": "card/魔剑.jpg"
}
CARD12 = {
	"name": "破神剑",
	"type": "attone",
	"value": 20,
	"star": 2,
	"img": "card/破神剑.jpg"
}
CARD13 = {
	"name": "闪电之剑",
	"type": "attone",
	"value": 28,
	"star": 3,
	"state": "ele",
	"img": "card/闪电之剑.jpg"
}
CARD14 = {
	"name": "圣剑",
	"type": "attone",
	"value": 32,
	"star": 4,
	"img": "card/圣剑.jpg"
}
CARD15 = {
	"name": "特殊飓风",
	"type": "magone",
	"value": 15,
	"star": 3,
	"img": "card/特殊飓风.jpg"
}
CARD16 = {
	"name": "天狗羽扇",
	"type": "attone",
	"value": 3,
	"star": 1,
	"img": "card/天狗羽扇.jpg"
}
CARD17 = {
	"name": "铁斧",
	"type": "attone",
	"value": 18,
	"star": 2,
	"img": "card/铁斧.jpg"
}
CARD18 = {
	"name": "银之弓矢",
	"type": "attone",
	"value": 30,
	"star": 3,
	"img": "card/银之弓矢.jpg"
}
CARD19 = {
	"name": "吸魂竹光",
	"type": "attone",
	"value": 10,
	"star": 1,
	"img": "card/竹光.jpg"
}
CARD20 = {
	"name": "宝石爆破",
	"type": "magone",
	"value": 20,
	"star": 3,
	"img": "card/宝石爆破.jpg"
}
CARD21 = {
	"name": "灼热之枪",
	"type": "attone",
	"value": 24,
	"star": 3,
	"state": "fire",
	"img": "card/灼热之枪.jpg"
}
CARD22 = {
	"name": "辐射炮",
	"type": "magone",
	"value": 28,
	"star": 4,
	"img": "card/辐射炮.jpg"
}
CARD23 = {
	"name": "钢铁巨剑",
	"type": "attone",
	"value": 15,
	"star": 2,
	"img": "card/钢铁巨剑.jpg"
}
CARD24 = {
	"name": "红宝石之光",
	"type": "heal",
	"value": 60,
	"star": 3,
	"img": "card/红宝石之光.jpg"
}
CARD25 = {
	"name": "卡通锁链",
	"type": "attall",
	"value": 10,
	"star": 2,
	"img": "card/卡通锁链.jpg"
}
CARD26 = {
	"name": "蓝宝石之光",
	"type": "heal",
	"value": 40,
	"star": 2,
	"img": "card/蓝宝石之光.jpg"
}
CARD27 = {
	"name": "魔法泡泡",
	"type": "magone",
	"value": 8,
	"star": 2,
	"img": "card/魔法泡泡.jpg"
}
CARD28 = {
	"name": "魔界之雷",
	"type": "magone",
	"value": 18,
	"star": 3,
	"state": "ele",
	"img": "card/魔界之雷.jpg"
}
CARD29 = {
	"name": "魔闪光",
	"type": "magall",
	"value": 8,
	"star": 3,
	"img": "card/魔闪光.jpg"
}
CARD30 = {
	"name": "扰乱三角波",
	"type": "magone",
	"value": 24,
	"star": 4,
	"img": "card/扰乱三角波.jpg"
}
CARD31 = {
	"name": "神鹰三角波",
	"type": "magone",
	"value": 24,
	"star": 4,
	"img": "card/神鹰三角波.jpg"
}
CARD32 = {
	"name": "深海锁链",
	"type": "attall",
	"value": 20,
	"star": 3,
	"img": "card/深海锁链.jpg"
}
CARD33 = {
	"name": "神鹰护甲",
	"type": "arm",
	"value": 60,
	"star": 3,
	"img": "card/神鹰护甲.jpg"
}
CARD34 = {
	"name": "暗之假面",
	"type": "arm",
	"value": 90,
	"star": 4,
	"img": "card/暗之假面.jpg"
}
CARD35 = {
	"name": "二重旋风",
	"type": "magall",
	"value": 11,
	"star": 4,
	"img": "card/二重旋风.jpg"
}
CARD36 = {
	"name": "大火葬",
	"type": "magall",
	"value": 17,
	"star": 4,
	"state": "fire",
	"img": "card/大火葬.jpg"
}
CARD37 = {
	"name": "毁灭之焰",
	"type": "magall",
	"value": 32,
	"star": 7,
	"state": "fire",
	"img": "card/毁灭之焰.jpg"
}
CARD38 = {
	"name": "雷击",
	"type": "magone",
	"value": 30,
	"star": 5,
	"state": "ele",
	"img": "card/雷击.jpg"
}
CARD39 = {
	"name": "女神的圣弓",
	"type": "attone",
	"value": 40,
	"star": 4,
	"img": "card/女神的圣弓.jpg"
}
CARD40 = {
	"name": "闪电漩涡",
	"type": "magall",
	"value": 20,
	"star": 5,
	"state": "ele",
	"img": "card/闪电漩涡.jpg"
}
CARD41 = {
	"name": "草薙剑",
	"type": "attone",
	"value": 42,
	"star": 5,
	"img": "card/草薙剑.jpg"
}
CARD42 = {
	"name": "地碎",
	"type": "attone",
	"value": 45,
	"star": 5,
	"img": "card/地碎.jpg"
}
CARD43 = {
	"name": "电子黑恶爪",
	"type": "attone",
	"value": 38,
	"star": 4,
	"img": "card/电子黑恶爪.jpg"
}
CARD44 = {
	"name": "旋风回力镖",
	"type": "attall",
	"value": 25,
	"star": 4,
	"img": "card/旋风回力镖.jpg"
}
CARD45 = {
	"name": "旋风剑",
	"type": "attall",
	"value": 30,
	"star": 4,
	"img": "card/旋风剑.jpg"
}
CARD46 = {
	"name": "打火石",
	"type": "attall",
	"value": 35,
	"star": 5,
	"state": "fire",
	"img": "card/打火石.jpg"
}

CARD47 = {
	"name": "混沌护盾",
	"type": "arm",
	"value": 120,
	"star": 6,
	"img": "card/混沌护盾.jpg"
}
CARD48 = {
	"name": "终极护甲",
	"type": "arm",
	"value": 150,
	"star": 7,
	"img": "card/终极护甲.jpg"
}
CARD49 = {
	"name": "圣光治疗",
	"type": "heal",
	"value": 150,
	"star": 7,
	"img": "card/圣光治疗.jpg"
}
CARD50 = {
	"name": "宝石治疗",
	"type": "heal",
	"value": 120,
	"star": 6,
	"img": "card/宝石治疗.jpg"
}
CARD51 = {
	"name": "闪电风暴",
	"type": "magone",
	"value": 50,
	"star": 9,
	"state": "ele",
	"img": "card/闪电风暴.jpg"
}
CARD52 = {
	"name": "无限雷击",
	"type": "magall",
	"value": 26,
	"star": 6,
	"state": "ele",
	"img": "card/无限雷击.jpg"
}
CARD53 = {
	"name": "燃烧大地",
	"type": "magall",
	"value": 14,
	"star": 4,
	"state": "fire",
	"img": "card/燃烧大地.jpg"
}
CARD54 = {
	"name": "转生爆炎",
	"type": "magone",
	"value": 34,
	"star": 6,
	"state": "fire",
	"img": "card/转生爆炎.jpg"
}
CARD55 = {
	"name": "死灵咒",
	"type": "effect",
	"value": 0,
	"star": 10,
	"effect": "死灵咒",
	"img": "card/死灵咒.jpg"
}
CARD56 = {
	"name": "DD炸弹",
	"type": "effect",
	"value": 0,
	"star": 10,
	"effect": "DD炸弹",
	"img": "card/DD炸弹.jpg"
}
CARD57 = {
	"name": "活命水",
	"type": "effect",
	"value": 0,
	"star": 10,
	"effect": "活命水",
	"img": "card/活命水.jpg"
}
CARD58 = {
	"name": "连锁破坏",
	"type": "effect",
	"value": 0,
	"star": 10,
	"effect": "连锁破坏",
	"img": "card/连锁破坏.jpg"
}
CARD59 = {
	"name": "炽焰飞腾",
	"type": "effect",
	"value": 0,
	"star": 10,
	"effect": "炽焰飞腾",
	"img": "card/炽焰飞腾.jpg"
}
CARD60 = {
	"name": "体力增强",
	"type": "effect",
	"value": 0,
	"star": 10,
	"effect": "体力增强",
	"img": "card/体力增强.jpg"
}
CARD61 = {
	"name": "终焉倒计",
	"type": "effect",
	"value": 0,
	"star": 10,
	"effect": "终焉倒计",
	"img": "card/终焉倒计.jpg"
}
CARD62 = {
	"name": "白净之水",
	"type": "heal",
	"value": 90,
	"star": 4,
	"img": "card/白净之水.jpg"
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
MonList["MON_DIAMOND_9"] = MON_DIAMOND_9;
MonList["MON_ALIEN_1"] = MON_ALIEN_1;
MonList["MON_ALIEN_2"] = MON_ALIEN_2;
MonList["MON_ALIEN_3"] = MON_ALIEN_3;
MonList["MON_ALIEN_4"] = MON_ALIEN_4;
MonList["MON_ALIEN_5"] = MON_ALIEN_5;
MonList["MON_ALIEN_6"] = MON_ALIEN_6;
MonList["MON_ALIEN_7"] = MON_ALIEN_7;
MonList["MON_ALIEN_8"] = MON_ALIEN_8;
MonList["MON_ALIEN_9"] = MON_ALIEN_9;
MonList["MON_ALIEN_10"] = MON_ALIEN_10;
MonList["MON_ALIEN_11"] = MON_ALIEN_11;
MonList["MON_ALIEN_12"] = MON_ALIEN_12;
MonList["MON_ALIEN_13"] = MON_ALIEN_13;
MonList["MON_ALIEN_14"] = MON_ALIEN_14;
MonList["MON_ALIEN_15"] = MON_ALIEN_15;
MonList["MON_ALIEN_16"] = MON_ALIEN_16;
MonList["MON_ALIEN_17"] = MON_ALIEN_17;
MonList["MON_ALIEN_18"] = MON_ALIEN_18;
MonList["MON_DIMEN_1"] = MON_DIMEN_1;
MonList["MON_DIMEN_2"] = MON_DIMEN_2;
MonList["MON_DIMEN_3"] = MON_DIMEN_3;
MonList["MON_DIMEN_4"] = MON_DIMEN_4;
MonList["MON_DIMEN_5"] = MON_DIMEN_5;
MonList["MON_DIMEN_6"] = MON_DIMEN_6;
MonList["MON_DIMEN_7"] = MON_DIMEN_7;
MonList["MON_DIMEN_8"] = MON_DIMEN_8;
MonList["MON_DIMEN_9"] = MON_DIMEN_9;
MonList["MON_DIMEN_10"] = MON_DIMEN_10;
MonList["MON_DIMEN_11"] = MON_DIMEN_11;
MonList["MON_DIMEN_12"] = MON_DIMEN_12;
MonList["MON_DIMEN_13"] = MON_DIMEN_13;
MonList["MON_DIMEN_14"] = MON_DIMEN_14;
MonList["MON_DIMEN_15"] = MON_DIMEN_15;

MonList["MON_HERO_1"] = MON_HERO_1;
MonList["MON_HERO_2"] = MON_HERO_2;
MonList["MON_HERO_3"] = MON_HERO_3;
MonList["MON_HERO_4"] = MON_HERO_4;
MonList["MON_HERO_5"] = MON_HERO_5;
MonList["MON_HERO_6"] = MON_HERO_6;
MonList["MON_HERO_7"] = MON_HERO_7;
MonList["MON_HERO_8"] = MON_HERO_8;
MonList["MON_HERO_9"] = MON_HERO_9;
MonList["MON_HERO_10"] = MON_HERO_10;
MonList["MON_HERO_11"] = MON_HERO_11;
MonList["MON_HERO_12"] = MON_HERO_12;
MonList["MON_HERO_13"] = MON_HERO_13;
MonList["MON_HERO_14"] = MON_HERO_14;
MonList["MON_HERO_15"] = MON_HERO_15;
MonList["MON_HERO_16"] = MON_HERO_16;
MonList["MON_HERO_17"] = MON_HERO_17;
MonList["MON_HERO_18"] = MON_HERO_18;










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
CardList["CARD47"] = CARD47;
CardList["CARD48"] = CARD48;
CardList["CARD49"] = CARD49;
CardList["CARD50"] = CARD50;
CardList["CARD51"] = CARD51;
CardList["CARD52"] = CARD52;
CardList["CARD53"] = CARD53;
CardList["CARD54"] = CARD54;
CardList["CARD55"] = CARD55;
CardList["CARD56"] = CARD56;
CardList["CARD57"] = CARD57;
CardList["CARD58"] = CARD58;
CardList["CARD59"] = CARD59;
CardList["CARD60"] = CARD60;
CardList["CARD61"] = CARD61;
CardList["CARD62"] = CARD62;

GameInfo = {
	win_counter: 0,
	lose_counter: 0,
	opportunity_counter: 0,
	star_counter: 0,
	card_star_level: 3,
	extra_cards: [CardUtil.getCardInstance(CARD1), CardUtil.getCardInstance(CARD2)]
}

TaskList["task_test_1"] = {
	"taskname": "task_test_1",
	"taskcontent": ["HAT_MON", "HAT_MON", "HAT_MON"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_test_2"] = {
	"taskname": "task_test_2",
	"taskcontent": ["HAT_MON", "FIRE_MON", "HAT_MON"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_test_3"] = {
	"taskname": "task_test_3",
	"taskcontent": ["FIRE_MON", "FIRE_MON", "FIRE_MON"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};

TaskList["task_diamond_1"] = {
	"taskname": "task_diamond_1",
	"task_env": "ENV_3",
	"taskcontent": ["MON_DIAMOND_1", "MON_DIAMOND_1", "MON_DIAMOND_1"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_diamond_2"] = {
	"taskname": "task_diamond_2",
	"task_env": "ENV_3",
	"taskcontent": ["MON_DIAMOND_1", "MON_DIAMOND_2", "MON_DIAMOND_1"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_diamond_3"] = {
	"taskname": "task_diamond_3",
	"task_env": "ENV_3",
	"taskcontent": ["MON_DIAMOND_1", "MON_DIAMOND_3", "MON_DIAMOND_2"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_diamond_4"] = {
	"taskname": "task_diamond_4",
	"task_env": "ENV_3",
	"taskcontent": ["MON_DIAMOND_3", "MON_DIAMOND_4", "MON_DIAMOND_2"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_diamond_5"] = {
	"taskname": "task_diamond_5",
	"task_env": "ENV_3",
	"taskcontent": ["MON_DIAMOND_3", "MON_DIAMOND_5", "MON_DIAMOND_4"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_diamond_6"] = {
	"taskname": "task_diamond_6",
	"task_env": "ENV_3",
	"taskcontent": ["MON_DIAMOND_5", "MON_DIAMOND_6", "MON_DIAMOND_4"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_diamond_7"] = {
	"taskname": "task_diamond_7",
	"task_env": "ENV_3",
	"taskcontent": ["MON_DIAMOND_5", "MON_DIAMOND_7", "MON_DIAMOND_6"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_diamond_8"] = {
	"taskname": "task_diamond_8",
	"task_env": "ENV_3",
	"taskcontent": ["MON_DIAMOND_7", "MON_DIAMOND_8", "MON_DIAMOND_6"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_diamond_9"] = {
	"taskname": "task_diamond_9",
	"task_env": "ENV_3",
	"taskcontent": ["MON_DIAMOND_7", "MON_DIAMOND_9", "MON_DIAMOND_6"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_diamond_10"] = {
	"taskname": "task_diamond_10",
	"task_env": "ENV_3",
	"taskcontent": ["MON_DIAMOND_9", "MON_DIAMOND_9", "MON_DIAMOND_9"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_diamond_11"] = {
	"taskname": "task_diamond_11",
	"task_env": "ENV_3",
	"taskcontent": ["MON_DIAMOND_9", "MON_DIAMOND_8", "MON_DIAMOND_9"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_diamond_12"] = {
	"taskname": "task_diamond_12",
	"task_env": "ENV_3",
	"taskcontent": ["MON_DIAMOND_8", "MON_DIAMOND_8", "MON_DIAMOND_8"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};


TaskList["task_alien_1"] = {
	"taskname": "task_alien_1",
	"task_env": "ENV_4",
	"taskcontent": ["MON_ALIEN_1", "MON_ALIEN_1", "MON_ALIEN_1"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_alien_2"] = {
	"taskname": "task_alien_2",
	"task_env": "ENV_4",
	"taskcontent": ["MON_ALIEN_1", "MON_ALIEN_2", "MON_ALIEN_1"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_alien_3"] = {
	"taskname": "task_alien_3",
	"task_env": "ENV_4",
	"taskcontent": ["MON_ALIEN_2", "MON_ALIEN_1", "MON_ALIEN_2"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_alien_4"] = {
	"taskname": "task_alien_4",
	"task_env": "ENV_4",
	"taskcontent": ["MON_ALIEN_2", "MON_ALIEN_2", "MON_ALIEN_2"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_alien_5"] = {
	"taskname": "task_alien_5",
	"task_env": "ENV_4",
	"taskcontent": ["MON_ALIEN_3", "MON_ALIEN_2", "MON_ALIEN_3"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_alien_6"] = {
	"taskname": "task_alien_6",
	"task_env": "ENV_4",
	"taskcontent": ["MON_ALIEN_2", "MON_ALIEN_3", "MON_ALIEN_4"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_alien_7"] = {
	"taskname": "task_alien_7",
	"task_env": "ENV_4",
	"taskcontent": ["MON_ALIEN_4", "MON_ALIEN_3", "MON_ALIEN_4"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_alien_8"] = {
	"taskname": "task_alien_8",
	"task_env": "ENV_4",
	"taskcontent": ["MON_ALIEN_5", "MON_ALIEN_2", "MON_ALIEN_5"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_alien_9"] = {
	"taskname": "task_alien_9",
	"task_env": "ENV_4",
	"taskcontent": ["MON_ALIEN_6", "MON_ALIEN_2", "MON_ALIEN_6"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_alien_10"] = {
	"taskname": "task_alien_10",
	"task_env": "ENV_4",
	"taskcontent": ["MON_ALIEN_6", "MON_ALIEN_6", "MON_ALIEN_6"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_alien_11"] = {
	"taskname": "task_alien_11",
	"task_env": "ENV_4",
	"taskcontent": ["MON_ALIEN_7", "MON_ALIEN_7", "MON_ALIEN_7"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_alien_12"] = {
	"taskname": "task_alien_12",
	"task_env": "ENV_4",
	"taskcontent": ["MON_ALIEN_6", "MON_ALIEN_7", "MON_ALIEN_8"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_alien_13"] = {
	"taskname": "task_alien_13",
	"task_env": "ENV_4",
	"taskcontent": ["MON_ALIEN_2", "MON_ALIEN_6", "MON_ALIEN_8"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_alien_14"] = {
	"taskname": "task_alien_14",
	"task_env": "ENV_4",
	"taskcontent": ["MON_ALIEN_6", "MON_ALIEN_9", "MON_ALIEN_6"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_alien_15"] = {
	"taskname": "task_alien_15",
	"task_env": "ENV_4",
	"taskcontent": ["MON_ALIEN_8", "MON_ALIEN_9", "MON_ALIEN_8"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_alien_16"] = {
	"taskname": "task_alien_16",
	"task_env": "ENV_4",
	"taskcontent": ["MON_ALIEN_10", "MON_ALIEN_9", "MON_ALIEN_10"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_alien_17"] = {
	"taskname": "task_alien_17",
	"task_env": "ENV_5",
	"taskcontent": ["MON_ALIEN_12", "MON_ALIEN_9", "MON_ALIEN_12"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_alien_18"] = {
	"taskname": "task_alien_18",
	"task_env": "ENV_5",
	"taskcontent": ["MON_ALIEN_11", "MON_ALIEN_13", "MON_ALIEN_11"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_alien_19"] = {
	"taskname": "task_alien_19",
	"task_env": "ENV_5",
	"taskcontent": ["MON_ALIEN_15", "MON_ALIEN_12", "MON_ALIEN_15"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_alien_20"] = {
	"taskname": "task_alien_20",
	"task_env": "ENV_5",
	"taskcontent": ["MON_ALIEN_15", "MON_ALIEN_14", "MON_ALIEN_16"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_alien_21"] = {
	"taskname": "task_alien_21",
	"task_env": "ENV_5",
	"taskcontent": ["MON_ALIEN_15", "MON_ALIEN_17", "MON_ALIEN_15"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_alien_22"] = {
	"taskname": "task_alien_22",
	"task_env": "ENV_5",
	"taskcontent": ["MON_ALIEN_17", "MON_ALIEN_18", "MON_ALIEN_15"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_alien_23"] = {
	"taskname": "task_alien_23",
	"task_env": "ENV_5",
	"taskcontent": ["MON_ALIEN_18", "MON_ALIEN_9", "MON_ALIEN_14"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_dimen_1"] = {
	"taskname": "task_dimen_1",
	"task_env": "ENV_9",
	"taskcontent": ["MON_DIMEN_2", "MON_DIMEN_1", "MON_DIMEN_2"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_dimen_2"] = {
	"taskname": "task_dimen_2",
	"task_env": "ENV_9",
	"taskcontent": ["MON_DIMEN_2", "MON_DIMEN_3", "MON_DIMEN_2"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_dimen_3"] = {
	"taskname": "task_dimen_3",
	"task_env": "ENV_9",
	"taskcontent": ["MON_DIMEN_2", "MON_DIMEN_4", "MON_DIMEN_2"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_dimen_4"] = {
	"taskname": "task_dimen_4",
	"task_env": "ENV_9",
	"taskcontent": ["MON_DIMEN_2", "MON_DIMEN_5", "MON_DIMEN_2"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_dimen_5"] = {
	"taskname": "task_dimen_5",
	"task_env": "ENV_9",
	"taskcontent": ["MON_DIMEN_2", "MON_DIMEN_6", "MON_DIMEN_2"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_dimen_6"] = {
	"taskname": "task_dimen_6",
	"task_env": "ENV_9",
	"taskcontent": ["MON_DIMEN_2", "MON_DIMEN_7", "MON_DIMEN_2"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_dimen_7"] = {
	"taskname": "task_dimen_7",
	"task_env": "ENV_2",
	"taskcontent": ["MON_DIMEN_8", "MON_DIMEN_8", "MON_DIMEN_8"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_dimen_8"] = {
	"taskname": "task_dimen_8",
	"task_env": "ENV_2",
	"taskcontent": ["MON_DIMEN_8", "MON_DIMEN_9", "MON_DIMEN_8"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_dimen_9"] = {
	"taskname": "task_dimen_9",
	"task_env": "ENV_2",
	"taskcontent": ["MON_DIMEN_9", "MON_DIMEN_9", "MON_DIMEN_9"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_dimen_10"] = {
	"taskname": "task_dimen_10",
	"task_env": "ENV_2",
	"taskcontent": ["MON_DIMEN_9", "MON_DIMEN_10", "MON_DIMEN_9"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_dimen_11"] = {
	"taskname": "task_dimen_11",
	"task_env": "ENV_2",
	"taskcontent": ["MON_DIMEN_10", "MON_DIMEN_10", "MON_DIMEN_10"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_dimen_12"] = {
	"taskname": "task_dimen_12",
	"task_env": "ENV_10",
	"taskcontent": ["MON_DIMEN_11", "MON_DIMEN_11", "MON_DIMEN_11"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_dimen_13"] = {
	"taskname": "task_dimen_13",
	"task_env": "ENV_10",
	"taskcontent": ["MON_DIMEN_11", "MON_DIMEN_12", "MON_DIMEN_11"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_dimen_14"] = {
	"taskname": "task_dimen_14",
	"task_env": "ENV_10",
	"taskcontent": ["MON_DIMEN_12", "MON_DIMEN_13", "MON_DIMEN_11"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_dimen_15"] = {
	"taskname": "task_dimen_15",
	"task_env": "ENV_10",
	"taskcontent": ["MON_DIMEN_12", "MON_DIMEN_14", "MON_DIMEN_13"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_dimen_16"] = {
	"taskname": "task_dimen_16",
	"task_env": "ENV_10",
	"taskcontent": ["MON_DIMEN_14", "MON_DIMEN_14", "MON_DIMEN_14"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_dimen_17"] = {
	"taskname": "task_dimen_17",
	"task_env": "ENV_10",
	"taskcontent": ["MON_DIMEN_12", "MON_DIMEN_15", "MON_DIMEN_13"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_dimen_18"] = {
	"taskname": "task_dimen_18",
	"task_env": "ENV_10",
	"taskcontent": ["MON_DIMEN_14", "MON_DIMEN_15", "MON_DIMEN_14"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_hero_1"] = {
	"taskname": "task_hero_1",
	"task_env": "ENV_6",
	"taskcontent": ["MON_HERO_2", "MON_HERO_1", "MON_HERO_2"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_hero_2"] = {
	"taskname": "task_hero_2",
	"task_env": "ENV_6",
	"taskcontent": ["MON_HERO_4", "MON_HERO_3", "MON_HERO_4"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_hero_3"] = {
	"taskname": "task_hero_3",
	"task_env": "ENV_6",
	"taskcontent": ["MON_HERO_6", "MON_HERO_5", "MON_HERO_6"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_hero_4"] = {
	"taskname": "task_hero_4",
	"task_env": "ENV_6",
	"taskcontent": ["MON_HERO_8", "MON_HERO_7", "MON_HERO_8"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_hero_5"] = {
	"taskname": "task_hero_5",
	"task_env": "ENV_6",
	"taskcontent": ["MON_HERO_10", "MON_HERO_9", "MON_HERO_10"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_hero_6"] = {
	"taskname": "task_hero_6",
	"task_env": "ENV_6",
	"taskcontent": ["MON_HERO_12", "MON_HERO_11", "MON_HERO_12"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_hero_7"] = {
	"taskname": "task_hero_7",
	"task_env": "ENV_6",
	"taskcontent": ["MON_HERO_5", "MON_HERO_1", "MON_HERO_3"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_hero_8"] = {
	"taskname": "task_hero_8",
	"task_env": "ENV_6",
	"taskcontent": ["MON_HERO_5", "MON_HERO_7", "MON_HERO_3"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_hero_9"] = {
	"taskname": "task_hero_9",
	"task_env": "ENV_6",
	"taskcontent": ["MON_HERO_5", "MON_HERO_7", "MON_HERO_9"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_hero_10"] = {
	"taskname": "task_hero_10",
	"task_env": "ENV_6",
	"taskcontent": ["MON_HERO_11", "MON_HERO_7", "MON_HERO_9"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_hero_11"] = {
	"taskname": "task_hero_11",
	"task_env": "ENV_1",
	"taskcontent": ["MON_HERO_13", "MON_HERO_13", "MON_HERO_13"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_hero_12"] = {
	"taskname": "task_hero_12",
	"task_env": "ENV_1",
	"taskcontent": ["MON_HERO_13", "MON_HERO_14", "MON_HERO_13"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_hero_13"] = {
	"taskname": "task_hero_13",
	"task_env": "ENV_1",
	"taskcontent": ["MON_HERO_13", "MON_HERO_15", "MON_HERO_13"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_hero_14"] = {
	"taskname": "task_hero_14",
	"task_env": "ENV_1",
	"taskcontent": ["MON_HERO_13", "MON_HERO_16", "MON_HERO_13"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_hero_15"] = {
	"taskname": "task_hero_15",
	"task_env": "ENV_1",
	"taskcontent": ["MON_HERO_13", "MON_HERO_17", "MON_HERO_13"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_hero_16"] = {
	"taskname": "task_hero_16",
	"task_env": "ENV_1",
	"taskcontent": ["MON_HERO_13", "MON_HERO_18", "MON_HERO_13"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_hero_17"] = {
	"taskname": "task_hero_17",
	"task_env": "ENV_1",
	"taskcontent": ["MON_HERO_17", "MON_HERO_13", "MON_HERO_18"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_hero_18"] = {
	"taskname": "task_hero_18",
	"task_env": "ENV_1",
	"taskcontent": ["MON_HERO_16", "MON_HERO_15", "MON_HERO_14"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_hero_19"] = {
	"taskname": "task_hero_19",
	"task_env": "ENV_8",
	"taskcontent": ["MON_HERO_16", "MON_HERO_15", "MON_HERO_17"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};
TaskList["task_hero_20"] = {
	"taskname": "task_hero_20",
	"task_env": "ENV_8",
	"taskcontent": ["MON_HERO_16", "MON_HERO_18", "MON_HERO_17"],
	"isComplete": "no",
	"isCompleteHard": "no",
	"isCompleteHell": "no"
};



ENV_1 = {
	name: "暗黑都市",
	desc: "每6个回合,为当前护甲最低的玩家或者怪兽增加15点护甲.",
	img: "bg/暗黑都市.jpg",
	effect: function(plyr, com1, com2, com3, turn) {
		if (turn.index % 6 == 0) {
			let role = null;
			let arr = [plyr];
			if (com1.hp > 0) arr.push(com1);
			if (com2.hp > 0) arr.push(com2);
			if (com3.hp > 0) arr.push(com3);
			arr.sort((a, b) => {
				return a.ac - b.ac;
			});
			role = arr[0];
			if (role.maxAc - role.ac > 15) {
				role.ac += 15;
			} else {
				role.ac = role.maxAc;
			}
			console.log(role);
			console.log("↑被选为场地效果的对象!");
			return role;
		} else {
			return null;
		}
	}
}
ENV_2 = {
	name: "暗",
	desc: "每6个回合,给当前HP最低的角色造成10点魔法伤害.",
	img: "bg/暗.jpg",
	effect: function(plyr, com1, com2, com3, turn) {
		if (turn.index % 6 == 0) {
			let role = null;
			let arr = [plyr];
			if (com1.hp > 0) arr.push(com1);
			if (com2.hp > 0) arr.push(com2);
			if (com3.hp > 0) arr.push(com3);
			arr.sort((a, b) => {
				return a.hp - b.hp;
			});
			role = arr[0];

			if (role.hp > 10) {
				role.hp -= 10;
			} else {
				role.hp = 0;
			}
			console.log(role);
			console.log("↑被选为场地效果的对象!");
			return role;
		} else {
			return null;
		}
	}
}
ENV_3 = {
	name: "古代都市",
	desc: "每6个回合,给当前HP最低的角色恢复10点HP,并给与其1点燃烧状态",
	img: "bg/古代都市.jpg",
	effect: function(plyr, com1, com2, com3, turn) {
		if (turn.index % 6 == 0) {
			let role = null;
			let arr = [plyr];
			if (com1.hp > 0) arr.push(com1);
			if (com2.hp > 0) arr.push(com2);
			if (com3.hp > 0) arr.push(com3);
			arr.sort((a, b) => {
				return a.hp - b.hp;
			});
			role = arr[0];
			if (role.maxHp - role.hp > 10) {
				role.hp += 10;
			} else {
				role.hp = role.maxHp;
			}
			console.log(role);
			console.log("↑被选为场地效果的对象!");
			return role;
		} else {
			return null;
		}
	}
}
ENV_4 = {
	name: "病毒城市",
	desc: "每6个回合,对当前所有角色造成5点魔法伤害.",
	img: "bg/病毒城市.jpg",
	effect: function(plyr, com1, com2, com3, turn) {
		if (turn.index % 6 == 0) {
			if (plyr.hp > 5) {
				plyr.hp -= 5;
			} else {
				plyr.hp = 0;
			}

			if (com1.hp > 5) {
				com1.hp -= 5;
			} else {
				com1.hp = 0;
			}

			if (com2.hp > 5) {
				com2.hp -= 5;
			} else {
				com2.hp = 0;
			}

			if (com3.hp > 5) {
				com3.hp -= 5;
			} else {
				com3.hp = 0;
			}

			return "all";
		} else {
			return null;
		}
	}
}
ENV_5 = {
	name: "异界空间",
	desc: "每6个回合,所有怪兽随机能力提升5,玩家获得1点连击能量.",
	img: "bg/异界空间.jpg",
	effect: function(plyr, com1, com2, com3, turn) {
		if (turn.index % 6 == 0) {
			com1.actions[0].value += 5;
			com2.actions[0].value += 5;
			com3.actions[0].value += 5;
			turn.chainCounter += 1;
			return "all";
		} else {
			return null;
		}
	}
}
ENV_6 = {
	name: "摩天楼",
	desc: "每6个回合,所有角色护甲提升15.",
	img: "bg/摩天楼.jpg",
	effect: function(plyr, com1, com2, com3, turn) {
		if (turn.index % 6 == 0) {
			if (com1.maxAc - com1.ac > 15) {
				com1.ac += 15;
			} else {
				com1.ac = com1.maxAc;
			}

			if (com2.maxAc - com2.ac > 15) {
				com2.ac += 15;
			} else {
				com2.ac = com2.maxAc;
			}

			if (com3.maxAc - com3.ac > 15) {
				com3.ac += 15;
			} else {
				com3.ac = com3.maxAc;
			}

			if (plyr.maxAc - plyr.ac > 15) {
				plyr.ac += 15;
			} else {
				plyr.ac = plyr.maxAc;
			}

			return "all";
		} else {
			return null;
		}
	}
}
ENV_7 = {
	name: "拟似空间",
	desc: "每6个回合,所有角色最大HP提升5.",
	img: "bg/拟似空间.jpg",
	effect: function(plyr, com1, com2, com3, turn) {
		if (turn.index % 6 == 0) {
			plyr.maxHp += 5;
			com1.maxHp += 5;
			com2.maxHp += 5;
			com3.maxHp += 5;
			return "all";
		} else {
			return null;
		}
	}
}
ENV_8 = {
	name: "天火的牢狱",
	desc: "每4个回合,对某一带有燃烧状态的角色造成状态点数×5的魔法伤害,然后清除其燃烧状态.",
	img: "bg/天火的牢狱.jpg",
	effect: function(plyr, com1, com2, com3, turn) {
		if (turn.index % 4 == 0) {
			let role = null;
			let role_arr = [];

			if (player.states && player.hp > 0 && MonData.hasState(player, "fire")) {
				role_arr.push(player);
			}
			if (com1.states && com1.hp > 0 && MonData.hasState(com1, "fire")) {
				role_arr.push(com1);
			}
			if (com2.states && com2.hp > 0 && MonData.hasState(com2, "fire")) {
				role_arr.push(com2);
			}
			if (com3.states && com3.hp > 0 && MonData.hasState(com3, "fire")) {
				role_arr.push(com3);
			}
			if (role_arr.length > 0) {
				role = role_arr.shuffle().shuffle()[0];
				let val = MonData.getStateValue(role, "fire") * 5;
				if (role.hp > val) {
					role.hp -= val;
				} else {
					role.hp = 0;
				}
				MonData.clearState(role, "fire");
			}
			console.log(role);
			console.log("↑被选为场地效果的对象!");
			return role;
		} else {
			return null;
		}
	}
}
ENV_9 = {
	name: "死域海",
	desc: "每6个回合,将随意角色的HP减少10，护甲增加20.",
	img: "bg/死域海.jpg",
	effect: function(plyr, com1, com2, com3, turn) {
		if (turn.index % 6 == 0) {
			let role = null;
			let role_arr = [];
			if (plyr.hp > 0) {
				role_arr.push(plyr);
			}
			if (com1.hp > 0) {
				role_arr.push(com1);
			}
			if (com2.hp > 0) {
				role_arr.push(com2);
			}
			if (com3.hp > 0) {
				role_arr.push(com3);
			}
			role = role_arr.shuffle().shuffle()[0];

			if (role.hp > 10) {
				role.hp -= 10;
				if (role.maxAc - role.ac > 20) {
					role.ac += 20;
				} else {
					role.ac = role.maxAc;
				}
			} else {
				role.hp = 0;
			}
			console.log(role);
			console.log("↑被选为场地效果的对象!");
			return role;
		} else {
			return null;
		}
	}
}
ENV_10 = {
	name: "异次元的缝隙",
	desc: "每6个回合,将所有角色的状态消除，每消除1点状态减少5点HP",
	img: "bg/异次元的缝隙.jpg",
	effect: function(plyr, com1, com2, com3, turn) {
		if (turn.index % 6 == 0) {
			let role_arr = [plyr, com1, com2, com3];
			for (let j = 0; j < role_arr.length; j++) {
				let role = role_arr[j];
				if (role.states && role.hp > 0) {
					let counter = 0;
					for (let i = 0; i < role.states.length; i++) {
						counter += role.states[i].value * 5;
					}
					if (role.hp > counter) {
						role.hp -= counter;
					} else {
						role.hp = 0;
					}
					role.states = [];
				}
			}
			return "all";
		} else {
			return null;
		}
	}
}
FieldBG.push(ENV_1);
FieldBG.push(ENV_2);
FieldBG.push(ENV_3);
FieldBG.push(ENV_4);
FieldBG.push(ENV_5);
FieldBG.push(ENV_6);
FieldBG.push(ENV_7);
FieldBG.push(ENV_8);
FieldBG.push(ENV_9);
FieldBG.push(ENV_10);
