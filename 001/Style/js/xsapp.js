var page = 1,isLoading=false,hasMore=true,listId="#datalist",moreId =".loading",loaderr= 0,zy = zy||{};
moreURL  = document.location.href;
zy.is_weixin = function(){
    return navigator.userAgent.toLowerCase().match(/MicroMessenger/i)=="micromessenger" ? true : false;
};
zy.is_mobile = function(){
    return navigator.userAgent.match(/android|iphone|ipad|ipod|blackberry|meego|symbianos|windowsphone|ucbrowser/i);
};
zy.is_app = function(){
    return navigator.userAgent.match(/lt-app/);
};
zy.is_ios = function(){
    return navigator.userAgent.match(/iphone|ipod|ios|ipad/i);
};
zy.is_android = function(){
    return navigator.userAgent.match(/android/i);
};
zy.tips=function(msg,time){
    var zytips=$(".zytips");
    if(zytips.length==0){
        zytips=$('<div class="zytips"></div>').appendTo("body");
    };
    zytips.html("<div>"+msg+"</div>");
    $(".zytips").fadeOut('fast');
    zytips.fadeIn();
    time = time || 2;
    var tt = window.setTimeout(function(){
        $(".zytips").fadeOut('fast');
    },time*1000);
};
zy.msg=function(msg,time){
    return layer.open({content:msg,skin: 'msg',time:time||2});
};
zy.alert=function(msg,btn){
    return layer.open({content:msg,btn:btn||'我知道了'});
};
zy.notice=function(msg,title){
    return layer.open({title:[title||'系统提示','background-color: #8DCE16; color:#fff;'],content:msg});
};
zy.setcc = function(name,value, day){
    var Days = day||30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
};
zy.getcc = function(name){
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
};
zy.delcc = function(name){
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=zy.getcc(name);
    if(cval!=null)
        document.cookie= name + "="+cval+";expires="+exp.toGMTString();
};
zy.color_mode = function(o,c){
    o = $('.'+o.id);
    var clmd = zy.getcc('color_mode') ? zy.getcc('color_mode') : "day";
    if(c){clmd = clmd == 'day' ? 'night':'day';zy.setcc('color_mode',clmd,1);}
    if(clmd == 'night'){$('body').addClass('night');$(o).find("span").html('日间');}else{$('body').removeClass('night');$(o).find("span").html('夜间');}
};
zy.sbind = function(){
    var a = $(this).data();
    var res = $(".binding-model").html();
    if(res == undefined || res == ""){
        return;
    }
    return layer.open({content: '您未设置APP帐户！<br>绑定后可用APP登陆更流畅。<br>请您先去设置帐户？',btn: ['现在设置', '以后再说'],yes: function(index){

            layer.close(index);
            layer.open({type: 1 ,content: res ,anim: a.anim || 'up'
                ,style: 'position:fixed;'+(a.css||'bottom: 0;')+'left:1%;width:98%; max-height:100%; min-height:40%; border: none;border-top-left-radius: 10px; border-top-right-radius: 10px; -webkit-animation-duration: .5s; animation-duration: .5s;'
            });
        }});
};
zy.qrcode = function(o){
    var a = $(o).data();
    var b = {
        quiet: 2,
        width: a.width || 200,
        height: a.width || 200,
        text: a.text,
        foreground: a.color || "#333333"
    };
    $(o).html('').qrcode(b);
    var c = $(o).find('canvas').get(0);
    if ($(0).next('img').length == 0) {
        $(o).after("<img>");
    };
    $(o).hide().next("img").attr('src', c.toDataURL('image/jpg'));
};
zy.show_loading = function(e, n) {
    var i = n || "加载中…请稍候！",
        t = $(".xinwin-loading");
    t.length || $('<div class="xinwin-loading" style="display:none"><div class="xinwin-loader"><div class="dot"><div class="first"></div></div><div class="dot"></div><div class="dot"></div><div class="dot"></div></div><p>' + i + "</p></div>").appendTo("body"), t.find("p").html(i), 1 == e ? t.show() : t.hide()
};
function getAds(val) {
    var res = $(".ad-model").html();
    if(res == undefined || res == ""){
        return;
    }
    var a = $(this).data();
    return layer.open({
        type: 1,
        skin: 'layui-layer-rim', //加上边框
        area: ['420px', '240px'], //宽高
        content: val,
    });
};
function GetQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}
function load_index(){
    $.get("/index/ajax").then(function(res){$(".main").html(res);});
};
function ajax_load_page(obj,uri){
    $.get(uri).then(function(res){$(obj).html(res);});
};
function load_slide_menu(){
    $.get("/Application/ajax_layout.php?l=menu").then(function(res){$("#ss_menu").html(res);});
};
function load_more(url,data){
    var query_arg=data;
    if(isLoading || !hasMore) return;
    isLoading = true;
    if(data.p==1){$(listId).html("")}
    $(moreId).show();
    $.ajax({url:url,dataType:"json",data:data,type:"POST",error: function(){
            isLoading = false;loaderr++;
            if(loaderr>3){
                layer.open({content:"Sorry!加载失败",skin: 'msg',time: 2});
            }else{
                load_more(url,data);
            }
        },success: function(res){
            if(res.status){
                page++,loaderr=0;
                if(res.map.total == 0){
                    $(listId).html(res.content);
                }else{
                    if(res.map.page == 1){
                        $(listId).html(res.content);
                    }else{
                        $(res.content).appendTo($(listId));
                    }
                }
                if(res.map.page>=res.map.totalpage){hasMore = false;}
                else{hasMore = true;}
                $(moreId).hide();isLoading = false;
            }
        }});
};
$(function(){
    $('body').append('<section id="ajax_container" class="win-show score-view-box"></section>');
    $(".table-tongji").find("td").each(function(){
        var num = $(this).text() * 1;
        if(num < 0) $(this).addClass("red");
    });
    $(".building").click(function(){zy.tips("该功能开发中…")});
    $(document).on('click','.show_load',function(){layer.open({type: 2,content: '加载中'})});
    var bet_money = zy.getcc("bet_money");
    if(bet_money > 0){$(".bet_money").val(bet_money)}
});

