
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
        main();
    };

    // Main loop
    var main = function () {
        Screenmanager.getCurrentState().update();
        Screenmanager.getCurrentState().render();
        requestAnimationFrame(main);
    };

});
