function timestamp() {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

var Game = (function(){
    var canvas = null;
    var options = {
        canvasScale:1,
        states: {}
    };
    var Screenmanager = new ScreenManager();
    var w = window;

    var now,
        dt   = 0,
        last = timestamp(),
        step = 1/60;

    var requestAnimationFrame =
        w.requestAnimationFrame ||
        w.webkitRequestAnimationFrame ||
        w.msRequestAnimationFrame ||
        w.mozRequestAnimationFrame;

    this.controls = document.getElementById("controls");

    this.init = function(canvasObj,scale){
        canvas = canvasObj;
        options.canvasScale = scale;
        options.states = {
            Loading : new Loading(),
            Menu : new Menu(),
            Gameplay : new Gameplay()
        };
        Screenmanager.init(options,canvas);
    };

    this.start = function(){
        Screenmanager.setInstance('Loading');
        requestAnimationFrame(main);
    };

    // Main loop
     var main = function() {
        var currState = Screenmanager.getCurrentState();

         now = timestamp();
         dt = dt + Math.min(1, (now - last) / 1000);
         while(dt > step) {
             dt = dt - step;
             currState.update(step);
         }
         currState.render();
         last = now;
         requestAnimationFrame(main);
    };

    this.getCurrentState = function(){
        return Screenmanager.getCurrentState();
    }

    this.setScale = function(scale){
        Screenmanager.setScale(scale);
    }

});
