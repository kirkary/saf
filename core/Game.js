function timestamp() {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

var Game = (function(){
    var canvas = null;
    var options = {
        states: {}
    };
    var Screenmanager = new ScreenManager();
    var w = window;
    var now,
        dt   = 0,
        last = timestamp(),
        step = 1/60;

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
        //setInterval(main, 1);
        requestAnimationFrame(main);
    };

    // Main loop
     var main = function() {
        var currState = Screenmanager.getCurrentState();

         now   = timestamp();
         dt = dt + Math.min(1, (now - last) / 1000);
         while(dt > step) {
             dt = dt - step;
             currState.update(dt);
         }
         currState.render();
         last = now;

         requestAnimationFrame(main);
    };

    this.getCurrentState = function(){
        return Screenmanager.getCurrentState();
    }

});
