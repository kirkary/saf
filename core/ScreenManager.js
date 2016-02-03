var ScreenManager = (function(){

    var states = null;
    var currentState = null;
    var canvas = null;
    var _this = this;
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
            states[st].init(canvas,_this);
        }
    };

    this.addInstance = function(name, stateInstance) {
        states[name] = stateInstance;
    };

    this.setInstance = function (nextState, options) {
        var options = options || {};
        if (currentState) {
            currentState.onLeave();
        }
        currentState = states[nextState];
        currentState.onEnter(options);
    };

    this.getCurrentState = function(){
        return currentState;
    };

});