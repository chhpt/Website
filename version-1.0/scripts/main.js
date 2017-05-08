var myImage = document.querySelector('img');

myImage.onclick = function(){
  var mySrc = myImage.getAttribute('src');
  if(mySrc === 'images/1996-102.jpg'){
    myImage.setAttribute('src','images/7511-102.jpg');
  }
  else {
    myImage.setAttribute('src','images/1996-102.jpg');
  }
}

var myButton = document.querySelector('button');
var myHeading = document.querySelector('h1');
function setUserName() {
  var myName = prompt('Please enter your name.');
  localStorage.setItem('name',myName);
  myHeading.textContent = '你好 ,'+ myName;
}
if(!localStorage.getItem('name')){
  setUserName();
}
else {
  var storedName = localStorage.getItem('name');
  myHeading.textContent = '你好 , '+ storedName;
}
myButton.onclick = function(){
  setUserName();
}
