/**
 * Created by Kirill on 07.01.16.
 */

var Gameplay = (function() {
    this.name = 'Gameplay';
    this.options = null;
    var _this = this;
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
        reelSpeed = 2000,
        chosenSym = '',
        reelArray = [];     //array of symbols and dividers
    bg = new Image();
    bg.src = 'img/BG.png';

    const REEL_TO_CANVAS_W = 0.5; //reelCanvas / mainCanvas ratio
    const VISIBLE_SYM_AMOUNT = 3; //amount of visible symbols on the reel
    const DEFAULT_REEL_SPEED = 2000;
    const TOP_BOT_REEL_OFFSET = 10;
    const BET_LINE_HEIGHT = 18;

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
        var spinBtn = document.createElement('button');
        spinBtn.id = 'spin';
        spinBtn.setAttribute('class','ui spinBtn active');
        spinBtn.style.left = 4*(context.canvas.clientWidth/6) + 'px';
        spinBtn.style.top = 2*(context.canvas.clientHeight/5) + 'px';
        document.getElementById('controls').appendChild(spinBtn);
        spinBtn.style.width = spinBtn.offsetWidth*_this.scrManager.canvasScale+ 'px';
        spinBtn.style.height = spinBtn.offsetHeight*_this.scrManager.canvasScale+ 'px';
        spinBtn.addEventListener('click', function(){
            if(!spinning)
            {
                spinning = true;
                spinBtn.setAttribute('class','ui spinBtn');
                chosenSym = document.getElementById('chooseSym').value;
                setTimeout(function () {
                    spinning = false;
                    spinBtn.setAttribute('class','ui spinBtn active');
                }, Math.floor((Math.random() * 3000) + 1000));
            }
        });

        //form symbols select
        var dropdown = document.createElement('select');
        dropdown.id = 'chooseSym';
        dropdown.setAttribute('class','ui dropdown');
        dropdown.style.top = context.canvas.clientHeight/6 + 'px';
        dropdown.style.left = 3*context.canvas.clientWidth/5 + 'px';
        for (var i = 0; i<symbols.length; i++){
            var opt = document.createElement('option');
            opt.value = symbols[i].name;
            opt.innerHTML = symbols[i].name;
            dropdown.appendChild(opt);
        }
        document.getElementById('controls').appendChild(dropdown);

        //form reel
        symAmount = symbols.length;
        hiddenSymAmount = symAmount - VISIBLE_SYM_AMOUNT;
        divAmount = symAmount;
        dividerOffset = (reelCtx.canvas.clientHeight - symbols[0].img.height * VISIBLE_SYM_AMOUNT) /(VISIBLE_SYM_AMOUNT + 1) -TOP_BOT_REEL_OFFSET;
        topPoint = (symbols[0].img.height+dividerOffset*2+BET_LINE_HEIGHT) * hiddenSymAmount * (-1) - dividerOffset*2 -BET_LINE_HEIGHT;
        var posY = topPoint;
        for(var i = 0; i < symAmount; i++){
            var betLine = new Image();
            betLine.src = 'img/Bet_Linee.png';
            posY+=dividerOffset;
            reelArray.push({sym:betLine,posY:posY});
            posY+=BET_LINE_HEIGHT;
            posY+=dividerOffset;
            reelArray.push({sym:symbols[i].img,name:symbols[i].name,posY:posY,typeSym:true});
            posY+=symbols[i].img.height;
        }
        window.dividerOffset = dividerOffset;
    };

    window.syms = reelArray;

    var spinReel = function(delta,speed){
        for (var i = 0; i < reelArray.length; i++) {
            if (reelArray[i].posY >= reelCtx.canvas.clientHeight)
                reelArray[i].posY = topPoint;
            reelArray[i].posY += delta*speed;
        }
    };

    var reelIsWellPos = function(){
        for (var i = 0; i < reelArray.length; i++) {
            if(reelArray[i].typeSym)
            {
                var diff = reelArray[i].posY + reelArray[i].sym.height/2 - reelCtx.canvas.clientHeight /2;
                if(Math.abs(diff) <= 5) {
                    reelSpeed = DEFAULT_REEL_SPEED;
                    if(chosenSym == reelArray[i].name)
                        console.log('You won! Stopped symbol is: '+reelArray[i].name);
                    else
                        console.log('You lose! Stopped symbol is: '+reelArray[i].name);
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
            spinReel(delta,reelSpeed);
            if(reelSpeed > 500)
            reelSpeed-=reelSpeed*delta;
        }
        //if spinning end but reel is not in the right position
        else if(!spinning && !reelWellPos)
        {
            spinReel(delta,reelSpeed/5);
            if(reelIsWellPos())
                reelWellPos = true;
        }
    };
    this.render = function ()
    {
        context.clearRect(0, 0, context.canvas.clientWidth, context.canvas.clientHeight);
        context.drawImage(bg, 0, 0, context.canvas.clientWidth, context.canvas.clientHeight);

        reelCtx.clearRect(0, 0, reelCtx.canvas.clientWidth, reelCtx.canvas.clientHeight);
        //reelCtx.fillStyle="#fff";
        //reelCtx.fillRect(0,0,reelCtx.canvas.clientWidth,reelCtx.canvas.clientHeight);
        for(var i = 0; i < reelArray.length; i++){
            reelCtx.drawImage(reelArray[i].sym, 0,reelArray[i].posY, reelCtx.canvas.clientWidth, reelArray[i].sym.height*_this.scrManager.canvasScale);
            //reelCtx.rect(0,reelArray[i].posY, reelArray[i].sym.width, reelArray[i].sym.height);
            //reelCtx.stroke();
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