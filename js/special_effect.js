var RoleEffect = {}


RoleEffect["1599"] = {
	"desc": "将护甲清零,对某一怪兽进行原有护甲数值的物理攻击.",
	"type": "attone",
	"effect": function(plyr) {
		let t = plyr.ac;
		let = chkd_cd_inf = {};
		chkd_cd_inf.name = "技能";
		chkd_cd_inf.type = "attone";
		chkd_cd_inf.counter = 1;
		chkd_cd_inf.value = t;
		plyr.ac = 0;
		return chkd_cd_inf;
	}
}

RoleEffect["1602"] = {
	"desc": "将HP减半,对某一怪兽进行HP减少数值的魔法攻击.",
	"type": "magone",
	"effect": function(plyr) {
		let = chkd_cd_inf = {};
		let t = Math.floor(plyr.hp / 2);
		chkd_cd_inf.name = "技能";
		chkd_cd_inf.type = "magone";
		chkd_cd_inf.counter = 1;
		chkd_cd_inf.value = t;
		plyr.hp = plyr.hp - t;
		return chkd_cd_inf;
	}
}

RoleEffect["1601"] = {
	"desc": "将HP减为1,对所有怪兽进行HP减少值一半的魔法攻击.",
	"type": "magall",
	"effect": function(plyr) {
		let = chkd_cd_inf = {};
		let t = Math.floor((plyr.hp - 1) / 2);
		chkd_cd_inf.name = "技能";
		chkd_cd_inf.type = "magall";
		chkd_cd_inf.counter = 1;
		chkd_cd_inf.value = t;
		plyr.hp = 1;

		return chkd_cd_inf;
	}
}

RoleEffect["1600"] = {
	"desc": "将玩家的护甲减半,将玩家的HP补满,对某一怪兽进行护甲减少值的物理攻击.",
	"type": "attone",
	"effect": function(plyr) {
		let = chkd_cd_inf = {};
		let t = Math.floor(plyr.ac / 2);
		chkd_cd_inf.name = "技能";
		chkd_cd_inf.type = "attone";
		chkd_cd_inf.counter = 1;
		chkd_cd_inf.value = t;

		plyr.ac = plyr.ac - t;
		plyr.hp = plyr.maxHp;

		return chkd_cd_inf;
	}
}

RoleEffect["3618"] = {
	"desc": "将护甲清零,对所有怪兽进行原有护甲数值一半的物理攻击.",
	"type": "attall",
	"effect": function(plyr) {
		let = chkd_cd_inf = {};
		let t = Math.floor(plyr.ac / 2);
		chkd_cd_inf.name = "技能";
		chkd_cd_inf.type = "attall";
		chkd_cd_inf.counter = 1;
		chkd_cd_inf.value = t;

		plyr.ac = 0;

		return chkd_cd_inf;
	}
}

RoleEffect["英雄小子"] = {
	"desc": "将HP和护甲恢复至上限,对某一怪兽进行恢复值之和的物理攻击.",
	"type": "attone",
	"effect": function(plyr) {
		let t1 = plyr.maxHp - plyr.hp;
		let t2 = plyr.maxAc - plyr.ac;
		let = chkd_cd_inf = {};
		chkd_cd_inf.name = "技能";
		chkd_cd_inf.type = "attone";
		chkd_cd_inf.counter = 1;
		chkd_cd_inf.value = t1 + t2;

		plyr.ac = plyr.maxAc;
		plyr.hp = plyr.maxHp;
		return chkd_cd_inf;
	}
}
