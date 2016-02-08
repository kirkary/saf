var game = new Game();

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var mainWrapper = document.getElementById('main-wrapper');
var container =document.getElementsByClassName('container');
var mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|iemobile|Windows Phone/i.test(navigator.userAgent);
var resize = function(){
if(!mobile) {
    container[0].style.width = "100%";
    container[0].style.height = "100%";
    container[0].style.maxWidth = "597px";
    container[0].style.maxHeight = "768px";
}
else{
    container[0].style.width = "100%";
    container[0].style.height = "100%";
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
    if(canvas.width > container[0].offsetWidth)
    {
        ratio = contentWidth/contentHeight;
        container[0].style.width = "100%";
        canvas.width = container[0].offsetWidth;
        canvas.height =  canvas.width/ratio;
        scale = canvas.width / contentWidth;
        container[0].style.height = canvas.height +'px';
    }
    else{
        scale = canvas.height / contentHeight;
        container[0].style.width = canvas.width +'px';
    }
}
else{
    ratio = contentWidth/contentHeight;
    container[0].style.width = "100%";
    canvas.width = container[0].offsetWidth;
    canvas.height =  canvas.width/ratio;
    if(canvas.height > container[0].offsetHeight)
    {
        ratio = contentHeight/contentWidth;
        container[0].style.height = "100%";
        canvas.height = container[0].offsetHeight;
        canvas.width =  canvas.height/ratio;
        scale = canvas.height / contentHeight;
        container[0].style.width = canvas.width +'px';
    }
    else{
        scale = canvas.width / contentWidth;
        container[0].style.height = canvas.height +'px';
    }
}
    container[0].style.left = (mainWrapper.offsetWidth - container[0].offsetWidth)/2 + 'px';
    container[0].style.top = (mainWrapper.offsetHeight - container[0].offsetHeight)/2 + 'px';
return scale;
};

window.onresize = function(){
        game.setScale(resize());
};

game.init(canvas,resize());
game.start();