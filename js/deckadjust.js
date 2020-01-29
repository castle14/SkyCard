var tmp_gameinfo = CommonUtil.getGameInfo();
var extra_cards = tmp_gameinfo.extra_cards.sort(card_compare);;
var tmpdeck = CommonUtil.getDeckStorage().sort(card_compare);


function card_compare(c1, c2) {
	if ((c1.value - c2.value) != 0) {
		return c1.value - c2.value;
	} else {
		return c1.name.localeCompare(c2.name, "zh");
	}
};

function getTxColor(atttype) {
	if (atttype.indexOf("att") != -1) {
		return "att_color";
	} else if (atttype.indexOf("mag") != -1) {
		return "mag_color";
	} else if (atttype.indexOf("heal") != -1) {
		return "heal_color";
	} else {
		return "arm_color";
	}
}

function refresh_extra_card_div() {
	for (let i = 0; i < extra_cards.length; i++) {
		let tmp_tx_color = getTxColor(extra_cards[i].type);
		let tmp_card = extra_cards[i];
		let tmp_div_str = "";
		tmp_div_str = tmp_div_str + '<div class="card_div extra_card_div" card_info=\'' + tmp_card.id +
			'\'>';
		tmp_div_str = tmp_div_str + '<div class="img_div"><img src="../img/' + tmp_card.img + '"></div>';
		tmp_div_str = tmp_div_str + '<div class="name_div">' + tmp_card.name + '·' +tmp_card.star + '☆'+ '</div>';
		tmp_div_str = tmp_div_str + '<div class="data_div"><span class="' + tmp_tx_color + '">' + CommonUtil.getAtkType(tmp_card.type) + '·' +
			tmp_card.value + '</span></div>';
		tmp_div_str = tmp_div_str + '<div class="info_div">';
		tmp_div_str = tmp_div_str + '</div></div>';
		$(tmp_div_str).appendTo($(".content_div_1"));
	}
}

function refresh_deck_card_div() {
	for (let j = 0; j < tmpdeck.length; j++) {
		let tmp_tx_color = getTxColor(tmpdeck[j].type);
		let tmp_card = tmpdeck[j];
		let tmp_div_str = "";
		tmp_div_str = tmp_div_str + '<div class="card_div deck_card_div" card_info=\'' + tmp_card.id +
			'\'>';
		tmp_div_str = tmp_div_str + '<div class="img_div"><img src="../img/' + tmp_card.img + '"></div>';
		tmp_div_str = tmp_div_str + '<div class="name_div">' + tmp_card.name + '·' +tmp_card.star + '☆'+ '</div>';
		tmp_div_str = tmp_div_str + '<div class="data_div"><span class="' + tmp_tx_color + '">' + CommonUtil.getAtkType(tmp_card.type) + '·' +
			tmp_card.value + '</span></div>';
		tmp_div_str = tmp_div_str + '<div class="info_div">';
		tmp_div_str = tmp_div_str + '</div></div>';
		$(tmp_div_str).appendTo($(".content_div_2"));
	}
}


$(function() {
	$(".back_div").on("click", function() {
		location.href = "index.html";
	});

	// console.log(extra_cards);
	refresh_extra_card_div();
	refresh_deck_card_div();
	$("#checked_number_div span").text(CommonUtil.getGameInfo().star_counter);
	$(".extra_card_div").on("click", function() {
		$(".extra_card_div").removeClass("checked_div");
		$(this).addClass("checked_div");
	});
	$(".deck_card_div").on("click", function() {
		$(".deck_card_div").removeClass("checked_div");
		$(this).addClass("checked_div");
	});
	$("#decompose_card_btn").on("click", function() {
		let card_in_extra_id = $(".content_div_1 .checked_div").attr("card_info");
		let card_star = 0;
		if (card_in_extra_id) {
			let r = confirm("你确定分解这张卡片？");
			if (r == true) {
				extra_cards.forEach(function(item, index, arr) {
					if (item.id == card_in_extra_id) {
						card_star = item.star;
						tmpdeck.push(item);
						arr.splice(index, 1);
					}
				});
				tmp_gameinfo.star_counter += card_star;
				CommonUtil.saveGameInfo(tmp_gameinfo);
				location.reload();
			}
		}
	});
	$("#save_deck_btn").on("click", function() {
		if (Math.floor(CommonUtil.getGameInfo().star_counter / 10) <= 0) {
			alert("★不足!");
		} else {

			let card_in_extra_id = $(".content_div_1 .checked_div").attr("card_info");
			let card_in_deck_id = $(".content_div_2 .checked_div").attr("card_info");
			console.log(card_in_extra_id);
			console.log(card_in_deck_id);
			if (card_in_extra_id && card_in_deck_id) {
				extra_cards.forEach(function(item, index, arr) {
					if (item.id == card_in_extra_id) {
						tmpdeck.push(item);
						arr.splice(index, 1);
					}
				});
				tmpdeck.forEach(function(item, index, arr) {
					if (item.id == card_in_deck_id) {
						extra_cards.push(item);
						arr.splice(index, 1);
					}
				});
				console.log(tmp_gameinfo);
				console.log(tmpdeck);
				tmp_gameinfo.star_counter -= 10;
				CommonUtil.saveDeckStorage(tmpdeck.shuffle());
				CommonUtil.saveGameInfo(tmp_gameinfo);
				location.reload();
			}
		}
	});
});
