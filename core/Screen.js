/**
 * Base for screens entities
 * @type {Function}
 */

var Screen = function (){
    var canvas = null;
    this.ctx = null;
};
Screen.prototype.init = function(scrCanvas){
    canvas = scrCanvas;
    this.ctx = canvas.getContext('2d');
};
Screen.prototype.onEnter = function(){
};
Screen.prototype.onLeave = function(){
    console.log("My name is " + this.name);
};

Screen.prototype.render = function(){
};

