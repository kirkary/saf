var game = new Game();

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var mainWrapper = document.getElementById('main-wrapper');
var container =document.getElementsByClassName('container');

//TODO refactor whole ratio-scale block
if(!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    container[0].style.maxWidth = "597px";
    container[0].style.maxHeight = "768px";
}
else{
    container[0].style.maxWidth = "100%";
    container[0].style.maxHeight = "100%";
}

var contentWidth = 416;
var contentHeight = 535;
var scale = 1;
var ratio = contentWidth/contentHeight;
if(container[0].offsetHeight > container[0].offsetWidth)
{
    ratio = contentHeight/contentWidth;
    container[0].style.height = "100%";
    canvas.height = container[0].offsetHeight;
    canvas.width =  canvas.height/ratio;
    scale = canvas.height / contentHeight;
    container[0].style.width = canvas.width +'px';
}
else{
    ratio = contentWidth/contentHeight;
    container[0].style.width = "100%";
    canvas.width = container[0].offsetWidth;
    canvas.height =  canvas.width/ratio;
    scale = canvas.width / contentWidth;
    container[0].style.height = canvas.height +'px';
}

if(mainWrapper.offsetHeight > container[0].offsetHeight)
container[0].style.top = (mainWrapper.offsetHeight - container[0].offsetHeight)/2 + 'px';

game.init(canvas,scale);
game.start();