$(document).on("click",".ajax_load",function(){
    var a = $(this).data();
    console.log(a)
    if(a.type == 'up'){
        $('.ftype .up').addClass("on");
        $('.ftype .down').removeClass("on");
    } else {
        $('.ftype .down').addClass("on");
        $('.ftype .up').removeClass("on");
    }
    var res = $(".score-model").html();
    console.log(res);
    layer.closeAll();
    layer.open({type: 1 ,content: res ,anim: a.anim || 'up'
        ,style: 'position:fixed;'+(a.css||'bottom: 0;')+'left:1%;width:98%; max-height:100%; min-height:40%; border: none;border-top-left-radius: 10px; border-top-right-radius: 10px; -webkit-animation-duration: .5s; animation-duration: .5s;'
    });
});

$(document).on("click",".ajax_load_kefu",function(){
    var a = $(this).data();
    var res = $(".kefu-model").html();
    layer.closeAll();
    layer.open({type: 1 ,content: res ,anim: a.anim || 'up'
        ,style: 'position:fixed;'+(a.css||'bottom: 0;')+'left:1%;width:98%; max-height:100%; min-height:40%; border: none;border-top-left-radius: 10px; border-top-right-radius: 10px; -webkit-animation-duration: .5s; animation-duration: .5s;'
    });
});

$(document).on("click", ".ajax_load_qrcode", function () {
    var a = $(this).data();
    var res = $(".qrcode-model").html();
    console.log(res);
    layer.closeAll();
    layer.open({type: 1 ,content: res ,anim: a.anim || 'up'
        ,style: 'position:fixed;'+(a.css||'bottom: 0;')+'left:1%;width:98%; max-height:100%; min-height:40%; border: none;border-top-left-radius: 10px; border-top-right-radius: 10px; -webkit-animation-duration: .5s; animation-duration: .5s;'
    });
});

$(document).on("click", ".zfbpay", function () {
    $(".zhifubao").show();
    $(".weixin").hide();
});

$(document).on("click", ".wxpay", function () {
    $(".weixin").show();
    $(".zhifubao").hide();
});

$(document).on('click','.ajax_sw',function(){
    var o=$(this),a = o.data();
    layer.open({
        content: a.sw == 1 ? '确定要退出试玩吗？':'试玩模式不作任何记录！<br><br>是否确认进入试玩模式?',style:"font-size:1.5rem;color:red",btn: ['确定', '取消'],yes: function(index){
            a.remark = $(".charge_box select").val();
            $.ajax({type:"post",url:"/Application/member.php?t=sw",data:{sw:1-a.sw},
                success:function(res){
                    layer.closeAll();
                    if(a.reload == '1'){
                        location.reload();
                    }else{
                        o.data('sw',res.info.sw);
                        if(res.info.sw == 1){
                            $(o).html('<em class="iconfont icon-jiangbei"></em><p>退出试玩</p>').parent().addClass('on');
                            $(o).addClass('cur');
                            $('.bmoney').html('试玩余额：<i id="ye">'+res.info.sw_balance+"</i>元");
                        }else{
                            $(o).html('<em class="iconfont icon-jiangbei"></em><p>游戏试玩</p>').parent().removeClass('on');
                            $(o).removeClass('cur');
                            $('.bmoney').html('余额：<i id="ye">'+res.info.balance+"</i>元");
                        }
                    }
                },
            });
        }
    });
});

$(document).on("click",".ajax_charge .ftype a",function(){
    $(this).addClass("on").siblings().removeClass('on');
    if($(this).data("type") == 'tixian'){
        var that = $(this).parents().find("input[name='money']");
        if($(that).val() * 1 > $(that).data("max")*1) $(that).val($(that).data("max"));
    }
});

$(document).on("click",'show_load',function(){
    layer.open({type: 2,content: '加载中'});
});

$(document).on("keyup",".ajax_charge input[name='money']",function(){
    var a = $(this).parents('.ajax_charge').find(".ftype a.on").data();
    if(a.type == 'tixian'){
        if($(this).val() * 1 > $(this).data("max")*1) $(this).val($(this).data("max"));
    }
});

