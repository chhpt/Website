$(function () {

    /**
     * 全局变量
     */
    var globalDefaults = {
        table_titles: 100, //每页列表的标题数目
        article_url: "background-m.php", //文章列表ajax异步请求的地址
        user_url: "background-m.php", //用户列表ajax异步请求的地址
    }
    /**
     * Ajax获取数据
     */

    //加载动画
    var loading_area = $("#loading");
    loading_area.hide();

    //获取列表数据
    function getData(size, page, ajax_url) {

        console.log("getData...");
        
        //显示加载动画
        loading_area.show();
        $(".title-list li").block({
            message: null
        });

        //发送POST请求
        var article_request = $.ajax({
            url: ajax_url, //"/admin/blog/?page="
            method: "GET",
            data: {
                size: size, //每页的条目数
                page: page, //第多少页
            },
        });

        //处理数据
        article_request.done(function () {
            //获取返回的数据
            var info = article_request.responseText;

            var list = null;
            try {
                list = JSON.parse(info).list; //返回对象
            } catch (Error) {
                alert("Error");
                //结束加载动画
                $(".title-list li").unblock();
                loading_area.hide();
                return;
            }

            //结束加载动画
            $(".title-list li").unblock();
            loading_area.hide();

            //更新DOM
            function updateDOM(value) {
                var li_str = "";
                if (value == "title") {
                    for (key in list) {
                        li_str += "<li>" + list[key].title + "</li>";
                    }
                }
                if (value == "name") {
                    for (key in list) {
                        li_str += "<li>" + list[key].name + "</li>";
                    }
                }
                var title_list = $(".list-area").find(".title-list").find("ul");
                title_list.html(li_str);
            }

            //根据列表不同，处理JSON略有不同
            var page_class = $("#page").attr("class");
            if (page_class == "article-page") {
                updateDOM("title");
            }
            if (page_class == "user-page") {
                updateDOM("name");
            }
        });

        article_request.fail(function () {
            //结束加载动画
            $(".title-list li").unblock();
            loading_area.hide();
            alert("加载错误，请重新刷新页面");
            return 0;
        });
    }


    //根据page部分的class不同，判断列表的类型，获取不同的URL
    function sendRequset(page) {
        var url = "";
        var page_class = $("#page").attr("class");
        if (page_class == "article-page") {
            url = globalDefaults.article_url;
        }
        if (page_class == "user-page") {
            url = globalDefaults.user_url;
        }
        if (page_class == null) {
            url = false;
        }
        if (url) {
            getData(globalDefaults.table_titles, page, url);
        }
    }

    /**
     * Page插件
     */
    //Page插件默认参数
    var pageDefaults = {
        totalPages: 9, //总页数
        liNums: 9, //分页的数字按钮数
        activeClass: 'active', //active类
        activePage: 1, //默认显示的活动页
        a_href: "#",
        firstPage: '首页', //首页按钮名称
        lastPage: '末页', //末页按钮名称
        prv: '«', //前一页按钮名称
        next: '»', //后一页按钮名称
        hasFirstPage: true, //是否有首页按钮
        hasLastPage: true, //是否有末页按钮
        hasPrv: true, //是否有前一页按钮
        hasNext: true, //是否有后一页按钮
        callBack: function (page) {
            //回调，page选中页数
        }
    };
    var pageOpts = null;
    //扩展
    $.fn.Page = function (options) {
        //将默认参数和传入参数合并
        pageOpts = $.extend({}, pageDefaults, options);

        //如果总页数小于分页数，则取分页数为总页数
        if (pageOpts.totalPages < pageOpts.liNums) {
            pageOpts.liNums = pageOpts.totalPages;
        }
        //获取调用当前函数的对象
        var obj = $(this);

        //添加初始化的列表内容
        function addContent() {

            var str = "";
            var liStr = "";
            //填充列表内容
            for (var i = 1; i <= pageOpts.liNums; i++) {
                liStr += "<li>" + i + "</li>"
            }
            //判断是否有相应的可选参数，如果有，添加对应的内容（从前到后）
            //前一页
            if (pageOpts.hasPrv) {
                str += '<div class="prv fl">' + pageOpts.prv + '</div>';
            }
            //首页
            if (pageOpts.hasFirstPage) {
                str += '<div class="first fl">' + pageOpts.firstPage + '</div>';
            }
            //列表
            str += '<ul class="pagingUl">' + liStr + '</ul>';
            //尾页
            if (pageOpts.hasLastPage) {
                str += '<div class="last fl">' + pageOpts.lastPage + '</div>';
            }
            //后一页
            if (pageOpts.hasNext) {
                str += '<div class="next fl">' + pageOpts.next + '</div>';
            }

            //将选中区域的内容替换成合并好的区域内容
            obj.html(str);
            //在默认的位置添加active类
            repaint(pageOpts.activePage);
        }


        //添加监听事件
        function addListener() {
            //上一页
            obj.on("click", ".prv", function () {
                //计算上一页的页号
                var prv_page = parseInt($("." + pageOpts.activeClass).html()) - 1;

                if (prv_page == 0) {
                    return false;
                }
                //重绘
                repaint(prv_page);
                //请求数据
                sendRequset(prv_page);
            });

            //首页
            obj.on("click", ".first", function () {
                //重绘首页，首页的页数为1
                repaint(1);
                //请求数据
                sendRequset(1);
            });

            //尾页
            obj.on("click", ".last", function () {
                //获取总页数，即为尾页
                repaint(pageOpts.totalPages);
                //请求数据
                sendRequset(pageDefaults.totalPages);
            });
            //下一页
            obj.on("click", ".next", function () {
                var next_page = parseInt($("." + pageOpts.activeClass).html()) + 1;
                //如果下一页的页数超过总页数，则返回错误
                if (next_page > pageOpts.totalPages) {
                    return false;
                }
                repaint(next_page);
                //请求数据
                sendRequset(next_page);
            });
            //列表
            obj.on("click", "li", function () {
                //获取调用当前函数的对象的内容，即a包含的页数
                var page_num = parseInt($(this).html());
                repaint(page_num);
                //请求数据
                sendRequset(page_num);
            });
        }

        //对列表进行重绘
        /**
         * 
         * @param {any} index 进行重绘时，有active类的a的内容页数
         * @returns 
         */
        function repaint(index) {
            //进行重绘前，移除active类
            $("." + pageOpts.activeClass).removeAttr("class");

            //获取当前列表的长度
            var totalNum = $("#page li").length;
            //获取列表第一页的页数（不一定是首页）
            var first_page = parseInt($("#page li").eq(0).html());
            //获取列表最后一页的页数（不一定是尾页）
            var last_page = totalNum + first_page - 1;
            //获取当前列表的中间页的页数
            var middleNum = parseInt((last_page - first_page) / 2) + first_page;
            //根据index页的位置确定不同的处理方法
            //如果添加active类的页数大于第一页
            if (index <= pageOpts.totalPages) {
                //处于列表前部分,直接添加active类 
                //如果添加active的页数小于第一页，即不在可视范围内，先移动列表，再添加active类  
                if (index <= middleNum && index >= first_page) {
                    addActiveClass(index);
                } else if (index < first_page || index > middleNum) {
                    //处于列表后部分，移动列表，再添加active类
                    movePage(first_page, last_page, index);
                    addActiveClass(index);
                }
            } else {
                return false;
            }

        }

        /**
         * 
         * 移动页面并进行重绘(移动页数大于列表中间值)
         * 根据不同的情况确定列表的第一个和最后一个值，然后进行重绘
         * @param {any} first 列表第一页
         * @param {any} last 列表最后一页
         * @param {any} active_page 添加active类的页（参考）
         */
        function movePage(first, last, active_page) {
            //获取列表长度
            var length = $("#page li").length;
            //计算移动的页数
            var move_num = parseInt((last - first) / 3);
            //定义内容子串
            var str = "";

            //当添加active的页数比最后一页大时，以直接切换到添加active的页数（点击尾页时）
            if (active_page > last) {
                first = active_page - length + 1;
                last = active_page;
            }


            //如果添加active的页数大于第一页，且小于最后一页
            if (active_page >= first && active_page <= last) {
                first += move_num;
                last += move_num;
                //如果最后一页大于总页数，则以总页数为准计算第一页进行重绘
                if (last > pageOpts.totalPages) {
                    first = pageOpts.totalPages - length + 1;
                    last = pageOpts.totalPages;
                }
            }

            //如果添加active的页数小于第一页，即不在可视范围内，则以active为准进行重绘
            if (active_page < first && active_page > 0) {
                if (move_num < active_page) {
                    first = active_page - move_num;
                    last = first + length - 1;
                } else {
                    first = 1;
                    last = first + length - 1;
                }
            }

            for (var i = first; i <= last; i++) {
                str += "<li>" + i + "</li>"
            }

            $("#page ul").html(str);
        }

        //添加active类
        /**
         *
         * @param {any} index 需要添加active类的a的内容数字
         */
        function addActiveClass(index) {
            //获取列表长度
            var length = $("#page li").length;
            //遍历列表，找到与index对应的a标签
            for (var i = 0; i <= length; i++) {
                var li_number = parseInt($("#page li").eq(i).html());
                if (index == li_number) {
                    $("#page li").eq(i).addClass(pageOpts.activeClass);
                }
            }
        }
        //函数调用运行
        addContent();
        addListener();
    }

    /**
     * 处理界面的交互部分
     */
    //点击：文章管理，用户管理，文章列表，用户列表，添加文章，添加用户
    var click_array = ["article-m", "user-m", "article-list", "user-list", "add-article", "add-user"];
    //界面：文章管理，用户管理，文章列表，用户列表，添加文章，添加用户
    var detail_array = ["article-detail", "user-detail", "list-area", "list-area", "add-article-area", "add-user-area"];

    //隐藏所有详情功能列表
    for (var i = 0; i < detail_array.length; i++) {
        $("." + detail_array[i]).hide();
    }

    /**
     * 清除所有详细信息的display属性(文章列表，用户列表，添加文章，添加用户)
     */
    function cleanDisplay() {
        for (var i = 2; i < detail_array.length; i++) {
            $("." + detail_array[i]).hide();
        }
    }

    /**
     * 点击事件
     * @param {string} class_name 
     * @returns boolean
     */
    function clickEvent(this_object) {
        //清除其他显示内容
        cleanDisplay();

        //根据当前对象的id获取对应显示界面的class
        /*var object_id = this_object.getAttribute("id");*/
        var object_id = $(this_object).attr("id");
        var index = 0;
        for (var i = 0; i < click_array.length; i++) {
            if (click_array[i] === object_id) {
                index = i;
            }
        }
        var class_name = detail_array[index];

        //获取元素，切换显示或隐藏
        $("." + class_name).toggle();
    }

    /**
     *添加点击事件响应
     * @param {any} click_array 点击目标类名数组
     * @param {any} detail_array 响应点击的类名数组
     */
    function clickDisplay(click_array, detail_array) {
        var array_length = click_array.length;

        //为不需要异步请求的内容添加点击事件
        for (var i = 0; i < array_length; i++) {
            $("#" + click_array[i]).click(function () {
                clickEvent(this);
                //取消链接的默认跳转
                return false;
            });
        }

        //为需要异步请求的部分添加点击事件
        $("#article-list").on("click", function () {
            var $page = $("#page");
            $page.removeAttr("class");
            $page.addClass("article-page");
            $page.Page(pageOpts);
            getData(globalDefaults.table_titles, 1, globalDefaults.article_url);
        });
        $("#add-article").on("click", function () {
            //暂未实现
        });
        $("#user-list").on("click", function () {
            var $page = $("#page");            
            $page.removeAttr("class");          
            $page.addClass("user-page");
            $page.Page(pageOpts);
            getData(globalDefaults.table_titles, 1, globalDefaults.user_url);
        });
    }

    clickDisplay(click_array, detail_array);
});