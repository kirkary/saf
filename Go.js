var game = new Game();

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var container =document.getElementsByClassName('container');

if(! /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    container[0].style.width = "100%";
    container[0].style.height = "100%";
}

canvas.width = container[0].offsetWidth;
canvas.height = container[0].offsetHeight;



game.init(canvas);
game.start();