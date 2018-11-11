var divRoot = document.getElementById('div-root');

var audioMusic = createAudioElement({
    'audio/ogg': 'static/sounds/music.ogg',
    'audio/mpeg': 'static/sounds/music.mp3'
});
audioMusic.loop = true;
audioMusic.volume = 0.8;

var audioReact = createAudioElement({
    'audio/ogg': 'static/sounds/react.ogg',
    'audio/mpeg': 'static/sounds/react.mp3'
});

var imageFrames = [];
var imageIndex = 0;
var freeze = false;

function createAudioElement(sources) {
    var audio = document.createElement('audio');

    Object.keys(sources).forEach(function(key) {
        var source = document.createElement('source');
        source.type = key;
        source.src = sources[key];
        audio.appendChild(source);
    });

    return audio;
}

function setFrame(index) {
    for(var i = 0; i < imageFrames.length; ++i) {
        imageFrames[i].style.display = i === index ? 'block' : 'none';
    }
}

function updateFrame() {
    if(!freeze && imageIndex > 0) --imageIndex;
    setFrame(imageIndex);
}

function squeez(e) {
    try { if(audioMusic.paused) audioMusic.play(); } catch(err) {}

    if(!freeze) return;

    var src = e.target || e.srcElement;

    var x, y;
    if(e.type === 'mousemove') {
        x = e.pageX;
        y = e.pageY;
    } else if(e.type === 'touchmove') {
        x = e.changedTouches[0].pageX;
        y = e.changedTouches[0].pageY;
    }

    var f = y / divRoot.offsetHeight;
    f = Math.abs(f) * (imageFrames.length - 1);
    f = Math.round(f);
    imageIndex = Math.min(f, imageFrames.length - 1);
}

for(var i = 0; i < 11; ++i) {
    var image = document.createElement('img');
    image.src = 'static/images/' + i.toString() + '.png';
    image.className = 'image-frame';
    image.style.display = 'none';
    image.draggable = false;

    divRoot.appendChild(image);

    imageFrames[i] = image;
}

divRoot.addEventListener('mousedown', function(e) { freeze = true; });
divRoot.addEventListener('mouseup', function(e) { freeze = false; });
divRoot.addEventListener('mousemove', function(e) { squeez(e); });

divRoot.addEventListener('touchstart', function(e) { freeze = true; });
divRoot.addEventListener('touchend', function(e) { freeze = false; });
divRoot.addEventListener('touchmove', function(e) { squeez(e); });

setInterval(updateFrame, 50);