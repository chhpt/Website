$(function () {
    //默认参数
    var defaults = {
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

    //扩展
    $.fn.Page = function (options) {
        //将默认参数和传入参数合并
        var opts = $.extend({}, defaults, options);

        //如果总页数小于分页数，则取分页数为总页数
        if (opts.totalPages < opts.liNums) {
            opts.liNums = opts.totalPages;
        }
        //获取调用当前函数的对象
        var obj = $(this);

        //添加初始化的列表内容
        function addContent() {

            var str = "";
            var liStr = "";
            //填充列表内容
            for (var i = 1; i <= opts.liNums; i++) {
                liStr += "<li>"+ i +"</li>"
            }
            //判断是否有相应的可选参数，如果有，添加对应的内容（从前到后）
            //前一页
            if (opts.hasPrv) {
                str += '<div class="prv fl">' + opts.prv + '</div>';
            }
            //首页
            if (opts.hasFirstPage) {
                str += '<div class="first fl">' + opts.firstPage + '</div>';
            }
            //列表
            str += '<ul class="pagingUl">' + liStr + '</ul>';
            //尾页
            if (opts.hasLastPage) {
                str += '<div class="last fl">' + opts.lastPage + '</div>';
            }
            //后一页
            if (opts.hasNext) {
                str += '<div class="next fl">' + opts.next + '</div>';
            }

            //将选中区域的内容替换成合并好的区域内容
            obj.html(str);
            //在默认的位置添加active类
            repaint(opts.activePage);
        }

        //添加监听事件
        function addListener() {
            //上一页
            obj.on("click", ".prv", function () {
                //计算上一页的页号
                var prv_page = parseInt($("." + opts.activeClass).html()) - 1;
                if (prv_page == 0) {
                    return false;
                }
                //重绘
                repaint(prv_page);
            });
            //首页
            obj.on("click", ".first", function () {
                //重绘首页，首页的页数为1
                repaint(1);
            });

            //尾页
            obj.on("click", ".last", function () {
                //获取总页数，即为尾页
                repaint(opts.totalPages);
            });
            //下一页
            obj.on("click", ".next", function () {
                var next_page = parseInt($("." + opts.activeClass).html()) + 1;
                //如果下一页的页数超过总页数，则返回错误
                if (next_page > opts.totalPages) {
                    return false;
                }
                repaint(next_page);
            });
            //列表
            obj.on("click", "li", function () {
                //获取调用当前函数的对象的内容，即a包含的页数
                var page_num = parseInt($(this).html());
                repaint(page_num);
                
                return false;
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
            $("." + opts.activeClass).removeAttr("class");

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
            if (index <= opts.totalPages) {
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
                if (last > opts.totalPages) {
                    first = opts.totalPages - length + 1;
                    last = opts.totalPages;
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
                str += "<li>"+ i + "</li>"
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
                    $("#page li").eq(i).addClass(opts.activeClass);
                }
            }
        }
        //函数调用运行
        addContent();
        addListener();
    }
});