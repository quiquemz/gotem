// This code belongs to Niels Vadot
// https://codepen.io/ninivert/pen/BpLKRx?editors=0010

CanvasRenderingContext2D.prototype.drawBreakingText = function (str, x, y, w, lh, method) {

    // Fixing input
    str = str || '';
    x = x || 0;
    y = y || 0;
    w = w || this.canvas.width;
    lh = lh || 1;
    method = method || 'fill';

    // local variables and defaults
    let textSize = parseInt(this.font.replace(/\D/gi, ''));
    let words = [];
    let currLine = '';
    let testLine = '';
    let textParts = str.split('\n');
    let textPartsNo = textParts.length;

    // split the words of the parts
    for (let i = 0; i < textParts.length; i++) {
        words[i] = textParts[i].split(' ');
    }

    // now that we have extracted the words
    // we reset the textParts
    textParts = [];

    // calculate recommended line breaks
    // split between the words
    for (let i = 0; i < textPartsNo; i++) {

        // clear the testline for the next manually broken line
        currLine = '';

        for (let j = 0; j < words[i].length; j++) {
            testLine = currLine + words[i][j] + ' ';

            // check if the testLine is of good width
            if (this.measureText(testLine).width > w && j > 0) {
                textParts.push(currLine);
                currLine = words[i][j] + ' ';
            } else {
                currLine = testLine;
            }
        }
        // replace is to remove trailing whitespace
        textParts.push(currLine);
    }

    // render the text on the canvas
    for (let i = 0; i < textParts.length; i++) {
        if (method === 'fill') {
            this.fillText(textParts[i].replace(/((\s*\S+)*)\s*/, '$1'), x, y+(textSize*lh*i));
        } else if (method === 'stroke') {
            this.strokeText(textParts[i].replace(/((\s*\S+)*)\s*/, '$1'), x, y+(textSize*lh*i));
        } else if (method === 'none') {
            return {'textParts': textParts, 'textHeight': textSize*lh*textParts.length};
        } else {
            console.warn('drawBreakingText: ' + method + 'Text() does not exist');
            return false;
        }
    }

    return {'textParts': textParts, 'textHeight': textSize*lh*textParts.length};
};