/**
 * Created by Kirill on 07.01.16.
 */

var Loading = (function () {

    this.name = 'Loading';
    var assets = {
        symbols: [],
        loaderGraphics: [
            "img/load_shroom1.png",
            "img/load_grass1.png",
            "img/load_tree1.png",
            "img/load_shroom2.png",
            "img/load_shroom3.png"
        ]
    };
    var assetsLoaded = 0;
    var _this = this;
    //Loading images array
    var loadingImages = [];
    var finishedLoadingImages = 0;
    var animatedImagesPerSymbol =0;
    var loadingImagesSpeed = 120; //speed of loading images vertical "rising"
    // Loading text position
    var loadingPosX = context.canvas.clientWidth / 2;
    var loadingPosY = context.canvas.clientHeight / 2;
    var loadingComplete = false;
    //UI
    var playBtn = null;
    /**
     * Parse json obtained from the server response
     * @param xhr - XmlHttpRequest
     */
    function parseJSON(xhr) {
        return JSON.parse(xhr.responseText);
    }

    /**
     * Loads assets. Used as callback function in request
     * @param xhr - XmlHttpRequest
     */
    this.loadSymbols = function (xhr) {
        var paths = parseJSON(xhr);
        var symbolsAmount = paths['symbols'].length;
        animatedImagesPerSymbol = Math.ceil(Math.random() * 4) + 2;
        for (var i = 0; i < symbolsAmount; i++) {
            var img = new Image();
            img.onload = function () {
                assetsLoaded++;
                //Simulate loading delay
                for (var k = 0; k < animatedImagesPerSymbol; k++) //random numbers for loading animation
                {
                    setTimeout(function () {
                        var image = new Image();
                        //Make loading image
                        var scale = Math.random() + 0.3;
                        image.src = assets.loaderGraphics[Math.floor(Math.random() * assets.loaderGraphics.length)];
                        image.width *= scale;
                        image.height *= scale;
                        var newLoadImg = {
                            img: image,
                            posX: (Math.random() * context.canvas.clientWidth),
                            posY: _this.ctx.canvas.clientHeight
                        };
                        loadingImages.push(newLoadImg);
                        finishedLoadingImages++;
                    }, Math.floor((Math.random() * 3000) + 1000));
                }
            };
            img.src = paths['symbols'][i]['symPath'];
            assets.symbols.push(img);
        }
    };
    /**
     *
     * @param reqUri - request uri
     * @param callback - function to execute in callback
     * @param type - Server response type
     */
    this.xhrGet = function (reqUri, callback, type) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", reqUri, true);

        if (type) {
            xhr.responseType = type;
        }

        xhr.onload = function () {
            if (callback) {
                try {
                    callback(xhr)
                }
                catch (e) {
                    throw 'ERROR: xhrGet request failed' +
                    '\n' + reqUri +
                    '\nExeption : ' + e +
                    '\nResponse Text : ' + xhr.responseText;
                }
            }
        };
        xhr.send();
    };

    this.update = function (delta) {
        loadingPosY = context.canvas.clientHeight / 2 + Math.sin(Date.now()/5 * delta) *20;
        if (!loadingComplete) {
            var completedImages = 0; //set counter of animated images to zero
            for (var i = 0; i < loadingImages.length; i++) {
                var img = loadingImages[i];
                if (img.posY > context.canvas.clientHeight - img.img.height) {
                    img.posY -= loadingImagesSpeed * delta;
                }
                /*If image became static (finished animation)
                 * check whether it was the last one to animate
                 * and every symbol (asset) got animated images
                 * than complete loading animation
                 */
                else {
                    completedImages++;
                    if (finishedLoadingImages == completedImages && loadingImages.length == animatedImagesPerSymbol*assetsLoaded) {
                        loadingComplete = true;
                        if(!playBtn){
                            context.clearRect(0, loadingPosY - 84, context.canvas.clientWidth, 168); // clear loading text
                            playBtn = document.createElement('button');
                            playBtn.id = 'play';
                            var t = document.createTextNode('Play');       // Create a text node
                            playBtn.appendChild(t);
                            playBtn.setAttribute('class','ui playBtn');
                            document.getElementById('controls').appendChild(playBtn);
                            playBtn.style.left = loadingPosX - playBtn.offsetWidth / 2 + 'px';
                            //add switch function
                            playBtn.addEventListener('click', function(){
                                _this.scrManager.setInstance('Gameplay',assets);
                            });
                        }
                    }
                }

            }
        }
    };
    this.render = function () {
        if (!loadingComplete) {
            context.clearRect(0, 0, context.canvas.clientWidth, context.canvas.clientHeight);
            context.textAlign = 'center';
            context.font = '42px Arial';
            context.fillStyle = '#35b9f2';
            context.fillText('Loading', loadingPosX, loadingPosY);
            for (var i = 0; i < loadingImages.length; i++) {
                var img = loadingImages[i];
                context.drawImage(img.img, img.posX, img.posY, img.img.width, img.img.height);
            }
        }
        else {
            playBtn.style.top = loadingPosY - playBtn.offsetHeight / 2+'px';
        }
    };

});
Loading.prototype = Object.create(Screen.prototype);

Loading.prototype.onEnter = function () {
    this.xhrGet('cfg/config.json', this.loadSymbols, null);
};

Loading.prototype.onLeave = function () {
    //TODO wrap in clear function
    document.getElementById('controls').removeChild(document.getElementById('play'));
};
