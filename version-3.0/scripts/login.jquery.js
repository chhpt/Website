$(function () {

    //在指定节点前插入小图标
    function addIcon(node_id, icon_class) {
        var li_tag = $("<i></i>")
        var target_ele = $("#" + node_id);

        //检测是否已存在小图标
        var icon_tag = target_ele.prev();
        if (icon_tag) {
            if (icon_tag.attr("class") == icon_class) {
                return;
            }
        }
        li_tag.attr("class", icon_class);
        target_ele.before(li_tag);
    }

    //清除小标签
    function cleanIcons() {
        var fa_test = $(".fa");
        if (fa_test.length != 0) {
            $(".fa").remove();
            $("#login_span_username").text("Username").css("color", "#aaa");
            $("login_span_password").text("Password").css("color", "#aaa");
        }
    }

    function checkUserInfo() {
        var placeholder = "用户名只能是英文,数字或下划线";
        var username = $("#login_username");
        var password = $("#login_password");
        //设置鼠标聚焦事件
        /*1. 如果输入框内文字为占位符，则设输入框内文字为空
         *2. 果不为空，则不做处理，设置提示信息为空
         */
        username.click(function () {
            cleanIcons();
            if (username.val() != "") {
                username.val("");
                $(this).css("color", "#000");
            }
            if (password.val() != "") {
                password.val("");
            }
        });

        //设置鼠标失焦时间	
        /*1. 检查输入框内信息的合法性
         *2. 设置占位符
         */
        username.blur(function () {
            if (username.val() == "") {
                username.val(placeholder);
                $(this).css("color", "#aaa");
            } else {
                //check username 
                var result = username.val().match("^\\w+$");
                if (!result) {
                    username.val("Invalid Username");
                    $(this).css("color", "#aaa");
                }
            }
        });
        password.focus(function () {
            cleanIcons();
        });
    }

    //Ajax异步请求回调时间
    function stateChangeEvent(request) {
        /**
         * 0:成功
         * 1:用户名错误
         * 2:密码错误
         */
        if (request.responseText == "0") {
            alert("Fine");
            window.location.href = "";
        } else if (request.responseText == "1") {
            $("#login_span_username").text("用户名错误").css("color", "#000");
            addIcon("login_span_username", "fa fa-exclamation-triangle");
            $(".fa-exclamation-triangle").css("color", "#ff0000");
        } else if (request.responseText == "2") {
            $("#login_span_password").text("密码错误").css("color", "#aaa");
            addIcon("login_span_password", "fa fa-exclamation-triangle");
            $("#login_span_password").css("color", "#ff0000");
        }
    }


    function isSuccess() {

        //检查登录信息
        var username = $("#login_username").val();
        var password = $("#login_password").val();

        //ajax异步请求
        var request = $.ajax({
            url: "login.php",
            type: "post",
            data: {
                "username": username,
                "password": password
            },
            error: function () {
                alert("登录错误😱");
            }
        });
        
        request.done(function (requset) {
            stateChangeEvent(request);
        });
    }

    checkUserInfo();
    $(".submit").click(isSuccess);

    document.querySelector('.img__btn').addEventListener('click', function () {
        document.querySelector('.cont').classList.toggle('s--signup');
    });
})