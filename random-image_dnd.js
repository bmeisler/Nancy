
var loadem = function() {

    var draggableItem = function() {
        console.log("new instance of draggableItem");
        var my = {};

        function addListeners() {
            console.log("addListeners");
            //var that = this;//BEST PART OF MODULE - DON'T HAVE TO DO THIS NONSENSE ANYMORE!
            my.mc.useHandCursor = true;
            my.mc.mouseEnabled = true;
            my.mc.mouseChildren = false;

            this.rolloverListener = my.mc.on("rollover", function(evt) {
                my.mc.cursor = 'pointer';
            });
            this.rolloutListener = my.mc.on("rollout", function(evt) {
                my.mc.cursor = 'default';
            });

            this.mousedownListener = my.mc.on("mousedown", function(evt) {
                this.offset = {
                    x: my.mc.x - evt.stageX,
                    y: my.mc.y - evt.stageY
                };
            });

            // the pressmove event is dispatched when the mouse moves after a mousedown on the target until the mouse is released.
            this.pressMoveListener = my.mc.on("pressmove", function(evt) {
                this.x = evt.stageX + this.offset.x;
                this.y = evt.stageY + this.offset.y;
                console.log("this.x: " + this.x);
                my.callback(this); //
            });

            this.pressupListener = my.mc.on("pressup", function(evt) {
                console.log("DNDItem mouse up");
                my.callback2(this);
            });
        }

        function init(_main, _mc, _callback, _callback2) {
            console.log("draggableItem::init()");
            my.main = _main;
            this.mc = _mc;
            my.mc = _mc;
            my.callback = _callback;
            my.callback2 = _callback2;
            addListeners();
            return my; //the key - holds all the data for outside use
        }
        var mc = null;
        return {
            init: init,
            mc: mc
        };
    };

    function loadImages(sources, callback) {
        console.log("loadImages");

        var images = {};
        var loadedImages = 0;
        var numImages = sources.length;

        for (var src in sources) {
            images[src] = new Image();
            images[src].onload = function() {
                if (++loadedImages >= numImages) {
                    callback(images);
                }
            };
            images[src].src = sources[src];
            console.log("images[src].src: " + images[src].src);

        }


    }

    function shuffle(array) {
        var currentIndex = array.length,
            temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    function spliceIt(obj) {
        console.log("spliceIt");
        obj.parent.setChildIndex(obj, obj.parent.getNumChildren() - 1); //put it on top while dragging
    }

    function diceIt() {
        console.log("diceit");
    }

    function handleFileComplete() {
        imagesLoaded++;
        console.log("imagesLoaded: " + imagesLoaded);

        var container = new createjs.Container();
        stage.addChild(container);

        if (imagesLoaded === 4) {
            loadImages(finalFourImages, function(images) { //turn the final four random urls into images and call them back here
                console.log("loadimages");
                console.log("images width: " + images[0].width);

                var maxWidth = 170; // Max width for the image
                var maxHeight = 170; // Max height for the image
                var ratio = 0; // Used for aspect ratio

                console.log("images[i]: " + images[0]);


                var i, previousWidth = 0,
                    spacer, bitmap, sprite;

                for (i = 0; i < 4; i++) {

                    if (i === 0) {
                        spacer = 0;
                    } else {
                        spacer = 30;
                    }
                    var width, height;
                    var dndItem, tile;
                    var originalWidth = images[i].width; // Current image width
                    var originalHeight = images[i].height; // Current image height

                    // Check if the current width is larger than the max
                    if (originalWidth > maxWidth) {
                        ratio = maxWidth / originalWidth; // get ratio for scaling image

                        height = originalHeight * ratio; // Reset height to match scaled image
                        width = originalWidth * ratio; // Reset width to match scaled image
                    }

                    // Check if current height is larger than max
                    if (originalHeight > maxHeight) {
                        ratio = maxHeight / originalHeight; // get ratio for scaling image

                        width = originalWidth * ratio; // Reset width to match scaled image
                        height = originalHeight * ratio; // Reset height to match scaled image
                    } else if (originalHeight < maxHeight) {
                        ratio = maxHeight / originalHeight; // get ratio for scaling image

                        width = originalWidth * ratio; // Reset width to match scaled image
                        height = originalHeight * ratio; // Reset height to match scaled image
                    }

                    //context.drawImage(images[i], previousWidth, 20, width, height);

                    var finalRatio = width / originalWidth;
                    bitmap = new createjs.Bitmap(finalFourImages[i]);
                    bitmaps.push(bitmap);
                    container.addChild(bitmap);
                    bitmap.scaleX = finalRatio;
                    bitmap.scaleY = finalRatio;
                    bitmap.x = previousWidth;
                    previousWidth += width;

                    dndItem = draggableItem();
                    dndItem.init(this, bitmap, spliceIt, diceIt);

                }

            })
        }

    }
    var imagesLoaded = 0;
    var canvas = document.getElementById('myCanvas');
    //var context = canvas.getContext('2d');
    //context.clearRect(0, 0, canvas.width, canvas.height);

    //NOTE: CAN'T HAVE CONTEXT AND A CJS STAGE AT THE SAME TIME!!! CHOOSE ONE OR THE OTHER!

    var preload = new createjs.LoadQueue(false); //setting this value to false allows local preloading
    preload.addEventListener("fileload", handleFileComplete);

    var stage = new createjs.Stage(canvas);
    createjs.Ticker.addEventListener("tick", stage);
    // enable touch interactions if supported on the current device:
    createjs.Touch.enable(stage);
    // enabled mouse over / out events
    stage.enableMouseOver(10);
    stage.mouseMoveOutside = true; // keep tracking the mouse even when it leaves the canvas

    var insertBar = new createjs.Shape(); //will light up to show us where the bitmap being dragged will drop
    insertBar.graphics.beginFill("green").drawRect(0, 0, 5, 170);

    var bitmaps = [];
    //  var circle = new createjs.Shape();
    // circle.graphics.beginFill("red").drawCircle(0, 0, 50);
    // circle.x = 100;
    // circle.y = 100;
    // stage.addChild(circle);


    //var nancyArray = [{nanc11: 'nancya.png'}, {nancy2:'nancyb.png'}, {nancy3:'nancyc.png'}, {nancy4:'nancyd.png'}];
    var stripsArray = [
        ['nancya.jpg', 'nancyb.jpg', 'nancyc.jpg', 'nancyd.jpg'],
        ['nancy3a.jpg', 'nancy3b.jpg', 'nancy3c.jpg', 'nancy3d.jpg'],
        ['nancy4a.jpg', 'nancy4b.jpg', 'nancy4c.jpg', 'nancy4d.jpg'],
        ['nancy6a.jpg', 'nancy6b.jpg', 'nancy6c.jpg', 'nancy6d.jpg'],
        ['nancy7a.jpg', 'nancy7b.jpg', 'nancy7c.jpg', 'nancy7d.jpg'],
        ['nancy8a.jpg', 'nancy8b.jpg', 'nancy8c.jpg', 'nancy8d.jpg'],
        ['nancy-explodeinmyface.jpg', 'nancy-Shining.jpg', 'threerocks.jpg', 'nancyhippie.jpg'],
        ["candya.jpg", "candyb.jpg", "candyc.jpg", "candyd.jpg"],
        ["santaa.jpg", "santab.jpg", "santac.jpg", "santad.jpg"],
        ["peanutsa.jpg", "peanutsb.jpg", "peanutsc.jpg", "peanutsd.jpg"],
        ["bubblesa.jpg", "bubblesb.jpg", "bubblesc.jpg", "bubblesd.jpg"],
        ["walkiea.jpg", "walkieb.jpg", "walkiec.jpg", "walkied.jpg"],
        ["raggeda.jpg", "raggedb.jpg", "raggedc.jpg", "raggedd.jpg"]
    ];

    var fourRandomStrips = _.sample(stripsArray, 4);
    console.log(fourRandomStrips);

    //shuffle(nancyArray);
    var i, finalFourImages = [],
        newImage;
    //var home = '../wp-content/images/'//for wordpress
    var home = ''; //local testing
    for (i = 0; i < fourRandomStrips.length; i++) {
        shuffle(fourRandomStrips[i]);
        newImage = home + "nancyimages/" + fourRandomStrips[i][0];
        //finalFourImages.push(home + "nancyimages/" + fourRandomStrips[i][0]);
        finalFourImages.push(newImage);
        preload.loadFile(newImage);
    }
    console.log(fourRandomStrips);
    console.log(finalFourImages);


    //var sources = {nancyArray[0], nancyArray[1]};

};