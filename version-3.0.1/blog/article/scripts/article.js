$(function () {

    //文章标题事件线插件
    //Timeline插件 = START
    $.fn.TimeLine = function (options) {
        //默认参数
        var defaults = {
            getContent: ["h1", "h2"] //带获取内容序列
        };

        var opts = $.extend({}, defaults, options);

        //全局变量
        //根据参数，获取标题数组
        var title = null;
        for (var i = 0; i < opts.getContent.length; i++) {
            title = $(opts.getContent[i]);
            if (title.length != 0)
                break;
        }

        //防止传入的参数错误，则获取默认值
        if (title.length == 0) {
            title = $("h1");
            if (title.length == 0)
                title = $("h2");
        }
        //窗口滚动事件，消除时间线延时
        var timer = null;

        //计算第一个标题和文章区域的top值得差距(必大于0)
        var node_top = $(title[0]).offset().top - $(".article-area").offset().top;


        function setTimelineBar() {
            $(".timeline .bar").css({
                "top": $()
            });
        }

        //添加点击事件
        function addBehaviours() {
            $.each($(".node"), function (i, element) {
                $(element).on("click", function () {
                    //获取滚动的数值
                    var scroll = $(title[i]).offset().top;

                    //滚动
                    $("body").animate({
                        scrollTop: scroll
                    }, 500);
                });
            });
        }

        //添加文章标题节点
        function addNode() {
            //移除所有节点
            $(".node").remove();

            //遍历标题，添加节点
            $.each(title, function (i, element) {
                //获取标题
                var name = $(title[i]).text();
                //创建节点（列表）
                var node = $("<li class='node'><span>" + name + "</span></li>");
                //添加节点
                $(".timeline").append(node);

                //按照标题的相对位置，设置节点的top值（第一个节点的top值为0，要减去导航栏的高和第一个标题与文本区top值的差）
                $(node).css({
                    "top": ($(element).offset().top - $(".article-area").offset().top - node_top) / $(".article-area").height() * $(".timeline-area").height()
                });
            });
            addBehaviours();
        }

        //窗口滚动事件
        $(window).on("scroll", function () {
            //防止重复触发延时
            clearTimeout(timer);

            var dis = window.scrollY - $(".article-area").offset().top;

            if (dis > 0) {
                $(".timeline-area").css("opacity", "1");
                var top = (window.scrollY - $(".article-area").offset().top - node_top) / $(".article-area").height() * $(".timeline-area").height();

                $(".timeline .bar").css({
                    "top": top
                });

                //页面静止不动5s后自动隐藏时间线
                timer = setTimeout(function () {
                    $(".timeline-area").css("opacity", "0");
                }, 5000);

            } else {
                $(".timeline-area").css("opacity", "0");
            }

        });

        //窗口大小改变事件
        $(window).on("resize", function () {
            addNode();
        });

        addNode();
    }
    //Timeline插件 = END

    //调到顶部按钮插件
    //ToTopButton = START 
    $.fn.ToTopButton = function (options) {
        //默认参数
        var defaults = {
            time: 400, //ms
            speed: 4, //从1到9，从快到慢,默认中等速度
            min_height: 1000, //按钮出现的内容最小高度
        };

        var opts = $.extend({}, defaults, options);

        //检查参数
        if (opts.time <= 0) {
            opts.time = defaults.time;
        }
        if (opts.speed <= 0) {
            opts.speed = defaults.speed;
        }
        if (opts.min_height <= 0) {
            opts.min_height = 1000;
        }

        //将抽象的速度转化成时间
        opts.time = opts.speed * 100;

        //跳转到顶部        
        function toTop() {
            var top_button = $(".top-button");
            var timer = null;
            top_button.on("click", function () {
                //每次触发事件，都要重新获取distance的值
                var distance = window.scrollY;
                //重复滚动页面
                timer = setInterval(function () {
                    //每次移动的距离逐渐减小（distance的值减小）
                    var step = distance / (opts.time / 10);
                    //防止无法到达终点
                    if (step <= 10) {
                        //防止速度由小变大
                        step = 9;
                    }
                    //清除定时器
                    if (window.scrollY <= 0) {
                        clearInterval(timer);
                    }

                    distance -= step;
                    window.scrollTo(0, distance);
                }, 10);
            });
        }

        //根据页面的高度和参数设置按钮是否显示
        if ($(document).height() < opts.min_height) {
            //默认不显示，不做任何更改

        } else {
            $(".to-top").css("display", "block");
            toTop();
        }
    };

    //ToTopButton = END 

    //调用插件
    $(".timeline-area").TimeLine();
    $(".to-top").ToTopButton();
});