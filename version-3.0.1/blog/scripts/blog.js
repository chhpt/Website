function moveTo(obj, end, distance) {
    var purrent_position = parseFloat(obj.style.top);
    var end_position = parseFloat(end);
    var move_distance = parseFloat(distance);
    //结果距离为负值
    if (end_position < 0) {
        if (purrent_position > end_position) {
            purrent_position -= move_distance;
        } else {
            return true;
        }
    } else {
        if (purrent_position < end_position) {
            purrent_position += move_distance;
        } else {
            return true;
        }
    }
    obj.style.top = purrent_position + "em";
}

function hoverAnimation() {
    var article = document.getElementsByClassName("article");
    var time_up = null;
    var time_down = null;
    for (var i = 0; i < article.length; i++) {
        article[i].addEventListener("mouseover", function () {
            this.style.top = "0em";
            clearInterval(time_up);
            clearInterval(time_down)
            var obj = this;
            time_up = setInterval(function () {
                //if (is_down)
                //    clearInterval(time_up);
                var is_success = moveTo(obj, "-0.3em", "0.01em");
                if (is_success) {
                    clearInterval(time_up);
                    //is_up = false;
                    //is_down = true;
                }
            }, 13);
            this.style.boxShadow = "rgba(0,0,0,0.5) 0.15em 0.1em 50px";
        }, false);

        article[i].addEventListener("mouseout", function () {
            var obj = this;  
            clearInterval(time_up);
            clearInterval(time_down)
            time_down = setInterval(function () {
                //if (is_up)
                    //clearInterval(time_down);
                var is_success = moveTo(obj, "0em", "0.01em");
                if (is_success) {
                    clearInterval(time_down);
                    //is_down = false;
                    //is_up = true;
                }
            }, 13);
            this.style.boxShadow = "rgba(158,158,158,0.5) 0.05em 0.1em 4px";
        }, false);
    }
}

hoverAnimation();