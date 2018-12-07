document.addEventListener('DOMContentLoaded', function() {

    // Constants
    const PAD = 10;

    // HTML elements
    const memeCard = document.getElementById('meme-card');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext("2d");
    const img = document.createElement('img');
    const topText = document.getElementById('top-text-input');
    const topSizer = document.getElementById('top-text-size');

    // Input for user
    let topTextVal = topText.value.toUpperCase();
    let topSizeVal = topSizer.value;
    let bottomText = document.getElementById('bottom-text-input');
    let bottomSizer = document.getElementById('bottom-text-size');
    let bottomTextVal = bottomText.value.toUpperCase();
    let bottomSizeVal = bottomSizer.value;

    function draw() {
        // Canvas Part
        memeCard.appendChild(img);

        canvas.height = img.height;
        canvas.width = img.width;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        memeCard.removeChild(img);
        memeCard.appendChild(canvas);

        // Top Text Part
        ctx.fillStyle = '#FFF';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = canvas.width*0.004;

        ctx.font = topSizeVal + 'px ' + 'Impact';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        ctx.drawBreakingText(topTextVal, canvas.width/2, PAD, null, 1, 'fill');
        ctx.drawBreakingText(topTextVal, canvas.width/2, PAD, null, 1, 'stroke');

        // Bottom Text Part
        ctx.fillStyle = '#FFF';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = canvas.width*0.004;

        ctx.font = bottomSizeVal + 'px ' + 'Impact';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';

        ctx.drawBreakingText(bottomTextVal, canvas.width/2, canvas.height-PAD, null, 1, 'fill');
        ctx.drawBreakingText(bottomTextVal, canvas.width/2, canvas.height-PAD, null, 1, 'stroke');
    }

    // Draw image on load
    img.onload = function() {
        draw();
    };

    // Draw image on top text input change
    topText.oninput = function() {
        topTextVal = topText.value.toUpperCase();
        draw();
    };

    // Draw image on top text input change
    topSizer.oninput = function() {
        topSizeVal = topSizer.value;
        topSizer.labels[0].childNodes[1].innerText = topSizeVal;
        draw();
    };

    // Draw image on bottom text input change
    bottomText.oninput = function() {
        bottomTextVal = bottomText.value.toUpperCase();
        draw();
    };

    // Draw image on bottom text input change
    bottomSizer.oninput = function() {
        bottomSizeVal = bottomSizer.value;
        bottomSizer.labels[0].childNodes[1].innerText = bottomSizeVal;
        draw();
    };

    img.src = 'img/meme6.jpg'; // Set source path

});