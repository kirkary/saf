var game = new Game();

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var container =document.getElementsByClassName('container');

canvas.width = container[0].offsetWidth;
canvas.height = container[0].offsetHeight;

game.init(canvas);
game.start();