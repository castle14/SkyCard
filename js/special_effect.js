var RoleEffect = {};
var CardEffect = {};


RoleEffect["1599"] = {
	"desc": "将护甲清零,将HP补满,对某一怪兽进行原有护甲数值4倍的物理攻击.",
	"type": "attone",
	"effect": function(plyr, com, turn, counter) {
		let t = plyr.ac * 4;
		let = chkd_cd_inf = {};
		chkd_cd_inf.name = "技能";
		chkd_cd_inf.type = "attone";
		chkd_cd_inf.counter = 1;
		chkd_cd_inf.value = t;

		plyr.ac = 0;
		plyr.hp = plyr.maxHp;
		return chkd_cd_inf;
	}
}

RoleEffect["1602"] = {
	"desc": "将HP减半,将护甲补满,对某一怪兽进行HP已损失值2倍魔法攻击.",
	"type": "magone",
	"effect": function(plyr, com, turn, counter) {
		let = chkd_cd_inf = {};
		let t = plyr.maxHp - Math.floor(plyr.hp / 2);
		chkd_cd_inf.name = "技能";
		chkd_cd_inf.type = "magone";
		chkd_cd_inf.counter = 1;
		chkd_cd_inf.value = t * 2;

		plyr.hp = Math.floor(plyr.hp / 2);
		plyr.ac = plyr.maxAc;
		return chkd_cd_inf;
	}
}

RoleEffect["1601"] = {
	"desc": "将HP减为1,对所有怪兽进行HP减少值的魔法攻击.",
	"type": "magall",
	"effect": function(plyr, com, turn, counter) {
		let = chkd_cd_inf = {};
		let t = Math.floor((plyr.hp - 1));
		chkd_cd_inf.name = "技能";
		chkd_cd_inf.type = "magall";
		chkd_cd_inf.counter = 1;
		chkd_cd_inf.value = t;
		plyr.hp = 1;

		return chkd_cd_inf;
	}
}

RoleEffect["1600"] = {
	"desc": "将玩家的护甲减半,将玩家的HP补满,对某一怪兽进行护甲和HP变化值2倍的物理攻击.",
	"type": "attone",
	"effect": function(plyr, com, turn, counter) {
		let = chkd_cd_inf = {};
		let t = plyr.ac + 2 * (plyr.maxHp - plyr.hp);
		chkd_cd_inf.name = "技能";
		chkd_cd_inf.type = "attone";
		chkd_cd_inf.counter = 1;
		chkd_cd_inf.value = t;

		plyr.ac = Math.floor(plyr.ac / 2);
		plyr.hp = plyr.maxHp;

		return chkd_cd_inf;
	}
}

RoleEffect["3618"] = {
	"desc": "将玩家的护甲补满,对所有怪兽进行恢复数值的物理攻击.",
	"type": "attall",
	"effect": function(plyr, com, turn, counter) {
		let = chkd_cd_inf = {};
		let t = plyr.maxAc - plyr.ac;
		chkd_cd_inf.name = "技能";
		chkd_cd_inf.type = "attall";
		chkd_cd_inf.counter = 1;
		chkd_cd_inf.value = t;

		plyr.ac = plyr.maxAc;

		return chkd_cd_inf;
	}
}

RoleEffect["英雄小子"] = {
	"desc": "将HP和护甲补满,对某一怪兽进行恢复值之和一半的物理攻击.",
	"type": "attone",
	"effect": function(plyr, com, turn, counter) {
		let t1 = plyr.maxHp - plyr.hp;
		let t2 = plyr.maxAc - plyr.ac;
		let = chkd_cd_inf = {};
		chkd_cd_inf.name = "技能";
		chkd_cd_inf.type = "attone";
		chkd_cd_inf.counter = 1;
		chkd_cd_inf.value = Math.floor((t1 + t2) / 2);

		plyr.ac = plyr.maxAc;
		plyr.hp = plyr.maxHp;
		return chkd_cd_inf;
	}
}
RoleEffect["爆热女郎1"] = {
	"desc": "将玩家的HP补满,对某一怪兽进行卡组剩余卡片数×15的魔法攻击.",
	"type": "magone",
	"effect": function(plyr, com, turn, counter) {
		let t = turn.deck.length * 15;
		let chkd_cd_inf = {};
		chkd_cd_inf.name = "技能";
		chkd_cd_inf.type = "magone";
		chkd_cd_inf.counter = 1;
		chkd_cd_inf.value = t;
		plyr.hp = plyr.maxHp;
		return chkd_cd_inf;
	}
}
RoleEffect["爆热女郎2"] = {
	"desc": "将玩家的HP补满,对所有怪兽进行弃卡池卡片数×8的魔法攻击.",
	"type": "magall",
	"effect": function(plyr, com, turn, counter) {
		let t = turn.discardList.length * 8;
		let chkd_cd_inf = {};
		chkd_cd_inf.name = "技能";
		chkd_cd_inf.type = "magall";
		chkd_cd_inf.counter = 1;
		chkd_cd_inf.value = t;
		plyr.hp = plyr.maxHp;
		return chkd_cd_inf;
	}
}
RoleEffect["炽热侠"] = {
	"desc": "将玩家的HP补满,对某一怪兽进行当前回合数×5的魔法攻击.",
	"type": "magone",
	"effect": function(plyr, com, turn, counter) {
		let t = turn.index * 5;
		let chkd_cd_inf = {};
		chkd_cd_inf.name = "技能";
		chkd_cd_inf.type = "magone";
		chkd_cd_inf.counter = 1;
		chkd_cd_inf.value = t;
		plyr.hp = plyr.maxHp;
		return chkd_cd_inf;
	}
}


