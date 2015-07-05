
var loadem = function() {



    function loadImages(sources, callback) {
        console.log("loadImages");



        var images = {};
        var loadedImages = 0;
        var numImages = sources.length;
        // get num of sources
        // for(var src in sources) {
        //   numImages++;
        // }
        for (var src in sources) {
            images[src] = new Image();
            images[src].onload = function() {
                if (++loadedImages >= numImages) {
                    callback(images);
                }
            };
            images[src].src = sources[src];
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

    function handleFileComplete() {
        imagesLoaded++;
        console.log("imagesLoaded: " + imagesLoaded);
        if (imagesLoaded === 4) {
            loadImages(finalFourImages, function(images) { //turn the final four random urls into images and call them back here
                console.log("loadimages");
                console.log("images width: " + images[0].width);

                var maxWidth = 170; // Max width for the image
                var maxHeight = 170; // Max height for the image
                var ratio = 0; // Used for aspect ratio




                var i, previousWidth = 0,
                    spacer;

                for (i = 0; i < 4; i++) {

                    if (i === 0) {
                        spacer = 0;
                    } else {
                        spacer = 30;
                    }

                    var width = images[i].width; // Current image width
                    var height = images[i].height; // Current image height

                    // Check if the current width is larger than the max
                    if (width > maxWidth) {
                        ratio = maxWidth / width; // get ratio for scaling image

                        height = height * ratio; // Reset height to match scaled image
                        width = width * ratio; // Reset width to match scaled image
                    }

                    // Check if current height is larger than max
                    if (height > maxHeight) {
                        ratio = maxHeight / height; // get ratio for scaling image

                        width = width * ratio; // Reset width to match scaled image
                        height = height * ratio; // Reset height to match scaled image
                    } else if (height < maxHeight) {
                        ratio = maxHeight / height; // get ratio for scaling image

                        width = width * ratio; // Reset width to match scaled image
                        height = height * ratio; // Reset height to match scaled image
                    }

                    context.drawImage(images[i], previousWidth, 20, width, height);
                    previousWidth += width;
                }

            })
        }

    }
    var imagesLoaded = 0;
    var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    var preload = new createjs.LoadQueue(false); //setting this value to false allows local preloading
    preload.addEventListener("fileload", handleFileComplete);



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