$(document).on("click",'.game-list li.disabled a',function(){
    layer.open({content:'暂未开通',skin: 'msg',time: 2});
});

$(document).on("click",".ajax_charge .submit",function(){
    var p = $(this).parents('.ajax_charge'), t = $(p).find(".ftype a.on").data('type'), m = $(p).find("input[name='money']").val();
    layer.open({
        content: '确定要提交吗？',btn: ['确定', '取消'],yes: function(index){
            layer.close(index);
            var text = "";
            if(t == "charge"){
                text = '查' + m;
            }else if(t == "tixian"){
                text = '回' + m;
            }else{
                return layer.open({content:'无效提交',skin: 'msg',time: 2});
            }
            $.ajax({
                type:"post",
                url:"/Application/ajax_chat.php?type=send",
                data:{content:text},
                dataType:"json",
                success:function(res){
                    if(res.success){
                        layer.closeAll();layer.open({content:"申请成功",skin: 'msg',time: 2});//location.reload();
                    }else{
                        layer.closeAll();layer.open({content:res.msg,skin: 'msg',time: 2});//location.reload();
                    }

                },
                error:function(){}
            });
        }
    });
});

$(document).on("click",".ajax_sign .submit",function(){
    var p = $(this).parents('.ajax_sign');
    m = $(p).find("input[name='userid']").val();
    layer.open({
        content: '确定要签到吗？',btn: ['确定', '取消'],yes: function(index){
            layer.close(index);
            $.ajax({
                type:"post",
                url:"/Application/member.php?t=sign",
                data:{userid:m},
                success:function(res){
                    layer.closeAll();
                    layer.open({content:res.info,skin: 'msg',time: 5});//location.reload();
                },
                error:function(){layer.open({content:'发生致命错误，请联系客服处理！',skin: 'msg',time: 2});}
            });
        }
    });
});

$(document).on("click",".ajax_form_submit",function(){
    var a = $(this).data();
    layer.open({
        content: a.msg||'确定要提交吗？',btn: ['确定', '取消'],yes: function(index){
            layer.close(index);
            $.ajax({
                type:"post",
                url:a.uri,
                data:$(a.form).serialize(),
                success:function(res){
                    layer.closeAll();
                    layer.open({content:res.info,skin: 'msg',time: 2});
                },
                error:function(){
                    layer.open({content:'网络连接失败',skin: 'msg',time: 2});
                }
            });
        }
    });
});

$(document).on("click",".agent_config .submit",function(){
    var that  = $(this),ratio = $(that).parents('.agent_config').find('.ratio').val() * 1.0;
    if(ratio <0 || ratio > 100){
        return layer.open({content:'数字错误，请设置0~100',skin: 'msg',time: 2});
    }
    layer.open({
        content: '确定要保存吗？',btn: ['确定', '取消'],yes: function(index){
            layer.close(index);
            $.ajax({
                type:"post",
                url:$(that).data('uri'),
                data:{ratio:ratio},
                success:function(res){
                    layer.open({content:res.info,skin: 'msg',time: 2});
                    location.reload();
                }
            });
        }
    });
});

$(document).on("click",".close_layer",function(){layer.closeAll();});
$(document).on("click",".ajax_uri",function(){
    var uri = $(this).data('uri');
    if(!uri) return;
    location.href = uri;
});

$(document).on("click",".ajax_page",function(){
    var uri = $(this).data('uri');
    if(!uri) return;
    data = $(this).data();
    delete data.uri;
    $.ajax({type:"get",url:uri,data:data,
        success:function(html){
            $("#ajax_container").html(html).addClass("on");
            location.href = "#ajax_page";
        },
        error:function(){

        }
    });
});

$(document).on("click","#ajax_container .back",function(){
    $("#ajax_container").removeClass("on");
    location.href = "#";
});

window.onhashchange =function(){
    if(location.href.indexOf("#win")==-1){
        layer.closeAll();
    };
    if(location.href.indexOf("#menu")==-1){
        $("#ss_menu").hide();
    };
    if(location.href.indexOf("#ajax_page")==-1){
        $("#ajax_container,.win-show").removeClass("on");
    };
    if(location.href.indexOf("#confirm")==-1){
        $("#touzhu").removeClass("on");
    };
};

$(document).on("click", ".ajax_binding", function () {
    var username = $($('.uname')[1]).val();
    var pass = $($('.upass')[1]).val();
    if(username == undefined || username == "") {
        layer.closeAll();layer.open({content:"帐号不能为空",skin: 'msg',time: 2});
        return;
    }
    if(pass == undefined || pass == ""){
        layer.closeAll();layer.open({content:"密码不能为空",skin: 'msg',time: 2});
        return;
    }
    $.getJSON("/Application/ajax_binding.php?username=" + username + "&userpass=" + pass, function(data){
        if(data.success == false){
            layer.closeAll();layer.open({content:"绑定失败，请重新绑定",skin: 'msg',time: 2});
        }else{
            layer.closeAll();layer.open({content:"已成功绑定",skin: 'msg',time: 2});
            window.location.reload();
        }
    });
});