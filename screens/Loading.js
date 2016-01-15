/**
 * Created by Kirill on 07.01.16.
 */

var Loading = (function() {

    this.name = 'Loading';
    var assets = {
        symbols:[],
        loaderGraphics:[
            "img/load_grass1.png",
            "img/load_shroom1.png",
            "img/load_shroom2.png",
            "img/load_shroom3.png",
            "img/load_tree1.png"
        ]
    };
    var assetsLoaded = 0;
    var _this = this;

    /**
     * Parse json obtained from the server response
     * @param xhr - XmlHttpRequest
     */
    function parseJSON (xhr){
        return JSON.parse(xhr.responseText);
    }
    /**
     * Loads assets. Used as callback function in request
     * @param xhr - XmlHttpRequest
     */
    this.loadSymbols = function(xhr){
        var paths = parseJSON(xhr);
        var symbolsAmount = paths['symbols'].length;
        for(var i = 0; i <symbolsAmount; i++){
            var img = new Image();
            img.onload = function(){
                    assetsLoaded++;
                    //Simulate loading delay
                    setTimeout(function(){
                        var img = new Image();
                        for(var k = 0; k <Math.ceil(Math.random() *20) + 5;k++)
                        {
                            img.src = assets.loaderGraphics[Math.ceil(Math.random() * assets.loaderGraphics.length)];
                            var scale = Math.random()*1.2 + 0.1;
                            var width =img.width*scale;
                            var height = img.height*scale;
                            _this.ctx.drawImage(img,(Math.random() * context.canvas.clientWidth),_this.ctx.canvas.clientHeight - height,width,height);
                        }
                    },Math.floor((Math.random() * 3000) + 1000));
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
    this.xhrGet = function(reqUri, callback, type){
        var xhr = new XMLHttpRequest();
        xhr.open("GET",reqUri,true);

        if(type) {
            xhr.responseType = type;
        }

        xhr.onload = function (){
            if(callback){
                try{
                    callback(xhr)
                }
                catch (e){
                    throw 'ERROR: xhrGet request failed' +
                    '\n'+ reqUri +
                    '\nExeption : ' + e +
                    '\nResponse Text : ' + xhr.responseText;
                }
            }
        };
        xhr.send();
    };
});
Loading.prototype = Object.create(Screen.prototype);

Loading.prototype.onEnter = function(){
    context.textAlign="center";
    context.font="32px Arial";
    context.fillStyle = '#71bbeb';
    context.fillText('Loading',context.canvas.clientWidth/2, context.canvas.clientHeight/2 - 32);
    this.xhrGet('cfg/config.json',this.loadSymbols,null);

};
