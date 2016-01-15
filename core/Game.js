
var Game = (function(){
    var canvas = null;
    var options = {
        states: {}
    };
    var Screenmanager = new ScreenManager();

    var w = window;
    requestAnimationFrame =
        w.requestAnimationFrame ||
        w.webkitRequestAnimationFrame ||
        w.msRequestAnimationFrame ||
        w.mozRequestAnimationFrame;

    this.vendor =
        (/webkit/i).test(navigator.appVersion) ? '-webkit' :
            (/firefox/i).test(navigator.userAgent) ? '-moz' :
                (/msie/i).test(navigator.userAgent) ? 'ms' :
                    'opera' in window ? '-o' : '';

    this.init = function(canvasObj){
        canvas = canvasObj;
        options.states = {
            Loading : new Loading(),
            Menu : new Menu(),
            Gameplay : new Gameplay()
        };
        Screenmanager.init(options,canvas);
    };

    this.start = function(){
        Screenmanager.setInstance('Loading');
    };

    // The main game loop
    var main = function () {
        var now = Date.now();
        var delta = now - then;

        update(delta / 1000);
        render();

        then = now;

        // Request to do this again ASAP
        requestAnimationFrame(main);
    };

    function animate(myRectangle, canvas, context, startTime) {
        // update
        var time = (new Date()).getTime() - startTime;

        var linearSpeed = 100;
        // pixels / second
        var newX = linearSpeed * time / 1000;

        if(newX < canvas.width - myRectangle.width - myRectangle.borderWidth / 2) {
            myRectangle.x = newX;
        }

        // clear
        context.clearRect(0, 0, canvas.width, canvas.height);

        drawRectangle(myRectangle, context);

        // request new frame
        requestAnimFrame(function() {
            animate(myRectangle, canvas, context, startTime);
        });
    };

});
