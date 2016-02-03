/**
 * Base for screens entities
 * @type {Function}
 */

var Screen = function (){
    var canvas = null;
    var _options = null;
    this.ctx = null;
    this.scrManager = null;
};
Screen.prototype.init = function(scrCanvas, scrManager){
    canvas = scrCanvas;
    this.ctx = canvas.getContext('2d');
    this.scrManager = scrManager;
};
Screen.prototype.onEnter = function(options){
    _options = options || {};
    console.log("On enter " + this.name);
    console.log("Clear rect on enter");
    this.ctx.clearRect(0, 0, context.canvas.clientWidth, context.canvas.clientHeight);
};
Screen.prototype.onLeave = function(){
    console.log("On leave " + this.name);
    console.log("Clear rect on leave");
    this.ctx.clearRect(0, 0, context.canvas.clientWidth, context.canvas.clientHeight);
};

Screen.prototype.render = function(){
};

