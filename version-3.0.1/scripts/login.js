//设置颜色
function setColor(element, color) {
	element.style.color = color;
}

//在指定节点前插入小图标
function addIcon(node_id, icon_class) {
	var li_tag = document.createElement("i");
	var target_ele = document.getElementById(node_id);
	//检测是否已存在小图标
	var icon_tag = target_ele.previousSibling;
	if (icon_tag) {
		//当节点类型不是元素节点
		while (icon_tag.nodeType != 1) {
			icon_tag = icon_tag.previousSibling;
			if (icon_tag == null) {
				break;
			}
		}
		//如果小图标存在,退出函数
		if (icon_tag) {
			if (icon_tag.getAttribute("class") == icon_class) {
				return;
			}
		}
	}
	
	var parent_node = target_ele.parentNode;
	li_tag.setAttribute("class", icon_class);
	parent_node.insertBefore(li_tag, target_ele);
}

function removeSiblingNode(node_class, sibling_node) {
	var temp_node = document.getElementById(sibling_node);
	var parent_node = temp_node.parentNode;
	var remove_node = temp_node.previousSibling;
	if (remove_node) {
		while (remove_node.nodeType != 1) {
			remove_node = remove_node.previousSibling;
			if (remove_node == null) {
				break;
			}
		}
		if (remove_node) {
			parent_node.removeChild(remove_node);
		}
	}
}

function cleanIcons() {
	var fa_test = document.getElementsByClassName("fa");
	if (fa_test.length != 0) {
		removeSiblingNode("fa fa-exclamation-triangle", "login_span_username");
		removeSiblingNode("fa fa-exclamation-triangle", "login_span_password");
		var span_username = document.getElementById("login_span_username");
		var span_password = document.getElementById("login_span_password");
		span_username.textContent = "Username";
		span_password.textContent = "Password";
		setColor(span_username, "#aaa");
		setColor(span_password, "#aaa");
	}
}

//onreadystatechange事件
function stateChangeEvent(request) {
	if (request.readyState == 4) {
		/**
		 * 0:成功
		 * 1:用户名错误
		 * 2:密码错误
		 */
		if (request.responseText == "0") {
			alert("fine");
			window.location.href = "";
		} else if (request.responseText == "1") {
			var name_text = document.getElementById("login_span_username");
			name_text.textContent = "用户名错误";
			addIcon("login_span_username", "fa fa-exclamation-triangle");
			var icon = document.getElementsByClassName("fa-exclamation-triangle")[0];
			setColor(name_text, "#000");
			setColor(icon, "#ff0000");
		} else if (request.responseText == "2") {
			var password_text = document.getElementById("login_span_password");
			password_text.textContent = "密码错误";
			addIcon("login_span_password", "fa fa-exclamation-triangle");
			var icon = document.getElementsByClassName("fa-exclamation-triangle")[0];
			setColor(password_text, "#000");
			setColor(icon, "#ff0000");
		}
	}
}

//检查用户登录信息
function checkUserInfo() {
	var placeholder = "用户名只能是英文,数字或下划线";
	//获取输入框
	var username = document.getElementById("login_username");
	var password = document.getElementById("login_password");
	//设置鼠标聚焦事件
	/*1. 如果输入框内文字为占位符，则设输入框内文字为空
	 *2. 果不为空，则不做处理，设置提示信息为空
	 */
	username.onfocus = function () {
		cleanIcons();
		if (username.value != "") {
			username.value = "";
			setColor(username, "#000");
		}
		if (password.value != "") {
			password.value = "";
		}
	}

	//设置鼠标失焦时间	
	/*1. 检查输入框内信息的合法性
	 *2. 设置占位符
	 */
	username.onblur = function () {
		if (username.value == "") {
			username.value = placeholder;
			setColor(username, "#aaa");
		} else {
			//check username 
			var user_name = username.value;
			var result = user_name.match("^\\w+$");
			if (!result) {
				username.value = "Invalid Username";
				setColor(username, "#aaa");
			}
		}
	}
	password.onfocus = function () {
		cleanIcons();
	}
}

checkUserInfo();

function getHttpObject() {
	if (typeof XMLHttpRequest == "undefined")
		XMLHttpRequest = function () {
			try {
				return new ActiveXObject("Msxml2.XMLHTTP.6.0");
			} catch (e) {}
			try {
				return new ActiveXObject("Msxml2.XMLHTTP.3.0");
			} catch (e) {}
			try {
				return new ActiveXObject("Msxml2.XMLHTTP");
			} catch (e) {}
			return false;
		}
	return new XMLHttpRequest();
}

function isSuccess() {
	//检查登录信息
	var username = document.getElementById("login_username").value;
	var password = document.getElementById("login_password").value;
	//ajax异步请求
	//var url = "?name="+username+"&pass="+password;
	var request = getHttpObject();
	if (request) {
		/*request.open("GET", "login.php"+url, true);*/
		request.open("POST", "login.php", true);
		request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		//request.setRequestHeader("Content-type","application/json");
		request.send("username=" + username + "&password=" + password);
		/*
		var date = {
			username: username,
			password: password
		}
		*/
		request.onreadystatechange = function () {
			stateChangeEvent(request);
		};
		//request.send(JSON.stringify(date));		
	} else {
		alert("登录失败");
	}
}

var submit_button = document.getElementsByClassName("submit")[0];
submit_button.onclick = isSuccess;


document.querySelector('.img__btn').addEventListener('click', function () {
	document.querySelector('.cont').classList.toggle('s--signup');
});