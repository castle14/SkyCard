var player1 = null;
var player2 = null;
var player3 = null;

/**
 * 创建Player类
 **/
class Player {
	constructor(divid) { //constructor是一个构造方法，用来接收参数
		this.divid = divid; //this代表的是实例对象
	}
	gotoAtt(fn){
		Anim.playerGoAct(this.divid, fn);
	}
}

function initMonAndPlayer() {
	player1 = new Player("player_1");
	player2 = new Player("player_2");
	player3 = new Player("player_3");
}


function initClick() {
	$("#btn1").on("click", function() {
		player1.gotoAtt();
		player2.gotoAtt();
		player3.gotoAtt();
	});
}













$(function() {
	initMonAndPlayer();
	// initBackground();
	initClick();
});
