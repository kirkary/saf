var ScreenManager = (function(){

    var states = null;
    var currentState = null;
    var canvas = null;

    this.init = function(options,cnvs) {
        options = options || {};
        currentState = null;
        states = {};
        canvas = cnvs;
        if (options.states) {
            states = options.states;
        }
        if (options.currentState) {
            setInstance(options.currentState);
        }
        for (st in states)
        {
            states[st].init(canvas);
        }
    };

    this.addInstance = function(name, stateInstance) {
        states[name] = stateInstance;
    };

    this.setInstance = function (nextState) {
        if (currentState) {
            currentState.onLeave();
        }
        currentState = states[nextState];
        currentState.onEnter();
    };

    this.getCurrentState = function(){
        return currentState;
    };

});