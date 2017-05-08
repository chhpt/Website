$(function () {
    //重新设置首页的元素间距
    function setPage() {
        //设置页面高度 START
        //获取窗口的高度
        var window_height = $(window).height();
        //alert(window_height);
        if (window_height > 530) {
            //减去header的高度
            $(".page").height(window_height - 80);
            $(".banner-background").height(window_height - 80);
            $(".background-image").height(window_height - 80);
        } else {
            //页面最小高度为650
            $(".page").height(450);
            $(".banner-background").height(450);
            $(".background-image").height(450);
        }
        //设置页面高度 END

        //设置页面内容的top值 STRAT
        var content_top = $(".page").height() * 0.35;
        $(".banner-content").css("top", content_top);
        //设置页面内容的top值  END
    }
    setPage();
    //当窗口大小改变时，重新设置页面的高度
    $(window).on("resize", function () {
        setPage();
    });

    setTimeout(function () {
        $(".background-image").addClass("kenburns-right");
    }, 500);

    setTimeout(function () {
        $(".background-image").removeClass("kenburns-right");
    }, 5000);
});