/*-----------------------------------------------------------------------------------------------------------------------------------------------*/


CardEffect["死灵咒"] = {
	"desc": "给与目标已损失护甲数值一半的魔法攻击.",
	"type": "magone",
	"effect": function(plyr, com, turn, counter) {
		let t = Math.floor((com.maxAc - com.ac) / 2);

		let = chkd_cd_inf = {};
		chkd_cd_inf.name = "死灵咒";
		chkd_cd_inf.type = "magone";
		chkd_cd_inf.counter = counter;
		chkd_cd_inf.value = t * counter;

		return chkd_cd_inf;
	}
}
CardEffect["DD炸弹"] = {
	"desc": "给与目标当前HP一半的物理攻击，但不超过120点.",
	"type": "attone",
	"effect": function(plyr, com, turn, counter) {
		let t = Math.floor(com.hp / 2);
		if (t > 120) {
			t = 120;
		}
		let = chkd_cd_inf = {};
		chkd_cd_inf.name = "DD炸弹";
		chkd_cd_inf.type = "attone";
		chkd_cd_inf.counter = counter;
		chkd_cd_inf.value = t * counter;

		return chkd_cd_inf;
	}
}
CardEffect["活命水"] = {
	"desc": "恢复自身HP最大值的25%,若当前HP不大于最大值的25%,则恢复HP至最大.",
	"type": "heal",
	"effect": function(plyr, com, turn, counter) {
		let t = Math.floor(plyr.maxHp / 4);
		if (plyr.hp <= (plyr.maxHp / 4)) {
			t = plyr.maxHp - plyr.hp;
		}

		let = chkd_cd_inf = {};
		chkd_cd_inf.name = "活命水";
		chkd_cd_inf.type = "heal";
		chkd_cd_inf.counter = counter;
		chkd_cd_inf.value = t * counter;

		return chkd_cd_inf;
	}
}
CardEffect["连锁破坏"] = {
	"desc": "对某一怪兽进行30点的物理攻击;同时使用多张此卡时,攻击增加.",
	"type": "attone",
	"effect": function(plyr, com, turn, counter) {
		let t = 30;

		let = chkd_cd_inf = {};
		chkd_cd_inf.name = "连锁破坏";
		chkd_cd_inf.type = "attone";
		chkd_cd_inf.counter = counter;
		chkd_cd_inf.value = t * counter + (counter - 1) * counter * 0.5 * 20;

		return chkd_cd_inf;
	}
}
CardEffect["炽焰飞腾"] = {
	"desc": "对某一怪兽进行20点的魔法攻击,并附加1点燃烧状态;同时使用多张此卡时,攻击增加.",
	"type": "magone",
	"effect": function(plyr, com, turn, counter) {
		let t = 30;

		let = chkd_cd_inf = {};
		chkd_cd_inf.name = "炽焰飞腾";
		chkd_cd_inf.type = "magone";
		chkd_cd_inf.counter = counter;
		chkd_cd_inf.state = "fire";
		chkd_cd_inf.value = t * counter + (counter - 1) * counter * 0.5 * 20;

		return chkd_cd_inf;
	}
}
CardEffect["体力增强"] = {
	"desc": "恢复30点HP,并增加3点技能点.",
	"type": "heal",
	"effect": function(plyr, com, turn, counter) {
		turn.chainCounter = 3 * counter + turn.chainCounter;

		let t = 30;

		let = chkd_cd_inf = {};
		chkd_cd_inf.name = "体力增强";
		chkd_cd_inf.type = "heal";
		chkd_cd_inf.counter = counter;
		chkd_cd_inf.value = t * counter;

		return chkd_cd_inf;
	}
}
CardEffect["终焉倒计"] = {
	"desc": "对所有怪兽进行当前回合数×2的魔法攻击.",
	"type": "magall",
	"effect": function(plyr, com, turn, counter) {

		let t = 2;

		let = chkd_cd_inf = {};
		chkd_cd_inf.name = "终焉倒计";
		chkd_cd_inf.type = "magall";
		chkd_cd_inf.counter = counter;
		chkd_cd_inf.value = t * counter * turn.index;

		return chkd_cd_inf;
	}
}
