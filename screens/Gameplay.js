/**
 * Created by Kirill on 07.01.16.
 */

var Gameplay = (function() {
    this.name = 'Gameplay';
    this.options = null;
    var bg;
    var inited = false;
    var symbols = [];   //array of symbols passed from loading screen
    //Reel canvas
    var reel = document.getElementById('reel');
    var reelCtx = reel.getContext('2d');
    var symAmount, //total symbols amount
        hiddenSymAmount, //hidden symbols amount
        divAmount,  //dividers amount
        topPoint,   //point where symbols start rendering
        dividerOffset, //offset between symbol and divider
        spinning = false, //indicate if reel spins
        reelWellPos = true, //indicate if reel in right position (3 symbols on screen)
        reelSpeed = 1000,
        reelArray = [];     //array of symbols and dividers
    bg = new Image();
    bg.src = 'img/BG.png';

    const REEL_TO_CANVAS_W = 0.5; //reelCanvas / mainCanvas ratio
    const VISIBLE_SYM_AMOUNT = 3; //amount of visible symbols on the reel

    var initScr = function(){
        //set reel canvas options
        reel.width = context.canvas.clientWidth * REEL_TO_CANVAS_W;
        reel.height = context.canvas.clientHeight;

        //get symbols passed from loading screen
        symbols = _options.symbols;
        //while(_options.symbols.length){
        //    var num = Math.floor((Math.random() * _options.symbols.length));
        //    symbols.push(_options.symbols[num]);
        //    _options.symbols.splice(num,1);
        //}
        //Set spin button
        spinBtn = document.createElement('button');
        spinBtn.id = 'spin';
        spinBtn.setAttribute('class','ui spinBtn active');
        document.getElementById('controls').appendChild(spinBtn);
        spinBtn.style.left = 4*(context.canvas.clientWidth/6) + 'px';
        spinBtn.style.top = 2*(context.canvas.clientHeight/5) + 'px';
        spinBtn.addEventListener('click', function(){
            if(!spinning)
            {
                spinning = true;
                spinBtn.setAttribute('class','ui spinBtn');
                setTimeout(function () {
                    spinning = false;
                    spinBtn.setAttribute('class','ui spinBtn active');
                }, Math.floor((Math.random() * 3000) + 1000));
            }
        });

        //form reel
        symAmount = symbols.length;
        hiddenSymAmount = symAmount - VISIBLE_SYM_AMOUNT;
        divAmount = symAmount;
        dividerOffset = (reelCtx.canvas.clientHeight - symbols[0].height * VISIBLE_SYM_AMOUNT) /(VISIBLE_SYM_AMOUNT + 1);
        topPoint = (symbols[0].height+dividerOffset*2+18) * hiddenSymAmount * (-1) - dividerOffset*2 -18;
        var posY = topPoint;
        for(var i = 0; i < symAmount; i++){
            var betLine = new Image();
            betLine.src = 'img/Bet_Linee.png';
            posY+=dividerOffset;
            reelArray.push({sym:betLine,posY:posY});
            posY+=betLine.height;
            posY+=dividerOffset;
            reelArray.push({sym:symbols[i],posY:posY,typeSym:true});
            posY+=symbols[i].height;
        }
        window.dividerOffset = dividerOffset;
    };

    window.syms = reelArray;

    var spinReel = function(delta){
        for (var i = 0; i < reelArray.length; i++) {
            reelArray[i].posY += delta*reelSpeed;
            if (reelArray[i].posY >= reelCtx.canvas.clientHeight)
                reelArray[i].posY = topPoint;
        }
    };

    var reelIsWellPos = function(){
        for (var i = 0; i < reelArray.length; i++) {
            if(reelArray[i].typeSym)
            {
                var diff = reelArray[i].posY + reelArray[i].sym.height/2 - reelCtx.canvas.clientHeight /2;
                if(Math.abs(diff) <= 5) {
                    return true;
                }
            }
        }
    };

    this.update = function (delta) {
        if(!inited)
        {
            initScr();
            inited = true;
        }
        if(spinning)
        {
            reelWellPos = false;
            spinReel(delta);
        }
        //if spinning end but reel is not in the right position
        else if(!spinning && !reelWellPos)
        {
            spinReel(delta);
            if(reelIsWellPos())
                reelWellPos = true;
        }
    };
    this.render = function ()
    {
        context.clearRect(0, 0, context.canvas.clientWidth, context.canvas.clientHeight);
        context.drawImage(bg, 0, 0, bg.width, bg.height);

        reelCtx.clearRect(0, 0, reelCtx.canvas.clientWidth, reelCtx.canvas.clientHeight);
        //reelCtx.fillStyle="#fff";
        //reelCtx.fillRect(0,0,reelCtx.canvas.clientWidth,reelCtx.canvas.clientHeight);
        for(var i = 0; i < reelArray.length; i++){
            reelCtx.drawImage(reelArray[i].sym, 0,reelArray[i].posY, reelCtx.canvas.clientWidth, reelArray[i].sym.height);
        }
    };
});
Gameplay.prototype = Object.create(Screen.prototype);
Gameplay.prototype.onEnter = function (options) {
    this.options = options || {};
    if(options)
    {
        _options = options;
    }
    context.clearRect(0, 0, context.canvas.clientWidth, context.canvas.clientHeight);
};