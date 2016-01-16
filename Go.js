var game = new Game();

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var container =document.getElementsByClassName('container');

if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    container.style.width = "100%";
    container.style.height = "100%";
}
else {
    canvas.width = container[0].offsetWidth;
    canvas.height = container[0].offsetHeight;
}


game.init(canvas);
game.start();