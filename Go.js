var game = new Game();

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var container =document.getElementsByClassName('container');

if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    //container[0].style.width = "100%";
    //container[0].style.height = "100%";
}

var contentWidth = 416;
var contentHeight = 535;
var scale = 1

if(container[0].offsetHeight > container[0].offsetWidth)
{
    scale = contentHeight/contentWidth;
    container[0].style.height = "100%";
    canvas.height = container[0].offsetHeight;
    canvas.width =  canvas.height/scale;
    container[0].style.width = canvas.width +'px';
}
else{
    scale = contentWidth/contentHeight;
    container[0].style.width = "100%";
    canvas.width = container[0].offsetWidth;
    canvas.height =  canvas.width/scale;
    container[0].style.height = canvas.height +'px';
}



game.init(canvas,scale);
game.start();