
var Game = (function(){
    var canvas = null;
    var options = {
        states: {}
    };
    var Screenmanager = new ScreenManager();
    var w = window;

    var delta = 1;

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
        lastTime = Date.now();
        setInterval(main, 1);
    };

    // Main loop
     var main = function() {
        var currState = Screenmanager.getCurrentState();

         currState.update(delta/1000);
         currState.render();

    }

    this.getCurrentState = function(){
        return Screenmanager.getCurrentState();
    }

});
