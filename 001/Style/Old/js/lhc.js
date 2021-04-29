$(function () {
    var a, b, c, d, bet = 1, bet_n = 0, bline, bval;
    for (var i = 1; i <= 9; i++) {
        if (!in_array(i, tz_types)) {
            a = $('.menu').find("a[data-t='" + i + "']");
            a.parent().is("li") ? a.parent().remove() : a.remove();
            $('.game-type-' + i).remove();
        }
    } 
    //显示更多下注
    $(".game-hd .menu").find("li").click(function () {
        if ($(this).hasClass("more-game")) {
            $(this).toggleClass("on");
            $(this).hasClass("on") ? $(".sub-menu").show() : $(".sub-menu").hide();;
        } else {
            $(this).siblings().removeClass('on');
            $(".sub-menu").hide();
        };
    })
    //切换下注方式
    $(".game-hd .menu").find("a").click(function () {
        var a = $(this), d = a.data(); if (!d.t) return;
        $(".game-hd .menu").find("a").removeClass("on");
        a.addClass("on"), $("#game-gtype,.game-tit").html(a.text()), $(".sub-menu").hide(), $('.gamenum').hide(),
            $('.game-type-' + d.t).show(), bet = d.t, show_bet();
    });
    //下注选择
    $(".game-bd a.btn").click(function () {
        $(this).toggleClass('on');
        show_bet();
    });
    //清空
    $(".clearnum").click(function () {
        $(".game-bd a.btn").removeClass("on");
        show_bet();
    });
    $(".money_clear").click(function () {
        $(this).prev().val('');
        show_bet();
    });
    $("input.bet_money").keyup(function () {
        show_bet();
    });
    $("i[data-money]").click(function () {
        var a = $(".bet_money"), m = $(this).data("money"), n = a.val() * 1;
        a.val(n + m);
        show_bet();
    });
    var show_bet = function () {
        var t = $(".game-type-" + bet); bline = [], bval = [];
        t.find('a.on[data-line]').each(function (i, o) {
            bline.push($(this).data('line'));
        });
        t.find('a.on[data-val]').each(function (i, o) {
            bval.push($(this).data('val'));
        });
        bet_n = 0;
		var cheng = chu = '';
		//计算注数 bet_n注数
        switch (bet) {
            case 4:
				//复式注数算法
				for(var i=0; i<bline.length; i++){
					cheng = chu = '';
					if(bval.length<bline[i]){
						break	
					}
					for(var ii=0; ii<bline[i]; ii++){
						cheng += (bval.length-ii)+'*';
						chu += '/'+(bline[i]-ii);
					}
					bet_n+=eval(cheng.substring(0,cheng.length-1)+chu);
				}
                break;
			case 5:
				//复式注数算法
				for(var i=0; i<bline.length; i++){
					cheng = chu = '';
					if(bval.length<bline[i]){
						break	
					}
					for(var ii=0; ii<bline[i]; ii++){
						cheng += (bval.length-ii)+'*';
						chu += '/'+(bline[i]-ii);
					}
					bet_n+=eval(cheng.substring(0,cheng.length-1)+chu);
					//console.log(cheng.substring(0,cheng.length-1)+chu);
				}
                break;
            default:
                bet_n = bline.length * bval.length;
                break;
        }
        $("#bet_num").html("共<b>" + bet_n + "</b>注");
        $('.bet_n').html(bet_n);
        var bet_money = $("input.bet_money").val() || 0;
        $('.bet_total').html(bet_n * bet_money);
        if (bline.length > 0 || bval.length > 0) {
            $(".infuse").show();
            $(".clearnum").addClass('on');
        } else {
            $(".clearnum").removeClass('on');
            $(".infuse").hide();
        }
        if (bet_n > 0) {
            $(".confirm-pour").addClass('on');
        } else {
            $(".confirm-pour").removeClass('on');
        }
    }

	//确认下注 bl余额 bet_money金额
    $("a.confirm").click(function () {
        var bl = $("b.balance").text() * 1, msg1, msg2, msg = [],
            bet_money = $("input.bet_money").val() * 1;
        if (bet_money == 0) { zy.tips("请输入下注金额"); return; }
        if (bet_money * bet_n > bl) { zy.tips("您的余点不足"); return; }
        switch (bet) {
			case 1:
				msg1 = '';
				$.each(bline, function (i, v) {
					if(v != 8){
						msg1 = msg1+String(v); 
					}else{
						msg.push(bval.join("") + "/" + bet_money);
					}
				});
				if(msg1 != ''){
					msg.push( msg1 + "/" + bval.join("") + "/" + bet_money);
				}
                
				console.log(msg);
                break;
            case 2:
				msg1 = bline.join("");
				$.each(bval, function (i, v) { 
					msg[i] = msg1 + "/" + v + "/" + bet_money;
				});
                break;
			case 3:
				msg1 = bline.join("");
				msg2 = bval.join(".");
                msg[0] = msg1 + "/" + msg2 + "/" + bet_money;
                break;
			case 4:
				msg2 = bval.join("");
				$.each(bline, function (i, v) { msg[i] = v + "肖/" + msg2 + "/" + bet_money });
                break;
            case 5:
				msg2 = bval.join(".");
				$.each(bline, function (i, v) { msg[i] = v + "中/" + msg2 + "/" + bet_money });
                break;
            default:
                msg1 = bline.join("");
                $.each(bval, function (i, v) { msg[i] = msg1 + "/" + v + "/" + bet_money });
                break;
        }
        if (msg.count < 1) return;
        $.each(msg, function (i, m) {
            //console.log(m);
            send_msg(m);
        });
        $("#touzhu").removeClass("on");
        $(".clearnum").click();
        zy.tips('投注已发送!');
    });

    $(".confirm-pour").click(function () {
        if (!$(this).hasClass("on")) return;
        $("#touzhu").addClass("on"), location.href = "#confirm"
    });

    $(".pour-info").find("a.close,a.cancel").click(function () {
        $("#touzhu").removeClass("on"), location.href = "#main"
    });
})