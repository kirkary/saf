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
        nextSpinReady = true, //indicate if reel in right position (3 symbols on screen)
        reelSpeed = 2000,
        chosenSym = '',
        currReelSym ='',    //current symbols at reel's center
        reelArray = [],     //array of symbols and dividers
        bufferArray = [],
        scale = 1,
        spinBtn = null;
    bg = new Image();
    bg.src = 'img/BG.png';

    const REEL_TO_CANVAS_W = 0.5; //reelCanvas / mainCanvas ratio
    const VISIBLE_SYM_AMOUNT = 3; //amount of visible symbols on the reel
    const DEFAULT_REEL_SPEED = 2000;
    //const TOP_BOT_REEL_OFFSET = 10;
    const BET_LINE_HEIGHT = 18;
    const MIN_SPIN_TIME = 2000;
    const MAX_SPIN_TIME = 8000;

    var initScr = function(){
        //set reel canvas options
        reel.width = context.canvas.clientWidth * REEL_TO_CANVAS_W;
        reel.height = context.canvas.clientHeight;
        scale = _this.scrManager.canvasScale;
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
        spinBtn.style.left = 4*(context.canvas.clientWidth/6) + 'px';
        spinBtn.style.top = 2*(context.canvas.clientHeight/5) + 'px';
        document.getElementById('controls').appendChild(spinBtn);
        spinBtn.style.width = spinBtn.offsetWidth*_this.scrManager.canvasScale+ 'px';
        spinBtn.style.height = spinBtn.offsetHeight*_this.scrManager.canvasScale+ 'px';
        spinBtn.addEventListener('click', function(){
            if(!spinning && nextSpinReady)
            {
                spinning = true;
                spinBtn.setAttribute('class','ui spinBtn');
                chosenSym = document.getElementById('chooseSym').value;
                setTimeout(function () {
                    spinning = false;   //stop main spinning
                }, Math.floor((Math.random() * (MAX_SPIN_TIME - MIN_SPIN_TIME)) + MIN_SPIN_TIME));
            }
        });

        //form symbols select
        var dropdown = document.createElement('select');
        dropdown.id = 'chooseSym';
        dropdown.setAttribute('class','ui dropdown');
        dropdown.style.top = context.canvas.clientHeight/6 + 'px';
        dropdown.style.left = 3*context.canvas.clientWidth/5 + 'px';
        for (var j = 0; j<symbols.length; j++){
            var opt = document.createElement('option');
            opt.value = symbols[j].name;
            opt.innerHTML = symbols[j].name;
            dropdown.appendChild(opt);
        }
        document.getElementById('controls').appendChild(dropdown);

        //form reel
        symAmount = symbols.length;
        hiddenSymAmount = symAmount - VISIBLE_SYM_AMOUNT;
        divAmount = symAmount;
        dividerOffset = (reelCtx.canvas.clientHeight - (symbols[0].img.height*scale + BET_LINE_HEIGHT *scale)* VISIBLE_SYM_AMOUNT) /(VISIBLE_SYM_AMOUNT + 1);
        topPoint = 0 - (symbols[0].img.height*scale+BET_LINE_HEIGHT*scale+dividerOffset*2);
        var posY = topPoint;
        for(var i = 0; i < symAmount; i++){
            symbols[i].img.height = symbols[i].img.height*scale; //scale symbols
            symbols[i].img.width = symbols[i].img.width*scale;
            var betLine = new Image();
            betLine.src = 'img/Bet_Linee.png';
            if(i < VISIBLE_SYM_AMOUNT +1)
            {
                    reelArray.push({sym:symbols[i].img,name:symbols[i].name,posY:posY,typeSym:true});
                    posY+=symbols[i].img.height;
                    posY+=dividerOffset;
                    reelArray.push({sym:betLine,posY:posY});
                    posY+=BET_LINE_HEIGHT*scale;
                    posY+=dividerOffset;
            }
            else
            {
                bufferArray.push({sym:symbols[i].img,name:symbols[i].name,posY:0,typeSym:true});
                bufferArray.push({sym:betLine,posY:0});
            }
        }
    };

    var spinReel = function(speed){
        for (var i = 0; i < reelArray.length; i++) {
            if (reelArray[i].posY >= reelCtx.canvas.clientHeight)
            {
                bufferArray.unshift(reelArray.splice(i,1)[0]);
                var headSym = bufferArray.splice(bufferArray.length-1,1)[0];
                headSym.posY = topPoint+speed-dividerOffset*2;
                reelArray.unshift(headSym);
                break;
            }
            if(i==0)
                reelArray[i].posY += speed;
            else{
                if(!reelArray[i].typeSym)
                    reelArray[i].posY = reelArray[i-1].posY+reelArray[i-1].sym.height+dividerOffset; //if previous sym is not line use only height to set pos
                else
                    reelArray[i].posY = reelArray[i-1].posY+reelArray[i-1].sym.height*scale+dividerOffset; //else use height with scale
            }
        }
    };

    var reelIsWellPos = function(){
        for (var i = 0; i < reelArray.length; i++) {
            if(reelArray[i].typeSym)
            {
                var diff = reelArray[i].posY + reelArray[i].sym.height/2 - reelCtx.canvas.clientHeight /2;
                if(Math.abs(diff) <= 5) {
                    currReelSym = reelArray[i].name;
                    reelSpeed = DEFAULT_REEL_SPEED; //reset speed to default
                    spinBtn.setAttribute('class','ui spinBtn active'); //activate spin button
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
            return;
        }
        if(spinning)
        {
            nextSpinReady = false;
            spinReel(reelSpeed*delta);
        }
        //if spinning finished but reel is not in the right position
        else if(!spinning && !nextSpinReady)
        {
            spinReel(reelSpeed*delta/5);
            if(reelIsWellPos())
            {
                if(chosenSym == currReelSym)
                    console.log('You won! Stopped symbol is: '+currReelSym);
                else
                    console.log('You lose! Stopped symbol is: '+currReelSym);
                nextSpinReady = true;
            }
        }
    };
    this.render = function ()
    {
        context.clearRect(0, 0, context.canvas.clientWidth, context.canvas.clientHeight);
        reelCtx.clearRect(0, 0, reelCtx.canvas.clientWidth, reelCtx.canvas.clientHeight);

        context.drawImage(bg, 0, 0, context.canvas.clientWidth, context.canvas.clientHeight);
        for(var i = 0; i < reelArray.length; i++){
            reelCtx.drawImage(reelArray[i].sym, 0,reelArray[i].posY, reelCtx.canvas.clientWidth, reelArray[i].sym.height);
            //reelCtx.rect(0,reelArray[i].posY, reelArray[i].sym.width*_this.scrManager.canvasScale, reelArray[i].sym.height*_this.scrManager.canvasScale);
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